// Esse arquivo espelha os schemas de:
// backend/app/models/produto.py

import { PaginatedResponse } from "./common.types";

interface ProdutoBase {
  nome: string;
  descricao?: string | null;
  preco_base?: string | null;
  unidade_medida?: string | null;
}

export interface ProdutoCreate extends ProdutoBase {
  //
}

export interface ProdutoPublic extends ProdutoBase {
  id: number;
}

export type ProdutoPaginated = PaginatedResponse<ProdutoPublic>;

export interface ProdutoUpdate extends Partial<ProdutoBase> {
  //
}
