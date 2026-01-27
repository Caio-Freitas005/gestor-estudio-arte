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


@router.get("/{cd_produto}", response_model=ProdutoPublic)
async def get_product_by_id(cd_produto: int, session: SessionDep) -> Produto:
    """Busca um produto por ID se existir"""
    return produto_service.get_or_404(session, cd_produto)


@router.patch("/{cd_produto}", response_model=ProdutoPublic)
async def update_product(
    cd_produto: int, produto: ProdutoUpdate, session: SessionDep
) -> Produto:
    """Atualiza dados de um produto de forma parcial."""
    return produto_service.update(session, cd_produto, produto)


@router.delete("/{cd_produto}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(cd_produto: int, session: SessionDep):
    """Remove um produto."""
    produto_service.delete(session, cd_produto)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
