from typing import Sequence

from fastapi import APIRouter, File, HTTPException, UploadFile, status
from sqlalchemy.orm import joinedload
from sqlmodel import select

from ..config import SessionDep
from ..models.cliente import Cliente
from ..models.item_pedido import ItemPedido, ItemPedidoUpdate
from ..models.pedido import (
    ItemPedidoInput,
    Pedido,
    PedidoCreate,
    PedidoPublic,
    PedidoUpdate,
)
from ..models.produto import Produto
from ..services import pedido_service

router = APIRouter(prefix="/pedidos", tags=["pedidos"])


@router.post("/", response_model=PedidoPublic)
async def create_order(pedido: PedidoCreate, session: SessionDep) -> Pedido:
    cliente = session.get(Cliente, pedido.cd_cliente)
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cliente com ID {pedido.cd_cliente} não encontrado.",
        )

    db_pedido = pedido_service.create_order(pedido, session)

    session.add(db_pedido)
    session.commit()
    session.refresh(db_pedido)
    return db_pedido


@router.get("/", response_model=list[PedidoPublic])
async def get_all_orders(session: SessionDep) -> Sequence[Pedido]:
    # Para carregar todos os clientes em conjunto com pedidos e itens
    # e evitar várias consultas separadas
    query = select(Pedido).options(joinedload(Pedido.cliente), joinedload(Pedido.itens))  # type: ignore
    pedidos = session.exec(query).unique().all()
    return pedidos


@router.get("/{cd_pedido}", response_model=PedidoPublic)
async def get_order_by_id(cd_pedido: int, session: SessionDep) -> Pedido:
    # Para carregar cliente em conjunto com o pedido e itens
    query = (
        select(Pedido)
        .where(Pedido.cd_pedido == cd_pedido)
        .options(joinedload(Pedido.cliente), joinedload(Pedido.itens))  # type: ignore
    )
    db_pedido = session.exec(query).unique().first()
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


@router.post("/{cd_pedido}/itens", response_model=PedidoPublic)
async def add_item_to_order(
    cd_pedido: int, item: ItemPedidoInput, session: SessionDep
) -> Pedido:
    db_pedido = session.get(Pedido, cd_pedido)
    if not db_pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")

    produto = session.get(Produto, item.cd_produto)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    item_existente = session.get(ItemPedido, (cd_pedido, item.cd_produto))

    preco_final = (
        item.vl_unitario_praticado
        if item.vl_unitario_praticado is not None
        else produto.vl_base
    )

    if item_existente:
        item_existente.qt_produto += item.qt_produto
        session.add(item_existente)
    else:
        novo_item = ItemPedido(
            cd_produto=item.cd_produto,
            qt_produto=item.qt_produto,
            ds_observacoes_item=item.ds_observacoes_item,
            vl_unitario_praticado=preco_final,
        )
        db_pedido.itens.append(novo_item)

    session.add(db_pedido)
    session.commit()

    pedido_service.calculate_total_order(db_pedido, session)

    return db_pedido


@router.patch("/{cd_pedido}/itens/{cd_produto}", response_model=PedidoPublic)
async def update_item_in_order(
    cd_pedido: int, cd_produto: int, item_update: ItemPedidoUpdate, session: SessionDep
) -> Pedido:
    """
    Atualiza um item específico de um pedido (ex: corrige quantidade, valor ou observação).
    Recalcula o total do pedido automaticamente.
    """
    # Busca o item pela chave composta (pedido + produto)
    db_item = session.get(ItemPedido, (cd_pedido, cd_produto))

    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item não encontrado neste pedido",
        )

    # Busca o pedido pai para recalcular o total depois
    db_pedido = session.get(Pedido, cd_pedido)
    if not db_pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")

    # Atualiza os campos do item
    item_data = item_update.model_dump(exclude_unset=True)
    db_item.sqlmodel_update(item_data)

    session.add(db_item)
    session.commit()

    # Recalcula o total do pedido com os novos valores do item
    pedido_service.calculate_total_order(db_pedido, session)

    return db_pedido


@router.delete("/{cd_pedido}/itens/{cd_produto}", response_model=PedidoPublic)
async def remove_item_from_order(
    cd_pedido: int, cd_produto: int, session: SessionDep
) -> Pedido:
    """
    Remove um item do pedido e recalcula o total.
    Impede remover o último item para evitar pedido vazio.
    """
    # Busca o pedido com os itens carregados
    db_pedido = session.get(Pedido, cd_pedido)
    if not db_pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")

    # Verifica a quantidade de pedidos para impedir o último de ser deletado
    if len(db_pedido.itens) <= 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível remover o último item do pedido. O pedido não pode ficar vazio.",
        )

    # Busca o item específico para deletar
    db_item = session.get(ItemPedido, (cd_pedido, cd_produto))

    if not db_item:
        raise HTTPException(status_code=404, detail="Item não encontrado neste pedido")

    session.delete(db_item)
    session.commit()

    # Recalcula o total
    session.refresh(db_pedido)  # Atualiza a lista de itens
    pedido_service.calculate_total_order(db_pedido, session)

    return db_pedido


@router.post("/{cd_pedido}/itens/{cd_produto}/upload-arte", response_model=PedidoPublic)
async def upload_item_art(
    cd_pedido: int, cd_produto: int, session: SessionDep, file: UploadFile = File(...)
) -> Pedido:
    db_item = session.get(ItemPedido, (cd_pedido, cd_produto))
    if not db_item:
        raise HTTPException(status_code=404, detail="Item não encontrado.")

    db_item.ds_caminho_arte = pedido_service.process_art_image(
        file, cd_pedido, cd_produto
    )

    session.add(db_item)
    session.commit()

    statement = (
        select(Pedido)
        .where(Pedido.cd_pedido == cd_pedido)
        .options(joinedload(Pedido.itens), joinedload(Pedido.cliente))  # type: ignore
    )

    db_pedido = session.exec(statement).unique().first()

    if not db_pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado.")

    session.refresh(db_pedido)
    return db_pedido
