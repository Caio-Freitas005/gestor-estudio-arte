from typing import Sequence

from fastapi import APIRouter, Response, status

from ..config import SessionDep
from ..models import (
    Cliente,
    ClienteCreate,
    ClientePublic,
    ClientePublicPaginated,
    ClienteUpdate,
)
from ..services import cliente_service

router = APIRouter(prefix="/clientes", tags=["clientes"])


@router.post("/", response_model=ClientePublic, status_code=status.HTTP_201_CREATED)
async def create_client(cliente: ClienteCreate, session: SessionDep) -> Cliente:
    """Cria um novo cliente."""
    return cliente_service.create(session, cliente)


@router.get("/", response_model=ClientePublicPaginated)
async def get_all_clients(
    session: SessionDep, q: str | None = None, skip: int = 0, limit: int = 10
) -> dict[str, Sequence[Cliente] | int]:
    """Retorna a lista de todos os clientes com paginação e filtro de busca geral por nome, email e telefone."""
    return cliente_service.get_all(
        session,
        q=q,
        skip=skip,
        limit=limit,
        search_fields=["nome", "email", "telefone"],
    )


@router.get("/{id}", response_model=ClientePublic)
async def get_client_by_id(id: int, session: SessionDep) -> Cliente:
    """Busca um cliente por ID se existir"""
    return cliente_service.get_or_404(session, id)


@router.patch("/{id}", response_model=ClientePublic)
async def update_client(
    id: int, cliente: ClienteUpdate, session: SessionDep
) -> Cliente:
    """Atualiza dados de um cliente de forma parcial."""
    return cliente_service.update(session, id, cliente)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_client(id: int, session: SessionDep):
    """Remove um cliente."""
    cliente_service.delete(session, id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
