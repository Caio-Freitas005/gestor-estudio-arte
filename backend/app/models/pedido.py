from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel  # type: ignore

from .cliente import ClientePublic
from .item_pedido import ItemPedido, ItemPedidoPublic

if TYPE_CHECKING:
    from .cliente import Cliente
    from .produto import Produto


class ItemPedidoInput(SQLModel):
    cd_produto: int
    qt_produto: int
    ds_observacoes_item: str | None = None
    vl_unitario_praticado: Decimal | None = None


class StatusPedido(str, Enum):
    AGUARDANDO_PAGAMENTO = "Aguardando Pagamento"
    AGUARDANDO_ARTE = "Aguardando Arte"
    EM_PRODUCAO = "Em Produção"
    PRONTO_RETIRADA = "Pronto para Retirada"
    CONCLUIDO = "Concluído"
    CANCELADO = "Cancelado"


class PedidoBase(SQLModel):
    dt_pedido: datetime = Field(default_factory=datetime.now)
    ds_status: str = Field(default=StatusPedido.AGUARDANDO_PAGAMENTO)
    ds_observacoes: str | None = None
    vl_total_pedido: Decimal = Field(default=0.0, max_digits=10, decimal_places=2)
    cd_cliente: int = Field(foreign_key="cliente.cd_cliente")


class Pedido(PedidoBase, table=True):
    cd_pedido: int | None = Field(default=None, primary_key=True)

    cliente: "Cliente" = Relationship(back_populates="pedidos")

    # Acesso à tabela associativa (para ler qt_produto, arte, etc)
    itens: list[ItemPedido] = Relationship(
        back_populates="pedido",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )

    # Acesso direto aos produtos
    produtos: list["Produto"] = Relationship(
        back_populates="pedidos", link_model=ItemPedido
    )


class PedidoCreate(PedidoBase):
    cd_cliente: int
    itens: list[ItemPedidoInput] = []


class PedidoPublic(PedidoBase):
    cd_pedido: int
    cliente: ClientePublic | None = None
    itens: list[ItemPedidoPublic] = []


class PedidoUpdate(SQLModel):
    dt_pedido: datetime | None = None
    ds_status: StatusPedido | None = None
    ds_observacoes: str | None = None
    cd_cliente: int | None = None
