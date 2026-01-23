import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import create_db_and_tables
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

# Define o caminho absoluto para a pasta uploads dentro do backend
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")

# Cria a pasta física se ela não existir 
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)
    # Cria também a subpasta de artes
    os.makedirs(os.path.join(UPLOAD_DIR, "artes"), exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

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
