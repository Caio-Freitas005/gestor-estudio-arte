from datetime import datetime
from decimal import Decimal

from sqlalchemy import extract, func
from sqlalchemy.orm import joinedload
from sqlmodel import Session, select

from ..models import Cliente, Pedido, StatusPedido
from ..models.dashboard import DashboardResponse, DashboardStats


class DashboardService:
    def get_dashboard_data(self, session: Session) -> DashboardResponse:
        query_stats = select(
            Pedido.status,
            func.count(Pedido.id),  # type: ignore
            func.sum(Pedido.total),
        ).group_by(Pedido.status)

        resultados = session.exec(query_stats).all()

        # Dicionário para armazenar valores padrão e passar direto pro objeto
        status_dict: dict[str, int | Decimal] = {
            "totalGeral": 0,
            "faturamento": Decimal("0.0"),
            "totalAtivos": 0,
            "cancelados": 0,
            "aguardandoPagamento": 0,
            "emProducao": 0,
            "pronto": 0,
            "concluidos": 0,
            "aguardandoArte": 0,
        }

        for status, contagem, soma_total in resultados:
            soma = soma_total or Decimal("0.0")
            status_dict["totalGeral"] += contagem

            if status == StatusPedido.CANCELADO:
                status_dict["cancelados"] = contagem
            elif status == StatusPedido.AGUARDANDO_PAGAMENTO:
                status_dict["aguardandoPagamento"] = contagem
            elif status == StatusPedido.AGUARDANDO_ARTE:
                status_dict["aguardandoArte"] = contagem
            elif status == StatusPedido.EM_PRODUCAO:
                status_dict["emProducao"] = contagem
            elif status == StatusPedido.PRONTO_RETIRADA:
                status_dict["pronto"] = contagem
            elif status == StatusPedido.CONCLUIDO:
                status_dict["concluidos"] = contagem

            # Regras de negócio de faturamento e ativos
            if status not in [
                StatusPedido.CANCELADO,
                StatusPedido.AGUARDANDO_PAGAMENTO,
                StatusPedido.AGUARDANDO_ARTE,
            ]:
                status_dict["faturamento"] += Decimal(soma)

            if status not in [StatusPedido.CONCLUIDO, StatusPedido.CANCELADO]:
                status_dict["totalAtivos"] += contagem

        # Pedidos recentes
        query_recentes = (
            select(Pedido)
            .options(joinedload(Pedido.cliente))  # type: ignore
            .order_by(Pedido.id.desc())  # type: ignore
            .limit(5)
        )
        recentes = session.exec(query_recentes).unique().all()

        # Aniversariantes do mês
        mes_atual = datetime.now().month
        query_aniversariantes = select(Cliente).where(
            extract("month", Cliente.data_nascimento) == mes_atual  # type: ignore
        )
        aniversariantes = session.exec(query_aniversariantes).all()

        # Constrói o schema do SQLModel para devolver ao router
        return DashboardResponse(
            status=DashboardStats(**status_dict),  # type: ignore
            pedidosRecentes=recentes,  # type: ignore
            aniversariantes=aniversariantes,  # type: ignore
        )


dashboard_service = DashboardService()