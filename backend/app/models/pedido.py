from datetime import date
from decimal import Decimal
from enum import Enum
from typing import TYPE_CHECKING, Any

from sqlalchemy import event
from sqlmodel import Field, Relationship, SQLModel

from .base import TimestampMixin
from .cliente import ClientePublic
from .item_pedido import ItemPedido, ItemPedidoPublic

if TYPE_CHECKING:
    from .cliente import Cliente


class ItemPedidoInput(SQLModel):
    produto_id: int
    quantidade: int = Field(default=1, ge=1)
    observacoes: str | None = None
    preco_unitario: Decimal | None = Field(default=None, ge=0)


class StatusPedido(str, Enum):
    AGUARDANDO_PAGAMENTO = "Aguardando Pagamento"
    AGUARDANDO_ARTE = "Aguardando Arte"
    EM_PRODUCAO = "Em Produção"
    PRONTO_RETIRADA = "Pronto para Retirada"
    CONCLUIDO = "Concluído"
    CANCELADO = "Cancelado"


class PedidoBase(TimestampMixin, SQLModel):
    data_pedido: date = Field(default_factory=date.today, index=True)
    data_conclusao: date | None = Field(default=None, index=True)
    status: str = Field(default=StatusPedido.AGUARDANDO_PAGAMENTO, index=True)
    observacoes: str | None = None
    desconto: Decimal = Field(default=0.0, max_digits=10, decimal_places=2, ge=0)
    total: Decimal = Field(default=0.0, max_digits=10, decimal_places=2, index=True)
    cliente_id: int = Field(foreign_key="cliente.id")


class Pedido(PedidoBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

    cliente: "Cliente" = Relationship(back_populates="pedidos")

    # Acesso à tabela associativa (para ler quantidade de produto, arte, etc)
    itens: list[ItemPedido] = Relationship(
        back_populates="pedido",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


@event.listens_for(Pedido.status, "set", named=True)
def ao_mudar_status(target: "Pedido", value: Any, oldvalue: Any, **_: Any) -> None:
    """
    Atualiza automaticamente a data_conclusao com base na mudança do status.
    """
    # Verifica se o valor mudou para não rodar lógica desnecessária
    if value == oldvalue:
        return

    # Se mudar para CONCLUIDO, define hoje
    if value == StatusPedido.CONCLUIDO:
        target.data_conclusao = date.today()

    # Se o status anterior era CONCLUIDO e mudou para outro, limpa a data
    elif oldvalue == StatusPedido.CONCLUIDO:
        target.data_conclusao = None


class PedidoCreate(PedidoBase):
    cliente_id: int
    itens: list[ItemPedidoInput] = []


class PedidoPublic(PedidoBase):
    id: int
    cliente: ClientePublic | None = None
    itens: list[ItemPedidoPublic] = []


class PedidoPublicPaginated(SQLModel):
    dados: list[PedidoPublic]
    total: int


class PedidoUpdate(SQLModel):
    data_pedido: date | None = None
    status: StatusPedido | None = None
    observacoes: str | None = None
    cliente_id: int | None = None
    desconto: Decimal | None = Field(
        default=None, max_digits=10, decimal_places=2, ge=0
    )
