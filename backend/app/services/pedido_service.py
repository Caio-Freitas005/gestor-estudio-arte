import io
from decimal import Decimal
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status
from PIL import Image, ImageOps
from sqlmodel import Session
from ..config import ARTES_DIR
from ..models.item_pedido import ItemPedido
from ..models.pedido import Pedido, PedidoCreate
from ..models.produto import Produto


def calculate_total_order(pedido: Pedido, session: Session):
    """
    Recalcula o valor total do pedido somando os itens.
    Usa Decimal para evitar erros de arredondamento.
    """
    # Garante que a lista de itens está atualizada
    session.refresh(pedido)

    total = Decimal("0.00")
    for item in pedido.itens:
        qt = Decimal(item.qt_produto)
        valor = item.vl_unitario_praticado
        total += valor * qt

    pedido.vl_total_pedido = total
    session.add(pedido)
    session.commit()
    session.refresh(pedido)


def create_order(pedido: PedidoCreate, session: Session) -> Pedido:
    """Consolida itens duplicados e calcula o total inicial antes de salvar."""
    if not pedido.itens:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O pedido não pode ser vazio. Adicione pelo menos um produto.",
        )

    itens_consolidados = {}
    for item in pedido.itens:
        if item.cd_produto in itens_consolidados:
            # Se o produto já está na lista temporária, soma a quantidade
            itens_consolidados[item.cd_produto].qt_produto += item.qt_produto  # type: ignore
        else:
            # Se é a primeira vez que o produto aparece, adiciona ao dicionário
            itens_consolidados[item.cd_produto] = item

    pedido.itens = list(itens_consolidados.values())  # type: ignore

    db_pedido = Pedido.model_validate(pedido.model_dump(exclude={"itens"}))

    valor_total_acumulado = Decimal("0.00")

    for item in pedido.itens:
        produto = session.get(Produto, item.cd_produto)
        if not produto:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Produto ID {item.cd_produto} não encontrado.",
            )

        preco_final = (
            item.vl_unitario_praticado
            if item.vl_unitario_praticado is not None
            else produto.vl_base
        )

        novo_item = ItemPedido(
            cd_produto=item.cd_produto,
            qt_produto=item.qt_produto,
            ds_observacoes_item=item.ds_observacoes_item,
            vl_unitario_praticado=preco_final,
        )

        db_pedido.itens.append(novo_item)

        valor_total_acumulado += novo_item.vl_unitario_praticado * Decimal(
            item.qt_produto
        )

    db_pedido.vl_total_pedido = valor_total_acumulado

    return db_pedido


def process_art_image(file: UploadFile, cd_pedido: int, cd_produto: int) -> str:
    try:
        content = file.file.read()
        img = Image.open(io.BytesIO(content))

        if img.format not in ["PNG", "JPG", "JPEG", "WEBP"]:
            raise HTTPException(status_code=400, detail="Formato não suportado.")

        img = ImageOps.exif_transpose(img)

        file_name = f"art_ped_{cd_pedido}_prod_{cd_produto}_{uuid4().hex}.webp"
        file_path = ARTES_DIR / file_name

        img.save(str(file_path), "WEBP", quality=95, lossless=False)

        return f"/uploads/artes/{file_name}"
    except Exception:
        raise HTTPException(status_code=400, detail="Erro ao processar imagem.")
