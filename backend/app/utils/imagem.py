import io
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile
from PIL import Image, ImageOps

from ..config import ARTES_DIR

MAX_FILE_SIZE = 15 * 1024 * 1024  # 15 MB


def process_art_image(file: UploadFile, pedido_id: int, produto_id: int) -> str:
    """Processa e salva imagem em disco, garantindo que tenha
    formatos permitidos e esteja dentro do tamanho máximo"""
    try:
        # Pula para o final do arquivo para ver o tamanho
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)  # Volta o cursor para o início para o PIL conseguir ler

        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400, detail="A imagem deve ter no máximo 15MB."
            )

        content = file.file.read()
        img = Image.open(io.BytesIO(content))
        if img.format not in ["PNG", "JPG", "JPEG", "WEBP"]:
            raise HTTPException(status_code=400, detail="Formato não suportado.")

        img = ImageOps.exif_transpose(img)
        file_name = f"arte_pedido_{pedido_id}_produto_{produto_id}_{uuid4().hex}.webp"
        file_path = ARTES_DIR / file_name
        img.save(str(file_path), "WEBP", quality=95)
        return f"/uploads/artes/{file_name}"
    except HTTPException:
        raise  # Deixa o erro com a mensagem original passar direto
    except Exception:
        raise HTTPException(
            status_code=400, detail="Erro ao processar imagem ou arquivo corrompido."
        )


def delete_art_image(caminho_arte: str | None):
    """Remove uma imagem fisicamente do disco, se ela existir,
    garantindo que não apaga arquivos do sistema."""
    if not caminho_arte:
        return

    try:
        # Pega apenas o nome do arquivo, ignorando caminhos maliciosos
        nome_arquivo = Path(caminho_arte).name
        caminho_fisico = ARTES_DIR / nome_arquivo

        # Verifica se o arquivo existe e se realmente está dentro da pasta de artes permitida
        if caminho_fisico.exists() and caminho_fisico.is_file():
            # A função resolve() resolve atalhos para garantir a segurança
            if ARTES_DIR.resolve() in caminho_fisico.resolve().parents:
                caminho_fisico.unlink()
    except Exception as e:
        print(f"Não foi possível deletar a imagem '{caminho_arte}': {e}")
