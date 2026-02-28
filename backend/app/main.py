import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
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


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_request: Request, exc: RequestValidationError):
    """Captura os erros mais comuns no sistema, traduz e 
    transforma em respostas simples e genéricas."""
    pydantic_error = exc.errors()[0]
    error_type = pydantic_error.get("type")
    message = pydantic_error.get("msg")
    location = pydantic_error.get("loc", [])

    # Mapeamento de erros comuns para mensagens
    translations = {
        "greater_than_equal": "Este campo não aceita valores negativos.",
        "greater_than": "O valor deve ser maior que zero.",
        "decimal_max_digits": "O valor é muito grande (máximo de 8 dígitos inteiros).",
        "decimal_max_places": "O valor deve ter no máximo 2 casas decimais.",
        "decimal_type": "O valor deve ser um número decimal válido.",
        "string_too_long": "O texto inserido é muito longo (máximo de 20 caracteres).",
        "value_error": "O formato inserido é inválido.",
        "assertion_error": "Validação falhou.",
        "missing": "Este campo é obrigatório.",
    }

    # Erros de email são verificados separadamente por conta
    # da quantidade de tipos associados no Pydantic

    # Verifica se o erro é especificamente no campo email
    if "email" in location:
        if "too_long" in error_type:
            message = "O e-mail inserido é muito longo (máximo  de 100 caracteres)."
        else:
            message = "O formato de e-mail inserido é inválido."

    # Se não for email, verifica no dicionário de traduções
    elif error_type in translations:
        message = translations[error_type]

    # Limpa a string de erro caso venha de um @field_validator personalizado
    message = str(message).replace("Value error, ", "")

    return JSONResponse(
        status_code=422,
        content={"detail": message},
    )


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
