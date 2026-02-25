#!/bin/bash

echo "=========================================="
echo "         INICIANDO O SISTEMA...           "
echo "=========================================="
echo ""

# Dispara uma rotina em segundo plano que espera 4 segundos e abre o navegador
(
    sleep 4
    # Verifica se é Linux (xdg-open) ou macOS (open) e abre o navegador
    if command -v xdg-open &> /dev/null; then
        xdg-open http://127.0.0.1:8000
    elif command -v open &> /dev/null; then
        open http://127.0.0.1:8000
    else
        python3 -m webbrowser http://127.0.0.1:8000
    fi
) &

# Entra na pasta backend e roda o servidor (isso vai manter o terminal ocupado com os logs)
# Para fechar o sistema, só precisa fechar o terminal ou dar Ctrl+C
cd .. && cd backend && uv run uvicorn app.main:app --host 127.0.0.1 --port 8000
