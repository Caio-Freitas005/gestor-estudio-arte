from fastapi import APIRouter

from ..config import SessionDep
from ..models.dashboard import DashboardResponse
from ..services.dashboard_service import dashboard_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/", response_model=DashboardResponse)
async def get_dashboard(session: SessionDep) -> DashboardResponse:
    """Retorna todas as métricas pré-calculadas para o Dashboard."""
    return dashboard_service.get_dashboard_data(session)