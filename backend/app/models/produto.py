from decimal import Decimal

from sqlmodel import Field, SQLModel  # type: ignore


class ProdutoBase(SQLModel):
    nm_produto: str = Field(max_length=100, index=True)
    ds_produto: str | None = None
    vl_base: Decimal | None = Field(default=None, max_digits=10, decimal_places=2)
    ds_unidade_medida: str | None = Field(default=None, max_length=20)


class Produto(ProdutoBase, table=True):
    cd_produto: int | None = Field(default=None, primary_key=True)


class ProdutoCreate(ProdutoBase):
    pass


class ProdutoPublic(ProdutoBase):
    cd_produto: int


class ProdutoUpdate(SQLModel):
    nm_produto: str | None = Field(default=None, max_length=100)
    ds_produto: str | None = None
    vl_base: Decimal | None = Field(default=None, max_digits=10, decimal_places=2)
    ds_unidade_medida: str | None = Field(default=None, max_length=20)
