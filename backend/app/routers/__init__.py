from .clientes import router as clientes_router
from .produtos import router as produtos_router
from .pedidos import router as pedidos_router
from .dashboard import router as dashboard_router
from .backup import router as backup_router

__all__ = [
    "clientes_router",
    "produtos_router",
    "pedidos_router",
    "dashboard_router",
    "backup_router",
]
