from datetime import date
from decimal import Decimal
from enum import Enum
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel  # type: ignore

from .base import TimestampMixin
from .cliente import ClientePublic
from .item_pedido import ItemPedido, ItemPedidoPublic

if TYPE_CHECKING:
    from .cliente import Cliente
    from .produto import Produto


class ItemPedidoInput(SQLModel):
    produto_id: int
    quantidade: int
    observacoes: str | None = None
    preco_unitario: Decimal | None = None


class StatusPedido(str, Enum):
    AGUARDANDO_PAGAMENTO = "Aguardando Pagamento"
    AGUARDANDO_ARTE = "Aguardando Arte"
    EM_PRODUCAO = "Em Produção"
    PRONTO_RETIRADA = "Pronto para Retirada"
    CONCLUIDO = "Concluído"
    CANCELADO = "Cancelado"


class PedidoBase(TimestampMixin, SQLModel):
    data_pedido: date = Field(default_factory=date.today)
    status: str = Field(default=StatusPedido.AGUARDANDO_PAGAMENTO)
    observacoes: str | None = None
    total: Decimal = Field(default=0.0, max_digits=10, decimal_places=2)
    cliente_id: int = Field(foreign_key="cliente.id")


class Pedido(PedidoBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

    cliente: "Cliente" = Relationship(back_populates="pedidos")

    # Acesso à tabela associativa (para ler quantidade de produto, arte, etc)
    itens: list[ItemPedido] = Relationship(
        back_populates="pedido",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )

    # Acesso direto aos produtos
    produtos: list["Produto"] = Relationship(
        back_populates="pedidos", link_model=ItemPedido
    )


class PedidoCreate(PedidoBase):
    cliente_id: int
    itens: list[ItemPedidoInput] = []


class PedidoPublic(PedidoBase):
    id: int
    cliente: ClientePublic | None = None
    itens: list[ItemPedidoPublic] = []


class PedidoUpdate(SQLModel):
    data_pedido: date | None = None
    status: StatusPedido | None = None
    observacoes: str | None = None
    cliente_id: int | None = None
