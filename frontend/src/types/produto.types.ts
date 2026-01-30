// Esse arquivo espelha os schemas de:
// backend/app/models/produto.py

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

export interface ProdutoUpdate extends Partial<ProdutoBase> {
  //
}
