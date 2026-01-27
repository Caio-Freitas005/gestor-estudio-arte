from typing import Sequence

from fastapi import APIRouter, Response, status

from ..config import SessionDep
from ..models import Cliente, ClienteCreate, ClientePublic, ClienteUpdate
from ..services import cliente_service

router = APIRouter(prefix="/clientes", tags=["clientes"])


@router.post("/", response_model=ClientePublic, status_code=status.HTTP_201_CREATED)
async def create_client(cliente: ClienteCreate, session: SessionDep) -> Cliente:
    """Cria um novo cliente."""
    return cliente_service.create(session, cliente)


@router.get("/", response_model=list[ClientePublic])
async def get_all_clients(session: SessionDep) -> Sequence[Cliente]:
    """Retorna a lista de todos os clientes."""
    return cliente_service.get_all(session)


@router.get("/{cd_cliente}", response_model=ClientePublic)
async def get_client_by_id(cd_cliente: int, session: SessionDep) -> Cliente:
    """Busca um cliente por ID se existir"""
    return cliente_service.get_or_404(session, cd_cliente)


@router.patch("/{cd_cliente}", response_model=ClientePublic)
async def update_client(
    cd_cliente: int, cliente: ClienteUpdate, session: SessionDep
) -> Cliente:
    """Atualiza dados de um cliente de forma parcial."""
    return cliente_service.update(session, cd_cliente, cliente)


@router.delete("/{cd_cliente}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_client(cd_cliente: int, session: SessionDep):
    """Remove um cliente."""
    cliente_service.delete(session, cd_cliente)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
