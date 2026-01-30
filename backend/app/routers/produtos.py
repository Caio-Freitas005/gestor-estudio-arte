from typing import Sequence

from fastapi import APIRouter, Response, status

from ..config import SessionDep
from ..models import Produto, ProdutoCreate, ProdutoPublic, ProdutoUpdate
from ..services import produto_service

router = APIRouter(prefix="/produtos", tags=["produtos"])


@router.post("/", response_model=ProdutoPublic, status_code=status.HTTP_201_CREATED)
async def create_product(produto: ProdutoCreate, session: SessionDep) -> Produto:
    """Cria um novo produto."""
    return produto_service.create(session, produto)


@router.get("/", response_model=list[ProdutoPublic])
async def get_all_products(session: SessionDep) -> Sequence[Produto]:
    """Retorna a lista de todos os produtos."""
    return produto_service.get_all(session)


@router.get("/{id}", response_model=ProdutoPublic)
async def get_product_by_id(id: int, session: SessionDep) -> Produto:
    """Busca um produto por ID se existir"""
    return produto_service.get_or_404(session, id)


@router.patch("/{id}", response_model=ProdutoPublic)
async def update_product(
    id: int, produto: ProdutoUpdate, session: SessionDep
) -> Produto:
    """Atualiza dados de um produto de forma parcial."""
    return produto_service.update(session, id, produto)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(id: int, session: SessionDep):
    """Remove um produto."""
    produto_service.delete(session, id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
