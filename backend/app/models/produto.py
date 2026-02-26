from decimal import Decimal

from sqlmodel import Field, Relationship, SQLModel  # type: ignore

from .base import TimestampMixin
from .item_pedido import ItemPedido


class ProdutoBase(TimestampMixin, SQLModel):
    nome: str = Field(index=True)
    descricao: str | None = None
    preco_base: Decimal = Field(
        default=0.0, max_digits=10, decimal_places=2, index=True, ge=0
    )
    unidade_medida: str | None = Field(default=None, max_length=20, index=True)


class Produto(ProdutoBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

    # Relacionamento direto com a tabela de ligação
    itens_pedido: list[ItemPedido] = Relationship(back_populates="produto")


class ProdutoCreate(ProdutoBase):
    pass


class ProdutoPublic(ProdutoBase):
    id: int


class ProdutoPublicPaginated(SQLModel):
    dados: list[ProdutoPublic]
    total: int


class ProdutoUpdate(SQLModel):
    nome: str | None = None
    descricao: str | None = None
    preco_base: Decimal | None = Field(
        default=None, max_digits=10, decimal_places=2, ge=0
    )
    unidade_medida: str | None = Field(default=None, max_length=20)
