import io
from uuid import uuid4

from fastapi import HTTPException, UploadFile
from PIL import Image, ImageOps

from ..config import ARTES_DIR


def process_art_image(file: UploadFile, pedido_id: int, produto_id: int) -> str:
    """Processa e salva imagem em disco, garantindo que tenha formatos permitidos"""
    try:
        content = file.file.read()
        img = Image.open(io.BytesIO(content))
        if img.format not in ["PNG", "JPG", "JPEG", "WEBP"]:
            raise HTTPException(status_code=400, detail="Formato não suportado.")

        img = ImageOps.exif_transpose(img)
        file_name = f"art_ped_{pedido_id}_prod_{produto_id}_{uuid4().hex}.webp"
        file_path = ARTES_DIR / file_name
        img.save(str(file_path), "WEBP", quality=95)
        return f"/uploads/artes/{file_name}"
    except Exception:
        raise HTTPException(status_code=400, detail="Erro ao processar imagem.")
