import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import create_db_and_tables, UPLOAD_DIR
from .routers import clientes, pedidos, produtos

load_dotenv()
origin = os.getenv("FRONT_URL")


# Gerencia o clico de vida da aplicação
# Cria o banco apenas uma vez, se ainda não existir
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Iniciando e criando o banco de dados...")
    create_db_and_tables()
    yield
    print("Encerrando...")


app = FastAPI(lifespan=lifespan)

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin],  # type: ignore
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clientes.router)
app.include_router(produtos.router)
app.include_router(pedidos.router)
