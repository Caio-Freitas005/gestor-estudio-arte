from datetime import date
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel  # type: ignore

if TYPE_CHECKING:
    from .pedido import Pedido


class ClienteBase(SQLModel):
    nome: str = Field(index=True)
    telefone: str | None = Field(default=None, max_length=11)
    email: str | None = Field(default=None, max_length=100, unique=True)
    data_nascimento: date | None = None
    observacoes: str | None = None


class Cliente(ClienteBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    # Relacionamento um para muitos com pedidos
    pedidos: list["Pedido"] = Relationship(back_populates="cliente")


class ClienteCreate(ClienteBase):
    pass


class ClientePublic(ClienteBase):
    id: int


class ClienteUpdate(SQLModel):
    nome: str | None = None
    telefone: str | None = Field(default=None, max_length=11)
    email: str | None = Field(default=None, max_length=100)
    data_nascimento: date | None = None
    observacoes: str | None = None
