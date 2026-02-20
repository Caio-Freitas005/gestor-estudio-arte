import io
from datetime import date
from decimal import Decimal
from typing import Sequence
from uuid import uuid4

from fastapi import HTTPException, UploadFile
from PIL import Image, ImageOps
from sqlalchemy import func, or_
from sqlalchemy.orm import joinedload
from sqlmodel import Session, select

from ..config import ARTES_DIR
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
from .base_service import BaseService


class PedidoService(BaseService[Pedido, PedidoCreate, PedidoUpdate]):
    def __init__(self):
        super().__init__(Pedido)

    def _prepare_item(self, session: Session, item: ItemPedidoInput) -> ItemPedido:
        """Lógica centralizada para validar produto e definir preço."""
        produto = session.get(Produto, item.produto_id)
        if not produto:
            raise HTTPException(
                status_code=404,
                detail=f"Produto com ID {item.produto_id} não encontrado.",
            )

        # Se não houver valor praticado no input, usa o valor base do produto
        preco = (
            item.preco_unitario
            if item.preco_unitario is not None
            else produto.preco_base
        )

        return ItemPedido(
            produto_id=item.produto_id,
            quantidade=item.quantidade,
            observacoes=item.observacoes,
            preco_unitario=preco,
        )

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
        itens_dict = {}
        subtotal_previsto = Decimal(0.0)

        for item in obj.itens:
            # Busca produto para saber o preço (caso não informado)
            produto = session.get(Produto, item.produto_id)
            if not produto:
                raise HTTPException(
                    status_code=404, detail=f"Produto {item.produto_id} não encontrado"
                )

            preco = (
                item.preco_unitario
                if item.preco_unitario is not None
                else produto.preco_base
            )
            subtotal_previsto += Decimal(item.quantidade) * preco

            # Lógica de consolidação
            if item.produto_id in itens_dict:
                itens_dict[item.produto_id].quantidade += item.quantidade  # type: ignore
            else:
                itens_dict[item.produto_id] = item

        desconto = obj.desconto if obj.desconto else Decimal(0.0)
        if desconto > subtotal_previsto:
            raise HTTPException(
                status_code=400,
                detail=f"O desconto (R$ {desconto}) não pode ser maior que o subtotal (R$ {subtotal_previsto}).",
            )

        db_pedido = Pedido.model_validate(obj.model_dump(exclude={"itens"}))

        # Usa o _prepare_item para cada item consolidado
        for item_input in itens_dict.values():  # type: ignore
            novo_item = self._prepare_item(session, item_input)  # type: ignore
            db_pedido.itens.append(novo_item)

        session.add(db_pedido)
        session.commit()

        # Recalcula o total final (garantindo precisão Decimal)
        self.update_total(session, db_pedido)
        return db_pedido

    def update_total(self, session: Session, pedido: Pedido):
        """Recalcula o valor total do pedido."""
        # Calcula subtotal dos itens
        subtotal = sum(
            (item.preco_unitario * Decimal(item.quantidade)) for item in pedido.itens
        )

        # Obtém desconto, garantindo que não seja None
        desconto = pedido.desconto if pedido.desconto else Decimal(0.0)

        # Total líquido
        total = subtotal - desconto

        if total < 0:
            total = Decimal(0.0)

        pedido.total = total  # type: ignore
        session.add(pedido)
        session.commit()

    def update_and_recalculate(
        self, session: Session, db_pedido: Pedido, obj: PedidoUpdate
    ) -> Pedido:
        """Atualiza, recalcula e valida se o novo desconto é compatível com o subtotal atual."""

        # Se o usuário está tentando alterar o desconto
        if obj.desconto is not None:
            # Calcula o subtotal atual do pedido existente no banco
            subtotal_atual = sum(
                (item.preco_unitario * Decimal(item.quantidade))
                for item in db_pedido.itens
            )

            if obj.desconto > subtotal_atual:
                raise HTTPException(
                    status_code=400,
                    detail=f"O desconto (R$ {obj.desconto}) não pode ser maior que o subtotal atual do pedido (R$ {subtotal_atual}).",
                )

        # Aplica as mudanças do schema
        update_data = obj.model_dump(exclude_unset=True)
        db_pedido.sqlmodel_update(update_data)

        session.add(db_pedido)
        session.commit()
        session.refresh(db_pedido)

        # Força o recálculo do total (caso o desconto tenha mudado)
        self.update_total(session, db_pedido)

        return db_pedido

    def add_item(
        self, session: Session, pedido_id: int, item: ItemPedidoInput
    ) -> Pedido:
        """Adiciona ou incrementa item no pedido e atualiza total."""
        db_pedido = self.get_or_404(session, pedido_id)
        item_existente = session.get(ItemPedido, (pedido_id, item.produto_id))

        if item_existente:
            # Apenas incrementa se já existir
            item_existente.quantidade += item.quantidade

            # Se o usuário enviou um novo valor unitário, atualiza também
            if item.preco_unitario is not None:
                item_existente.preco_unitario = item.preco_unitario
        else:
            # Usa o método auxiliar para criar o novo objeto ItemPedido
            novo_item = self._prepare_item(session, item)
            novo_item.pedido_id = pedido_id
            session.add(novo_item)

        session.commit()
        self.update_total(session, db_pedido)
        return self.get_by_id_detailed(session, pedido_id)

    def update_item(
        self, session: Session, pedido_id: int, produto_id: int, item: ItemPedidoUpdate
    ) -> Pedido:
        """Atualiza a quantidade ou preço de um item e recalcula o total do pedido."""
        # Busca o item específico (chave composta)
        db_item = self.get_item_or_404(session, pedido_id, produto_id)

        # Aplica as atualizações parciais
        item_data = item.model_dump(exclude_unset=True)
        db_item.sqlmodel_update(item_data)

        session.add(db_item)
        session.commit()

        # Busca o pedido detalhado para garantir que o total seja recalculado
        db_pedido = self.get_by_id_detailed(session, pedido_id)
        self.update_total(session, db_pedido)

        return db_pedido

    def remove_item(self, session: Session, pedido_id: int, produto_id: int) -> Pedido:
        """Remove item com trava de segurança para pedido vazio."""
        db_pedido = self.get_by_id_detailed(session, pedido_id)

        if len(db_pedido.itens) <= 1:
            raise HTTPException(
                status_code=400, detail="O pedido não pode ficar vazio."
            )

        db_item = session.get(ItemPedido, (pedido_id, produto_id))
        if not db_item:
            raise HTTPException(status_code=404, detail="Item não encontrado")

        session.delete(db_item)
        session.commit()
        self.update_total(session, db_pedido)
        return db_pedido

    def get_item_or_404(
        self, session: Session, pedido_id: int, produto_id: int
    ) -> ItemPedido:
        """Busca item específico por chave composta."""
        db_item = session.get(ItemPedido, (pedido_id, produto_id))
        if not db_item:
            raise HTTPException(status_code=404, detail="Item do pedido não encontrado")
        return db_item

    def process_art_image(
        self, file: UploadFile, pedido_id: int, produto_id: int
    ) -> str:
        """Processa e salva imagem, garantindo que tenha formatos permitidos"""
        try:
            content = file.file.read()
            img = Image.open(io.BytesIO(content))
            if img.format not in ["PNG", "JPG", "JPEG", "WEBP"]:
                raise HTTPException(status_code=400, detail="Formato não suportado.")

            img = ImageOps.exif_transpose(img)
            file_name = f"art_ped_{pedido_id}_prod_{produto_id}_{uuid4().hex}.webp"
            file_path = ARTES_DIR / file_name
            img.save(str(file_path), "WEBP", quality=95)
            return f"/uploads/artes/{file_name}"
        except Exception:
            raise HTTPException(status_code=400, detail="Erro ao processar imagem.")


pedido_service = PedidoService()
