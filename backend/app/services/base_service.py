from typing import Any, Generic, Sequence, Type, TypeVar

from fastapi import HTTPException, status
from sqlalchemy import func, or_
from sqlmodel import Session, SQLModel, select

# Define tipos genéricos para a model e para os schemas de criação e atualização
ModelType = TypeVar("ModelType", bound=SQLModel)
CreateSchemaType = TypeVar("CreateSchemaType", bound=SQLModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=SQLModel)


class BaseService(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def get_by_id(self, session: Session, id: Any) -> ModelType | None:
        """Busca básica por ID."""
        return session.get(self.model, id)

    def get_or_404(
        self, session: Session, id: Any, detail: str = "Recurso não encontrado"
    ) -> ModelType:
        """Busca por ID e lança 404 automaticamente se não existir."""
        db_obj = self.get_by_id(session, id)
        if not db_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=detail)
        return db_obj

    def get_all(
        self,
        session: Session,
        q: str | None = None,
        skip: int = 0,
        limit: int = 10,
        search_fields: list[str] | None = None,
    ) -> dict[str, Sequence[ModelType] | int]:
        """Retorna todos os registros da tabela paginados e filtrados."""
        query = select(self.model)

        # Aplica busca se houver 'q' e campos definidos
        if q and search_fields:
            filters = [
                getattr(self.model, field).ilike(f"%{q}%") for field in search_fields
            ]
            query = query.where(
                or_(*filters)
            )  # Desempacota condições LIKE e executa query com OR para cada condição

        # Conta total antes de paginar
        count_query = select(func.count()).select_from(query.subquery())
        total = session.exec(count_query).one()

        # Aplica e executa paginação
        query = query.offset(skip).limit(limit)
        results = session.exec(query).all()

        return {"dados": results, "total": total}

    def create(self, session: Session, obj: CreateSchemaType) -> ModelType:
        """Cria, comita e atualiza o objeto no banco."""
        db_obj = self.model.model_validate(obj)
        session.add(db_obj)
        session.commit()
        session.refresh(db_obj)
        return db_obj

    def update(self, session: Session, id: Any, obj: UpdateSchemaType) -> ModelType:
        """Aplica atualizações parciais (PATCH) de forma genérica."""
        db_obj = self.get_or_404(session, id)
        obj_data = obj.model_dump(exclude_unset=True)
        db_obj.sqlmodel_update(obj_data)

        session.add(db_obj)
        session.commit()
        session.refresh(db_obj)
        return db_obj

    def delete(self, session: Session, id: Any) -> None:
        """Remove um registro pelo ID."""
        db_obj = self.get_or_404(session, id)
        session.delete(db_obj)
        session.commit()
