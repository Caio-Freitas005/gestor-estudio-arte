from decimal import Decimal
from typing import Any

from pydantic import field_validator
from sqlmodel import Field, Relationship, SQLModel  # type: ignore

from .base import TimestampMixin
from .item_pedido import ItemPedido


class ProdutoBase(TimestampMixin, SQLModel):
    nome: str = Field(index=True, unique=True)
    descricao: str | None = None
    preco_base: Decimal = Field(
        default=0.0, max_digits=10, decimal_places=2, index=True, gt=0
    )
    unidade_medida: str | None = Field(default=None, max_length=20, index=True)

    # Cria a regra de limpeza
    @field_validator("nome", mode="before")
    @classmethod
    def sanitizar_nome(cls, v: Any) -> Any:
        if isinstance(v, str):
            # Limpa espaços sobrando
            nome_limpo = " ".join(v.split())

            # Impede nomes vazios
            if not nome_limpo:
                raise ValueError("O nome do produto não pode estar vazio.")

            return nome_limpo

        # Se não for string, retorna o valor bruto.
        # O Pydantic receberá esse valor e validará contra a anotação 'str' definida no campo
        return v


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
        default=None, max_digits=10, decimal_places=2, gt=0
    )
    unidade_medida: str | None = Field(default=None, max_length=20)

    @field_validator("nome", mode="before")
    @classmethod
    def sanitizar_nome(cls, v: Any) -> Any:
        if isinstance(v, str):
            nome_limpo = " ".join(v.split())
            if not nome_limpo:
                raise ValueError("O nome do produto não pode estar vazio.")
            return nome_limpo
        return v
