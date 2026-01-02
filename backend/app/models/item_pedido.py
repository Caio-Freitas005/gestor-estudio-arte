from decimal import Decimal
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel  # type:ignore

if TYPE_CHECKING:
    from .pedido import Pedido
    from .produto import Produto


class ItemPedidoBase(SQLModel):
    qt_produto: int = Field(default=1, ge=1)
    vl_unitario_praticado: Decimal = Field(default=0.0, max_digits=10, decimal_places=2)
    ds_caminho_arte: str | None = Field(default=None)
    ds_observacoes_item: str | None = Field(default=None)
    cd_pedido: int | None = Field(
        default=None, foreign_key="pedido.cd_pedido", primary_key=True
    )
    cd_produto: int | None = Field(
        default=None, foreign_key="produto.cd_produto", primary_key=True
    )


class ItemPedido(ItemPedidoBase, table=True):
    __tablename__ = "item_pedido"  # type: ignore

    pedido: "Pedido" = Relationship(back_populates="itens")
    produto: "Produto" = Relationship(back_populates="itens_pedido")


class ItemPedidoCreate(ItemPedidoBase):
    pass


class ItemPedidoPublic(ItemPedidoBase):
    vl_total_item: Decimal | None = None


class ItemPedidoUpdate(SQLModel):
    qt_produto: int | None = Field(default=None, ge=1)
    vl_unitario_praticado: Decimal | None = Field(
        default=None, max_digits=10, decimal_places=2
    )
    ds_caminho_arte: str | None = None
    ds_observacoes_item: str | None = None
