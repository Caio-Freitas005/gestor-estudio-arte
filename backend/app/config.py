from pathlib import Path
from typing import Annotated

from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine, text

# Define o caminho dos arquivos e pastas
BASE_DIR = Path(__file__).resolve().parent.parent
DB_DIR = BASE_DIR
UPLOAD_DIR = BASE_DIR / "uploads"
ARTES_DIR = UPLOAD_DIR / "artes"
ARTES_DIR.mkdir(parents=True, exist_ok=True)

db_name = "gestor.db"
db_path = DB_DIR / db_name
db_url = f"sqlite:///{db_path}"

connect_args = {"check_same_thread": False}
engine = create_engine(db_url, echo=True, connect_args=connect_args)


def run_migrations():
    """
    PLACEHOLDER: Função para futuras migrações de banco de dados.
    """
    with Session(engine) as session:
        # --- Modelo de uso ---
        # try:
        #     session.exec(text("ALTER TABLE nome_tabela ADD COLUMN nova_coluna TIPO"))
        #     session.commit()
        # except Exception:
        #     pass # Ignora se a coluna já existir
        pass


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    run_migrations()


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
