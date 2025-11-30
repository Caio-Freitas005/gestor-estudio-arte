from pathlib import Path
from typing import Annotated

from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine

# Define o caminho do arquivo do banco
BASE_DIR = Path(__file__).resolve().parent.parent
DB_DIR = BASE_DIR

db_name = "gestor.db"
db_path = DB_DIR / db_name
db_url = f"sqlite:///{db_path}"

connect_args = {"check_same_thread": False}
engine = create_engine(db_url, echo=True, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
