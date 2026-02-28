from datetime import date
from typing import TYPE_CHECKING, Any

from pydantic import EmailStr, field_validator
from pydantic_extra_types.phone_numbers import PhoneNumber
from sqlmodel import Field, Relationship, SQLModel  # type: ignore

from .base import TimestampMixin

if TYPE_CHECKING:
    from .pedido import Pedido


# Adapta telefone para o tipo brasileiro
class TelefoneBR(PhoneNumber):
    default_region_code = "BR"
    # E164 salva como: +5511999999999
    phone_format = "E164"


class ClienteBase(TimestampMixin, SQLModel):
    nome: str = Field(index=True)
    telefone: TelefoneBR | None = Field(default=None, max_length=20, index=True)
    email: EmailStr | None = Field(default=None, max_length=100, unique=True)
    data_nascimento: date | None = None
    observacoes: str | None = None

    @field_validator("nome", mode="before")
    @classmethod
    def sanitizar_nome(cls, v: Any) -> Any:
        if isinstance(v, str):
            nome_limpo = " ".join(v.split())
            if not nome_limpo:
                raise ValueError("O nome do cliente não pode estar vazio.")
            return nome_limpo
        return v

    @field_validator("email", mode="before")
    @classmethod
    def sanitizar_email(cls, v: Any) -> Any:
        if isinstance(v, str):
            return v.lower()
        return v


class Cliente(ClienteBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    # Relacionamento um para muitos com pedidos
    pedidos: list["Pedido"] = Relationship(back_populates="cliente")


class ClienteCreate(ClienteBase):
    pass


class ClientePublic(ClienteBase):
    id: int


class ClientePublicPaginated(SQLModel):
    dados: list[ClientePublic]
    total: int


class ClienteUpdate(SQLModel):
    nome: str | None = None
    telefone: TelefoneBR | None = Field(default=None, max_length=20)
    email: EmailStr | None = Field(default=None, max_length=100)
    data_nascimento: date | None = None
    observacoes: str | None = None
