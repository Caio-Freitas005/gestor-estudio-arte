from .base_service import BaseService
from .cliente_service import cliente_service
from .produto_service import produto_service
from .pedido_service import pedido_service

__all__ = [
    "BaseService",
    "cliente_service",
    "produto_service",
    "pedido_service",
]