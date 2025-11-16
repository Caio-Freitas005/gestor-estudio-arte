from datetime import date

from sqlmodel import Field, SQLModel


class ClienteBase(SQLModel):
    nm_cliente: str = Field(index=True)
    cd_telefone: str | None = Field(default=None, max_length=11)
    nm_email: str | None = Field(default=None, max_length=100)
    dt_nascimento: date | None = None
    ds_observacoes: str | None = None


class Cliente(ClienteBase, table=True):
    cd_cliente: int | None = Field(default=None, primary_key=True)


class ClienteCreate(ClienteBase):
    pass


class ClientePublic(ClienteBase):
    cd_cliente: int


class ClienteUpdate(SQLModel):
    nm_cliente: str | None = None
    cd_telefone: str | None = None
    nm_email: str | None = None
    dt_nascimento: date | None = None
    ds_observacoes: str | None = None
