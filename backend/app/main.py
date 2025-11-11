import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

from .database import create_db_and_tables

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


app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Olá"}
