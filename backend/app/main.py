import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .config import FRONTEND_DIST_DIR, UPLOAD_DIR, create_db_and_tables
from .routers import clientes_router, dashboard_router, pedidos_router, produtos_router

load_dotenv()
origin = os.getenv("FRONT_URL")


# Gerencia o clico de vida da aplicação
# Cria o banco apenas uma vez, se ainda não existir
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Verificando integridade do banco de dados...")
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

app.include_router(clientes_router)
app.include_router(produtos_router)
app.include_router(pedidos_router)
app.include_router(dashboard_router)

if FRONTEND_DIST_DIR.exists():
    # Serve a pasta 'assets' (JS e CSS compilados)
    app.mount(
        "/assets", StaticFiles(directory=FRONTEND_DIST_DIR / "assets"), name="assets"
    )

    # Serve o frontend e resolve as rotas do React
    @app.get("/{catchall:path}")
    def serve_react_app(catchall: str):
        file_path = FRONTEND_DIST_DIR / catchall

        # Se for um arquivo real que existe na pasta, serve ele
        if file_path.is_file():
            return FileResponse(file_path)

        # Se não, devolve o index.html e deixa o React Router assumir
        return FileResponse(FRONTEND_DIST_DIR / "index.html")
