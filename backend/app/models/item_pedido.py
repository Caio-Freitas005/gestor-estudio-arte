from decimal import Decimal
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel  # type:ignore

from .base import TimestampMixin

if TYPE_CHECKING:
    from .pedido import Pedido
    from .produto import Produto


class ItemPedidoBase(TimestampMixin, SQLModel):
    quantidade: int = Field(default=1, ge=1)
    preco_unitario: Decimal = Field(default=0.0, max_digits=10, decimal_places=2)
    nome_produto: str 
    caminho_arte: str | None = None
    observacoes: str | None = None
    pedido_id: int | None = Field(
        default=None, foreign_key="pedido.id", primary_key=True
    )
    produto_id: int | None = Field(
        default=None, foreign_key="produto.id", primary_key=True
    )


class ItemPedido(ItemPedidoBase, table=True):
    __tablename__ = "item_pedido"  # type: ignore

    pedido: "Pedido" = Relationship(back_populates="itens")
    produto: "Produto" = Relationship(back_populates="itens_pedido")


class ItemPedidoCreate(ItemPedidoBase):
    pass


class ItemPedidoPublic(ItemPedidoBase):
    valor_total: Decimal | None = None


class ItemPedidoUpdate(SQLModel):
    quantidade: int | None = Field(default=None, ge=1)
    preco_unitario: Decimal | None = Field(
        default=None, max_digits=10, decimal_places=2
    )
    caminho_arte: str | None = None
    observacoes: str | None = None
