from ..models import Produto, ProdutoCreate, ProdutoUpdate
from .base_service import BaseService


class ProdutoService(BaseService[Produto, ProdutoCreate, ProdutoUpdate]):
    pass


produto_service = ProdutoService(Produto)
