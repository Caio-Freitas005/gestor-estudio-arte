from fastapi import APIRouter, HTTPException, Response, status
from sqlmodel import select

from ..database import SessionDep
from ..models.cliente import Cliente, ClienteCreate, ClientePublic, ClienteUpdate

router = APIRouter(prefix="/clientes", tags=["clientes"])


@router.post("/", response_model=ClientePublic)
async def create_client(cliente: ClienteCreate, session: SessionDep) -> ClientePublic:
    db_cliente = Cliente.model_validate(cliente)
    session.add(db_cliente)
    session.commit()
    session.refresh(db_cliente)
    return db_cliente


@router.get("/", response_model=list[ClientePublic])
async def get_all_clients(session: SessionDep) -> list[ClientePublic]:
    query = select(Cliente)
    clientes = session.exec(query).all()
    return clientes


@router.get("/{cd_cliente}", response_model=ClientePublic)
async def get_client_by_id(cd_cliente: int, session: SessionDep) -> ClientePublic:
    db_cliente = session.get(Cliente, cd_cliente)
    if not db_cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return db_cliente


@router.patch("/{cd_cliente}", response_model=ClientePublic)
async def update_client(
    cd_cliente: int, cliente: ClienteUpdate, session: SessionDep
) -> ClientePublic:
    db_cliente = session.get(Cliente, cd_cliente)
    if not db_cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    cliente_data = cliente.model_dump(exclude_unset=True)
    db_cliente.sqlmodel_update(cliente_data)
    session.add(db_cliente)
    session.commit()
    session.refresh(db_cliente)
    return db_cliente


@router.delete("/{cd_cliente}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_client(cd_cliente: int, session: SessionDep):
    db_cliente = session.get(Cliente, cd_cliente)
    if not db_cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    session.delete(db_cliente)
    session.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
