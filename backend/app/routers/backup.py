import shutil
from datetime import datetime

from fastapi import APIRouter, HTTPException, status

from ..config import BACKUP_DIR, db_path

router = APIRouter(prefix="/backup", tags=["backup"])


@router.post("/")
def create_backup():
    """Gera uma cópia física do banco de dados SQLite com timestamp."""

    if not db_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Arquivo do banco de dados não encontrado para backup.",
        )

    try:
        # Gera o nome com a data e hora atual (Ex: backup_2026-03-01_14-30-05.db)
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        nome_backup = f"backup_{timestamp}.db"

        # Caminho final 
        caminho_destino = BACKUP_DIR / nome_backup

        # Faz a cópia exata do arquivo
        shutil.copy2(db_path, caminho_destino)

        return {"success": f"Backup '{nome_backup}' salvo com sucesso!"}

    except PermissionError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro de permissão: O sistema não tem acesso à pasta.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Falha ao realizar backup: {str(e)}",
        )
