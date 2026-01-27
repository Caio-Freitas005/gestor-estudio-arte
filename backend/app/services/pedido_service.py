import io
from decimal import Decimal
from typing import Sequence
from uuid import uuid4

from fastapi import HTTPException, UploadFile
from PIL import Image, ImageOps
from sqlalchemy.orm import joinedload
from sqlmodel import Session, select

from ..config import ARTES_DIR
from ..models import (
    Cliente,
    ItemPedido,
    ItemPedidoInput,
    Pedido,
    PedidoCreate,
    PedidoUpdate,
    Produto,
)
from .base_service import BaseService


class PedidoService(BaseService[Pedido, PedidoCreate, PedidoUpdate]):
    def __init__(self):
        super().__init__(Pedido)

    def _prepare_item(self, session: Session, item: ItemPedidoInput) -> ItemPedido:
        """Lógica centralizada para validar produto e definir preço."""
        produto = session.get(Produto, item.cd_produto)
        if not produto:
            raise HTTPException(
                status_code=404,
                detail=f"Produto com ID {item.cd_produto} não encontrado.",
            )

        # Se não houver valor praticado no input, usa o valor base do produto
        preco = (
            item.vl_unitario_praticado
            if item.vl_unitario_praticado is not None
            else produto.vl_base
        )

        return ItemPedido(
            cd_produto=item.cd_produto,
            qt_produto=item.qt_produto,
            ds_observacoes_item=item.ds_observacoes_item,
            vl_unitario_praticado=preco,
        )

    def get_all_detailed(self, session: Session) -> Sequence[Pedido]:
        """Busca todos os pedidos com cliente e itens carregados."""
        query = select(Pedido).options(
            joinedload(Pedido.cliente), joinedload(Pedido.itens) # type: ignore
        )
        return session.exec(query).unique().all()

    def get_by_id_detailed(self, session: Session, cd_pedido: int) -> Pedido:
        """Busca um pedido específico com detalhes ou lança 404."""
        query = (
            select(Pedido)
            .where(Pedido.cd_pedido == cd_pedido)
            .options(joinedload(Pedido.cliente), joinedload(Pedido.itens)) # type: ignore
        )
        db_pedido = session.exec(query).unique().first()
        if not db_pedido:
            raise HTTPException(status_code=404, detail="Pedido não encontrado")
        return db_pedido

    def create(self, session: Session, obj: PedidoCreate) -> Pedido:
        """Cria pedido com validação de cliente, produtos e cálculo de total."""
        if not session.get(Cliente, obj.cd_cliente):
            raise HTTPException(status_code=404, detail="Cliente não encontrado")

        if not obj.itens:
            raise HTTPException(status_code=400, detail="O pedido não pode ser vazio.")

        # Consolida itens duplicados no input inicial
        itens_dict = {}
        for item in obj.itens:
            if item.cd_produto in itens_dict:
                itens_dict[item.cd_produto].qt_produto += item.qt_produto
            else:
                itens_dict[item.cd_produto] = item

        db_pedido = Pedido.model_validate(obj.model_dump(exclude={"itens"}))

        # Usa o _prepare_item para cada item consolidado
        for item_input in itens_dict.values():
            novo_item = self._prepare_item(session, item_input)
            db_pedido.itens.append(novo_item)

        session.add(db_pedido)
        session.commit()

        # Recalcula o total final (garantindo precisão Decimal)
        self.update_total(session, db_pedido)
        return db_pedido

    def update_total(self, session: Session, pedido: Pedido):
        """Recalcula o valor total do pedido."""
        total = sum(
            (item.vl_unitario_praticado * Decimal(item.qt_produto))
            for item in pedido.itens
        )
        pedido.vl_total_pedido = total
        session.add(pedido)
        session.commit()

    def add_item(
        self, session: Session, cd_pedido: int, item: ItemPedidoInput
    ) -> Pedido:
        """Adiciona ou incrementa item no pedido e atualiza total."""
        db_pedido = self.get_or_404(session, cd_pedido)
        item_existente = session.get(ItemPedido, (cd_pedido, item.cd_produto))

        if item_existente:
            # Apenas incrementa se já existir
            item_existente.qt_produto += item.qt_produto
            # Se o usuário enviou um novo valor unitário, atualiza também
            if item.vl_unitario_praticado is not None:
                item_existente.vl_unitario_praticado = item.vl_unitario_praticado
        else:
            # Usa o método auxiliar para criar o novo objeto ItemPedido
            novo_item = self._prepare_item(session, item)
            novo_item.cd_pedido = cd_pedido
            session.add(novo_item)

        session.commit()
        self.update_total(session, db_pedido)
        return self.get_by_id_detailed(session, cd_pedido)

    def remove_item(self, session: Session, cd_pedido: int, cd_produto: int) -> Pedido:
        """Remove item com trava de segurança para pedido vazio."""
        db_pedido = self.get_by_id_detailed(session, cd_pedido)

        if len(db_pedido.itens) <= 1:
            raise HTTPException(
                status_code=400, detail="O pedido não pode ficar vazio."
            )

        db_item = session.get(ItemPedido, (cd_pedido, cd_produto))
        if not db_item:
            raise HTTPException(status_code=404, detail="Item não encontrado")

        session.delete(db_item)
        session.commit()
        self.update_total(session, db_pedido)
        return db_pedido

    def get_item_or_404(
        self, session: Session, cd_pedido: int, cd_produto: int
    ) -> ItemPedido:
        """Busca item específico por chave composta."""
        db_item = session.get(ItemPedido, (cd_pedido, cd_produto))
        if not db_item:
            raise HTTPException(status_code=404, detail="Item do pedido não encontrado")
        return db_item

    def process_art_image(
        self, file: UploadFile, cd_pedido: int, cd_produto: int
    ) -> str:
        """Processa e salva imagem, garantindo que tenha formatos permitidos"""
        try:
            content = file.file.read()
            img = Image.open(io.BytesIO(content))
            if img.format not in ["PNG", "JPG", "JPEG", "WEBP"]:
                raise HTTPException(status_code=400, detail="Formato não suportado.")

            img = ImageOps.exif_transpose(img)
            file_name = f"art_ped_{cd_pedido}_prod_{cd_produto}_{uuid4().hex}.webp"
            file_path = ARTES_DIR / file_name
            img.save(str(file_path), "WEBP", quality=95)
            return f"/uploads/artes/{file_name}"
        except Exception:
            raise HTTPException(status_code=400, detail="Erro ao processar imagem.")


pedido_service = PedidoService()
