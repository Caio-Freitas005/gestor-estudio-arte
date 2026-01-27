from ..models import Cliente, ClienteCreate, ClienteUpdate
from .base_service import BaseService


class ClienteService(BaseService[Cliente, ClienteCreate, ClienteUpdate]):
    pass


cliente_service = ClienteService(Cliente)
