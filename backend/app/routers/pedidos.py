from typing import Sequence

from fastapi import APIRouter, File, UploadFile, status

from ..config import SessionDep
from ..models import (
    ItemPedidoInput,
    Pedido,
    PedidoCreate,
    PedidoPublic,
    PedidoUpdate,
)
from ..services import pedido_service

router = APIRouter(prefix="/pedidos", tags=["pedidos"])


@router.post("/", response_model=PedidoPublic, status_code=status.HTTP_201_CREATED)
async def create_order(pedido: PedidoCreate, session: SessionDep) -> Pedido:
    """Cria um pedido completo com itens e cálculo de total."""
    return pedido_service.create(session, pedido)


@router.get("/", response_model=list[PedidoPublic])
async def get_all_orders(session: SessionDep) -> Sequence[Pedido]:
    """Lista todos os pedidos com detalhes de cliente e itens."""
    return pedido_service.get_all_detailed(session)


@router.get("/{pedido_id}", response_model=PedidoPublic)
async def get_order_by_id(pedido_id: int, session: SessionDep) -> Pedido:
    """Busca um pedido por ID com detalhes se existir."""
    return pedido_service.get_by_id_detailed(session, pedido_id)


@router.patch("/{pedido_id}", response_model=PedidoPublic)
async def update_order(
    pedido_id: int, pedido: PedidoUpdate, session: SessionDep
) -> Pedido:
    """Atualiza dados básicos do pedido."""
    return pedido_service.update(session, pedido_id, pedido)


@router.post("/{pedido_id}/itens", response_model=PedidoPublic)
async def add_item_to_order(
    pedido_id: int, item: ItemPedidoInput, session: SessionDep
) -> Pedido:
    """Adiciona um novo produto ao pedido e recalcula o total."""
    return pedido_service.add_item(session, pedido_id, item)


@router.delete("/{pedido_id}/itens/{produto_id}", response_model=PedidoPublic)
async def remove_item_from_order(
    pedido_id: int, produto_id: int, session: SessionDep
) -> Pedido:
    """Remove um item e recalcula o total, impedindo pedidos vazios."""
    return pedido_service.remove_item(session, pedido_id, produto_id)


@router.post("/{pedido_id}/itens/{produto_id}/upload-arte", response_model=PedidoPublic)
async def upload_item_art(
    pedido_id: int, produto_id: int, session: SessionDep, file: UploadFile = File(...)
) -> Pedido:
    """Processa o upload da arte e vincula ao item do pedido."""
    # Processa e salva o caminho no banco de dados
    caminho_relativo = pedido_service.process_art_image(file, pedido_id, produto_id)

    # Atualiza o registro no banco de dados
    db_item = pedido_service.get_item_or_404(session, pedido_id, produto_id)
    db_item.caminho_arte = caminho_relativo
    session.add(db_item)
    session.commit()

    return pedido_service.get_by_id_detailed(session, pedido_id)
