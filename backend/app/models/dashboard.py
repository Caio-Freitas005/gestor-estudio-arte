from decimal import Decimal

from sqlmodel import SQLModel

from .cliente import ClientePublic
from .pedido import PedidoPublic


class DashboardStats(SQLModel):
    totalGeral: int
    faturamento: Decimal
    totalAtivos: int
    cancelados: int
    aguardandoPagamento: int
    emProducao: int
    pronto: int
    concluidos: int
    aguardandoArte: int


class DashboardResponse(SQLModel):
    status: DashboardStats
    pedidosRecentes: list[PedidoPublic]
    aniversariantes: list[ClientePublic]
