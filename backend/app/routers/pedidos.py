from typing import Sequence

from fastapi import APIRouter, HTTPException, status
from sqlalchemy.orm import joinedload
from sqlmodel import select

from ..database import SessionDep
from ..models.cliente import Cliente
from ..models.pedido import Pedido, PedidoCreate, PedidoPublic, PedidoUpdate

router = APIRouter(prefix="/pedidos", tags=["pedidos"])


@router.post("/", response_model=PedidoPublic)
async def create_order(pedido: PedidoCreate, session: SessionDep) -> Pedido:
    cliente = session.get(Cliente, pedido.cd_cliente)

    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cliente com ID {pedido.cd_cliente} não encontrado.",
        )

    db_pedido = Pedido.model_validate(pedido)
    session.add(db_pedido)
    session.commit()
    session.refresh(db_pedido)
    return db_pedido


@router.get("/", response_model=list[PedidoPublic])
async def get_all_orders(session: SessionDep) -> Sequence[Pedido]:
    # Para carregar todos os clientes em conjunto com pedidos
    # e evitar várias consultas separadas
    query = select(Pedido).options(joinedload(Pedido.cliente))  # type: ignore
    pedidos = session.exec(query).all()
    return pedidos


@router.get("/{cd_pedido}", response_model=PedidoPublic)
async def get_order_by_id(cd_pedido: int, session: SessionDep) -> Pedido:
    # Para carregar cliente em conjunto com o pedido
    query = (
        select(Pedido)
        .where(Pedido.cd_pedido == cd_pedido)
        .options(joinedload(Pedido.cliente))  # type: ignore
    )
    db_pedido = session.exec(query).first()
    if not db_pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    return db_pedido


@router.patch("/{cd_pedido}", response_model=PedidoPublic)
async def update_order(
    cd_pedido: int, pedido: PedidoUpdate, session: SessionDep
) -> Pedido:
    db_pedido = session.get(Pedido, cd_pedido)
    if not db_pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")

    pedido_data = pedido.model_dump(exclude_unset=True)

    # Se estiver trocando o cliente, valida se o novo existe
    if "cd_cliente" in pedido_data and pedido_data["cd_cliente"]:
        cliente = session.get(Cliente, pedido_data["cd_cliente"])
        if not cliente:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Cliente com ID {pedido_data['cd_cliente']} não encontrado.",
            )

    db_pedido.sqlmodel_update(pedido_data)
    session.add(db_pedido)
    session.commit()
    session.refresh(db_pedido)
    return db_pedido
