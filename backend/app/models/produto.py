from decimal import Decimal
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel  # type: ignore

from .item_pedido import ItemPedido

if TYPE_CHECKING:
    from .pedido import Pedido


class ProdutoBase(SQLModel):
    nome: str
    descricao: str | None = None
    preco_base: Decimal = Field(default=0.0, max_digits=10, decimal_places=2)
    unidade_medida: str | None = Field(default=None, max_length=20)


class Produto(ProdutoBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

    # Relacionamento direto com a tabela de ligação
    itens_pedido: list[ItemPedido] = Relationship(back_populates="produto")

    # Relacionamento Many-to-Many com Pedidos
    pedidos: list["Pedido"] = Relationship(
        back_populates="produtos", link_model=ItemPedido
    )


class ProdutoCreate(ProdutoBase):
    pass


class ProdutoPublic(ProdutoBase):
    id: int


class ProdutoUpdate(SQLModel):
    nome: str | None = None
    descricao: str | None = None
    preco_base: Decimal | None = None
