from decimal import Decimal
from typing import Sequence

from sqlmodel import Session, func, or_, select

from ..models import Produto, ProdutoCreate, ProdutoUpdate
from .base_service import BaseService


class ProdutoService(BaseService[Produto, ProdutoCreate, ProdutoUpdate]):
    def __init__(self):
        # Inicializa o serviço fixando o modelo Produto
        super().__init__(Produto)

    def get_all_paginated(
        self,
        session: Session,
        q: str | None = None,
        min_preco: Decimal | None = None,
        max_preco: Decimal | None = None,
        skip: int = 0,
        limit: int = 10,
    ) -> dict[str, Sequence[Produto] | int]:
        """
        Retorna todos os produtos paginados com busca textual global
        e filtros de intervalo de preço.
        """

        # Trava de segurança para desempenho
        if limit > 100:
            limit = 100

        query = select(Produto)

        # Filtro de busca global (nome, descrição ou unidade de medida)
        if q:
            query = query.where(
                or_(
                    Produto.nome.ilike(f"%{q}%"),  # type: ignore
                    Produto.descricao.ilike(f"%{q}%"),  # type: ignore
                    Produto.unidade_medida.ilike(f"%{q}%"),  # type: ignore
                )
            )

        # Filtros numéricos
        if min_preco is not None:
            query = query.where(Produto.preco_base >= min_preco)

        if max_preco is not None:
            query = query.where(Produto.preco_base <= max_preco)

        count_query = select(func.count()).select_from(query.subquery())
        total = session.exec(count_query).one()

        query = query.offset(skip).limit(limit)
        results = session.exec(query).all()

        return {"dados": results, "total": total}


produto_service = ProdutoService()
