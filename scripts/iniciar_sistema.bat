@echo off
title GAPM

echo ==========================================
echo    INICIANDO O SISTEMA...
echo ==========================================
echo.

:: Entra na pasta backend e roda o servidor silenciosamente
start /min "GAPM" cmd /k "cd .. && cd backend && uv run uvicorn app.main:app --host 127.0.0.1 --port 8000"

:: Espera 4 segundos para dar tempo do servidor iniciar
timeout /t 4 /nobreak > NUL

:: Abre o navegador
start http://127.0.0.1:8000

exit