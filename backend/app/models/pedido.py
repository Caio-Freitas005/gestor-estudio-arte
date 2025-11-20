from datetime import date
from decimal import Decimal
from enum import Enum

from sqlmodel import Field, Relationship, SQLModel  # type: ignore

from .cliente import Cliente, ClientePublic


class StatusPedido(str, Enum):
    AGUARDANDO_PAGAMENTO = "Aguardando Pagamento"
    AGUARDANDO_ARTE = "Aguardando Arte"
    EM_PRODUCAO = "Em Produção"
    PRONTO_RETIRADA = "Pronto para Retirada"
    CONCLUIDO = "Concluído"
    CANCELADO = "Cancelado"


class PedidoBase(SQLModel):
    dt_pedido: date
    ds_status: StatusPedido = Field(default=StatusPedido.AGUARDANDO_PAGAMENTO)
    vl_total_pedido: Decimal = Field(default=0, max_digits=10, decimal_places=2)
    cd_cliente: int = Field(foreign_key="cliente.cd_cliente")


class Pedido(PedidoBase, table=True):
    cd_pedido: int | None = Field(default=None, primary_key=True)
    # Relacionamento muitos para um com cliente
    cliente: Cliente | None = Relationship(back_populates="pedidos")


class PedidoCreate(PedidoBase):
    vl_total_pedido: Decimal = 0  # type: ignore
    pass


class PedidoPublic(PedidoBase):
    cd_pedido: int
    cliente: ClientePublic | None = None


class PedidoUpdate(SQLModel):
    dt_pedido: date | None = None
    ds_status: StatusPedido | None = None
    vl_total_pedido: Decimal | None = Field(
        default=None, max_digits=10, decimal_places=2
    )
    cd_cliente: int | None = None
