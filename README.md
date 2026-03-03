# Gestor Estúdio de Arte

Um sistema web **local** focado em organizar o fluxo de pedidos (do cadastro de produtos à entrega) e gerenciar o cadastro básico de clientes para um ateliê de produtos personalizados.

Este projeto foi desenhado para ser uma ferramenta **simples**, de **fácil utilização** e com **backup facilitado por cópia de arquivo**, sem a necessidade de comandos manuais complexos por parte do usuário final.

---

## Funcionalidades 

### Gestão de Clientes
- Cadastro contendo:
  - Nome  
  - Telefone  
  - E-mail  
  - Data de Nascimento  
  - Observações  

### Gestão de Pedidos
- Criação de pedidos vinculados a clientes  
- Controle de status
- Adição de itens personalizados  

### Gestão de Produtos
- Catálogo de produtos padronizados  
- Base para criação de itens dentro dos pedidos  

### Filtros de busca
- Filtro por valores, nomes, datas e outros dados

### Anexos de Arte
- Upload de arquivos de imagem (artes)  
- Arquivos salvos fisicamente em diretório local  
- Banco de dados fica leve (somente caminhos dos arquivos)  

### Dashboard
- Visão geral do negócio:
  - Pedidos recentes  
  - Clientes com aniversário no mês  
  - Pedidos pendentes  

### Backup
- Rota para realizar backup do banco de dados com timestamp
- Facilmente sincronizável com nuvem

---

## Tecnologias Utilizadas

A stack do projeto foi escolhida para equilibrar **produtividade, modernidade e simplicidade de infraestrutura** 

### Backend
- Python  
- FastAPI  
- SQLModel / SQLAlchemy (ORM)  
- SQLite (Banco de dados em arquivo local)  
- Uvicorn (Servidor ASGI)  
- Gerenciador de pacotes: `uv`  

### Frontend
- React (com Vite)  
- TypeScript  
- Material UI (MUI)  
- TailwindCSS  

---

## Estrutura do Repositório

```

/backend/    → API FastAPI, modelos de banco de dados e lógica de negócios
/frontend/   → Interface de usuário construída em React
/scripts/    → Scripts de automação para iniciar o sistema

```

---

## Pré-requisitos

Para rodar este projeto em ambiente de desenvolvimento, você precisará ter instalado:

1. **Python 3.13+** (e, de preferência `uv` instalado para gerenciamento de dependências)
2. **Node.js 18+**
3. `npm` (ou `yarn` / `pnpm`)

---

## Como Executar o Sistema (Frontend compilado)

### 1. Instale as dependências do backend:
```bash
cd backend
uv sync
```

### 2. Compile o Frontend:

```bash
cd frontend
npm install
npm run build
```

### 3. Utilize um dos scripts de inicialização:

### No Windows

Execute o arquivo:

```bash
./scripts/iniciar_sistema.bat
```

Esse script automaticamente:

* Inicia o servidor backend (Uvicorn) na porta 8000 em segundo plano
* Aguarda 4 segundos para garantir inicialização
* Abre automaticamente o navegador padrão em:

  ```
  http://127.0.0.1:8000
  ```

### No Linux

O processo é o mesmo, apenas muda o script:

```bash
./scripts/iniciar_sistema.sh
```

---

## Inicialização Manual (Desenvolvimento)

### Backend

```bash
cd backend
uv sync
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload[opcional]
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Backup

O backup foi arquitetado para ser **extremamente simples**.

Para o banco de dados, basta usar o botão de backup na interface, que é gerado um backup local com timestamp.

Para backups mais seguros tanto do banco de dados como das artes, basta sincronizar as pastas `uploads/` e `backups` com uma nuvem, como o Google Drive, por exemplo.


Não há necessidade de comandos específicos ou exportações complexas.

---

## Objetivo do Projeto

Fornecer uma solução prática e leve para gestão de pedidos em um ateliê de produtos personalizados, mantendo:

* Simplicidade operacional
* Baixa complexidade técnica para o usuário final
* Fácil manutenção
* Backup seguro por cópia de arquivo
