from datetime import date
from decimal import Decimal
from typing import Literal, Sequence

from fastapi import HTTPException
from sqlalchemy import func, or_
from sqlalchemy.orm import joinedload
from sqlmodel import Session, select

from ..models import (
    Cliente,
    ItemPedido,
    ItemPedidoInput,
    ItemPedidoUpdate,
    Pedido,
    PedidoCreate,
    PedidoUpdate,
    Produto,
    StatusPedido,
)
from ..utils.imagem import delete_art_image
from .base_service import BaseService


class PedidoService(BaseService[Pedido, PedidoCreate, PedidoUpdate]):
    def __init__(self):
        super().__init__(Pedido)

    def _get_product_info(
        self, session: Session, produto_id: int, preco_input: Decimal | None
    ) -> tuple[Decimal, str]:
        """Busca, valida, define preço e pega nome do produto."""
        produto = session.get(Produto, produto_id)
        if not produto:
            raise HTTPException(
                status_code=404,
                detail=f"Produto com ID {produto_id} não encontrado.",
            )

        # Se não houver valor praticado no input, usa o valor base do produto
        preco = preco_input if preco_input is not None else produto.preco_base

        return preco, produto.nome

    def _validate_discount(
        self, subtotal: Decimal | Literal[0], desconto: Decimal | None
    ):
        """Valida se o novo desconto é compatível com o subtotal atual e se não é negativo."""
        desc_val = desconto or Decimal("0.0")

        if desc_val < 0:
            raise HTTPException(
                status_code=400, detail="O desconto não pode ser um valor negativo."
            )

        if desc_val > subtotal:
            raise HTTPException(
                status_code=400,
                detail=f"O desconto (R$ {desc_val}) não pode ser maior que o subtotal do pedido (R$ {subtotal}). Ajuste os valores e tente novamente.",
            )

    def _recalculate_totals(self, pedido: Pedido):
        """Recalcula o valor total do pedido. (Apenas em memória, previne múltiplos commits)"""
        # Calcula subtotal dos itens
        subtotal = sum(
            (Decimal(item.preco_unitario) * Decimal(item.quantidade))
            for item in pedido.itens
        )

        # Chama a função para validar
        self._validate_discount(subtotal, pedido.desconto)

        # Se passou pela validação, aplica o cálculo
        desconto = pedido.desconto or Decimal("0.0")
        pedido.total = subtotal - desconto

    def get_all_detailed(
        self,
        session: Session,
        q: str | None = None,
        status: StatusPedido | None = None,
        data_pedido: date | None = None,
        data_conclusao: date | None = None,
        min_total: Decimal | None = None,
        max_total: Decimal | None = None,
        skip: int = 0,
        limit: int = 10,
    ) -> dict[str, Sequence[Pedido] | int]:
        """Busca todos os pedidos com cliente e itens carregados, com paginação e permitindo filtros"""

        # Trava de segurança para desempenho
        if limit > 100:
            limit = 100

        query = select(Pedido).join(
            Cliente
        )  # Join para permitir busca pelo nome do cliente

        # Filtro de busca global (nome do cliente ou observação do pedido)
        if q:
            query = query.where(
                or_(
                    Cliente.nome.ilike(f"%{q}%"),  # type: ignore
                    Pedido.observacoes.ilike(f"%{q}%"),  # type: ignore
                )
            )

        # Filtro de status
        if status:
            query = query.where(Pedido.status == status)

        # Filtro de data de início
        if data_pedido:
            query = query.where(Pedido.data_pedido == data_pedido)

        # Filtro de data de conclusão
        if data_conclusao:
            query = query.where(Pedido.data_conclusao == data_conclusao)

        # Filtro de valor mínimo
        if min_total is not None:
            query = query.where(Pedido.total >= min_total)

        # Filtro de valor máximo
        if max_total is not None:
            query = query.where(Pedido.total <= max_total)

        count_query = select(func.count()).select_from(query.subquery())
        total = session.exec(count_query).one()

        query = (
            query.options(
                joinedload(Pedido.cliente),  # type: ignore
                joinedload(Pedido.itens),  # type: ignore
            )
            .offset(skip)
            .limit(limit)
        )

        results = session.exec(query).unique().all()

        return {"dados": results, "total": total}

    def get_by_id_detailed(self, session: Session, pedido_id: int) -> Pedido:
        """Busca um pedido específico com detalhes ou lança 404."""
        query = (
            select(Pedido)
            .where(Pedido.id == pedido_id)
            .options(joinedload(Pedido.cliente), joinedload(Pedido.itens))  # type: ignore
        )

        db_pedido = session.exec(query).unique().first()
        if not db_pedido:
            raise HTTPException(status_code=404, detail="Pedido não encontrado")
        return db_pedido

    def create(self, session: Session, obj: PedidoCreate) -> Pedido:
        """Cria pedido com validação de cliente, produtos e cálculo de total."""
        if not session.get(Cliente, obj.cliente_id):
            raise HTTPException(status_code=404, detail="Cliente não encontrado")

        if not obj.itens:
            raise HTTPException(status_code=400, detail="O pedido não pode ser vazio.")

        # Consolida itens duplicados no input inicial
        itens_dict: dict[int, ItemPedido] = {}

        for item in obj.itens:
            # Lógica centralizada para validar produto e definir preço
            preco, nome = self._get_product_info(
                session, item.produto_id, item.preco_unitario
            )

            # Lógica de consolidação
            if item.produto_id in itens_dict:
                itens_dict[item.produto_id].quantidade += item.quantidade  # type: ignore
            else:
                itens_dict[item.produto_id] = ItemPedido(
                    produto_id=item.produto_id,
                    quantidade=item.quantidade,
                    observacoes=item.observacoes,
                    preco_unitario=preco,
                    nome_produto=nome,
                )

        db_pedido = Pedido.model_validate(obj.model_dump(exclude={"itens"}))

        # Associa os itens consolidados ao pedido
        for novo_item in itens_dict.values():
            db_pedido.itens.append(novo_item)

        # Recalcula o total final (garantindo precisão Decimal)
        self._recalculate_totals(db_pedido)

        session.add(db_pedido)
        session.commit()
        session.refresh(db_pedido)

        return db_pedido

    def update_and_recalculate(
        self, session: Session, db_pedido: Pedido, obj: PedidoUpdate
    ) -> Pedido:
        """Atualiza, recalcula e valida se o novo desconto é compatível com o subtotal atual."""

        # Aplica as mudanças do schema
        update_data = obj.model_dump(exclude_unset=True)
        db_pedido.sqlmodel_update(update_data)

        # Força o recálculo do total (caso o desconto tenha mudado)
        self._recalculate_totals(db_pedido)

        session.add(db_pedido)
        session.commit()
        session.refresh(db_pedido)

        return db_pedido

    def get_item_or_404(
        self, session: Session, pedido_id: int, produto_id: int
    ) -> ItemPedido:
        """Busca item específico por chave composta."""
        db_item = session.get(ItemPedido, (pedido_id, produto_id))
        if not db_item:
            raise HTTPException(status_code=404, detail="Item do pedido não encontrado")
        return db_item

    def add_item(
        self, session: Session, pedido_id: int, item: ItemPedidoInput
    ) -> Pedido:
        """Adiciona ou incrementa item no pedido e atualiza total."""
        db_pedido = self.get_by_id_detailed(session, pedido_id)

        item_existente = next(
            (i for i in db_pedido.itens if i.produto_id == item.produto_id), None
        )
        preco, nome = self._get_product_info(
            session, item.produto_id, item.preco_unitario
        )

        if item_existente:
            # Apenas incrementa se já existir
            item_existente.quantidade += item.quantidade
            # Se o usuário enviou um novo valor unitário, atualiza também
            if item.preco_unitario is not None:
                item_existente.preco_unitario = item.preco_unitario

            # Se veio uma observação nova, substitui a antiga. Se veio vazia, ignora e mantém a antiga.
            if item.observacoes:
                item_existente.observacoes = item.observacoes
        else:
            novo_item = ItemPedido(
                pedido_id=pedido_id,
                produto_id=item.produto_id,
                quantidade=item.quantidade,
                observacoes=item.observacoes,
                preco_unitario=preco,
                nome_produto=nome,
            )
            db_pedido.itens.append(novo_item)

        self._recalculate_totals(db_pedido)

        session.add(db_pedido)
        session.commit()
        return db_pedido

    def update_item(
        self, session: Session, pedido_id: int, produto_id: int, item: ItemPedidoUpdate
    ) -> Pedido:
        """Atualiza a quantidade ou preço de um item e recalcula o total do pedido."""
        db_pedido = self.get_by_id_detailed(session, pedido_id)

        # Busca o item específico
        db_item = next((i for i in db_pedido.itens if i.produto_id == produto_id), None)
        if not db_item:
            raise HTTPException(status_code=404, detail="Item do pedido não encontrado")

        # Aplica as atualizações parciais
        db_item.sqlmodel_update(item.model_dump(exclude_unset=True))

        # Busca o pedido detalhado para garantir que o total seja recalculado
        self._recalculate_totals(db_pedido)

        session.add(db_pedido)
        session.commit()

        return db_pedido

    def update_item_art_path(
        self, session: Session, pedido_id: int, produto_id: int, caminho_arte: str
    ) -> Pedido:
        """Atualiza o caminho da arte de um item específico e remove a antiga do disco."""
        db_item = self.get_item_or_404(session, pedido_id, produto_id)

        # Guarda o caminho antigo antes de deletar
        caminho_antigo = db_item.caminho_arte

        # Atualiza para a imagem nova
        db_item.caminho_arte = caminho_arte
        session.add(db_item)

        # Faz o commit primeiro
        # (se falhar, o arquivo antigo continua salvo no disco, evitando caminhos de imagens já deletadas)
        session.commit()

        # Só apaga depois de ter salvo os dados
        if caminho_antigo:
            delete_art_image(caminho_antigo)

        return self.get_by_id_detailed(session, pedido_id)

    def remove_item(self, session: Session, pedido_id: int, produto_id: int) -> Pedido:
        """Remove item e imagens orfãs."""
        db_pedido = self.get_by_id_detailed(session, pedido_id)

        if len(db_pedido.itens) <= 1:
            raise HTTPException(
                status_code=400, detail="O pedido não pode ficar vazio."
            )

        db_item = next((i for i in db_pedido.itens if i.produto_id == produto_id), None)
        if not db_item:
            raise HTTPException(status_code=404, detail="Item não encontrado")

        # Guarda o caminho antes de deletar
        caminho_orfao = db_item.caminho_arte

        # Deleta do banco
        db_pedido.itens.remove(db_item)
        session.delete(db_item)
        self._recalculate_totals(db_pedido)
        session.add(db_pedido)

        # Faz o commit primeiro
        session.commit()

        # Só apaga depois de ter salvo os dados
        if caminho_orfao:
            delete_art_image(caminho_orfao)

        return db_pedido


pedido_service = PedidoService()
