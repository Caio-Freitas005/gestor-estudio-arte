# Centraliza os imports das models e schemas
from .cliente import (
    Cliente,
    ClienteCreate,
    ClientePublic,
    ClientePublicPaginated,
    ClienteUpdate,
)
from .dashboard import DashboardResponse, DashboardStats
from .item_pedido import ItemPedido, ItemPedidoPublic, ItemPedidoUpdate
from .pedido import (
    ItemPedidoInput,
    Pedido,
    PedidoCreate,
    PedidoPublic,
    PedidoPublicPaginated,
    PedidoUpdate,
    StatusPedido,
)
from .produto import (
    Produto,
    ProdutoCreate,
    ProdutoPublic,
    ProdutoPublicPaginated,
    ProdutoUpdate,
)

# Exporta a lista para conferência
__all__ = [
    "Cliente",
    "ClienteCreate",
    "ClientePublic",
    "ClientePublicPaginated",
    "ClienteUpdate",
    "Produto",
    "ProdutoCreate",
    "ProdutoPublic",
    "ProdutoPublicPaginated",
    "ProdutoUpdate",
    "Pedido",
    "PedidoCreate",
    "PedidoPublic",
    "PedidoPublicPaginated",
    "PedidoUpdate",
    "StatusPedido",
    "ItemPedido",
    "ItemPedidoPublic",
    "ItemPedidoUpdate",
    "ItemPedidoInput",
    "DashboardResponse",
    "DashboardStats",
]
