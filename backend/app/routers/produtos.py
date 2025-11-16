from fastapi import APIRouter, HTTPException, Response, status
from sqlmodel import select
from typing import Sequence
from ..database import SessionDep
from ..models.produto import Produto, ProdutoCreate, ProdutoPublic, ProdutoUpdate

router = APIRouter(prefix="/produtos", tags=["produtos"])


@router.post("/", response_model=ProdutoPublic)
async def create_product(produto: ProdutoCreate, session: SessionDep) -> Produto:
    db_produto = Produto.model_validate(produto)
    session.add(db_produto)
    session.commit()
    session.refresh(db_produto)
    return db_produto


@router.get("/", response_model=list[ProdutoPublic])
async def get_all_products(session: SessionDep) -> Sequence[Produto]:
    query = select(Produto)
    produtos = session.exec(query).all()
    return produtos


@router.get("/{cd_produto}", response_model=ProdutoPublic)
async def get_product_by_id(cd_produto: int, session: SessionDep) -> Produto:
    db_produto = session.get(Produto, cd_produto)
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return db_produto


@router.patch("/{cd_produto}", response_model=ProdutoPublic)
async def update_product(
    cd_produto: int, produto: ProdutoUpdate, session: SessionDep
) -> Produto:
    db_produto = session.get(Produto, cd_produto)
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    produto_data = produto.model_dump(exclude_unset=True)
    db_produto.sqlmodel_update(produto_data)
    session.add(db_produto)
    session.commit()
    session.refresh(db_produto)
    return db_produto


@router.delete("/{cd_produto}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(cd_produto: int, session: SessionDep):
    db_produto = session.get(Produto, cd_produto)
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    session.delete(db_produto)
    session.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
