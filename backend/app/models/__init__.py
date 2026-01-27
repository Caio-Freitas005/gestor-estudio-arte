# Centraliza os imports das models e schemas
from .cliente import Cliente, ClienteCreate, ClientePublic, ClienteUpdate
from .produto import Produto, ProdutoCreate, ProdutoPublic, ProdutoUpdate
from .pedido import Pedido, StatusPedido, PedidoCreate, PedidoPublic, PedidoUpdate, ItemPedidoInput
from .item_pedido import ItemPedido,ItemPedidoPublic, ItemPedidoUpdate

# Exporta a lista para conferência
__all__ = [
    "Cliente", "ClienteCreate", "ClientePublic", "ClienteUpdate",
    "Produto", "ProdutoCreate", "ProdutoPublic", "ProdutoUpdate",
    "Pedido", "PedidoCreate", "PedidoPublic", "PedidoUpdate", "StatusPedido",
    "ItemPedido", "ItemPedidoPublic", "ItemPedidoUpdate", "ItemPedidoInput"
]