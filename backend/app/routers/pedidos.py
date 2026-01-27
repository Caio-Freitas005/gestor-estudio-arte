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


@router.get("/{cd_pedido}", response_model=PedidoPublic)
async def get_order_by_id(cd_pedido: int, session: SessionDep) -> Pedido:
    """Busca um pedido por ID com detalhes se existir."""
    return pedido_service.get_by_id_detailed(session, cd_pedido)


@router.patch("/{cd_pedido}", response_model=PedidoPublic)
async def update_order(
    cd_pedido: int, pedido: PedidoUpdate, session: SessionDep
) -> Pedido:
    """Atualiza dados básicos do pedido."""
    return pedido_service.update(session, cd_pedido, pedido)


@router.post("/{cd_pedido}/itens", response_model=PedidoPublic)
async def add_item_to_order(
    cd_pedido: int, item: ItemPedidoInput, session: SessionDep
) -> Pedido:
    """Adiciona um novo produto ao pedido e recalcula o total."""
    return pedido_service.add_item(session, cd_pedido, item)


@router.delete("/{cd_pedido}/itens/{cd_produto}", response_model=PedidoPublic)
async def remove_item_from_order(
    cd_pedido: int, cd_produto: int, session: SessionDep
) -> Pedido:
    """Remove um item e recalcula o total, impedindo pedidos vazios."""
    return pedido_service.remove_item(session, cd_pedido, cd_produto)


@router.post("/{cd_pedido}/itens/{cd_produto}/upload-arte", response_model=PedidoPublic)
async def upload_item_art(
    cd_pedido: int, cd_produto: int, session: SessionDep, file: UploadFile = File(...)
) -> Pedido:
    """Processa o upload da arte e vincula ao item do pedido."""
    # Processa e salva o caminho no banco de dados
    caminho_relativo = pedido_service.process_art_image(file, cd_pedido, cd_produto)
    
    # Atualiza o registro no banco de dados
    db_item = pedido_service.get_item_or_404(session, cd_pedido, cd_produto)
    db_item.ds_caminho_arte = caminho_relativo
    session.add(db_item)
    session.commit()
    
    return pedido_service.get_by_id_detailed(session, cd_pedido)