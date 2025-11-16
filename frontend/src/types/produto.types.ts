// Esse arquivo espelha os schemas de:
// backend/app/models/produto.py

interface ProdutoBase {
  nm_produto: string;
  ds_produto?: string | null;
  vl_base?: string | null;
  ds_unidade_medida?: string | null;
}

export interface ProdutoCreate extends ProdutoBase {
  //
}

export interface ProdutoPublic extends ProdutoBase {
  cd_produto: number;
}

export interface ProdutoUpdate extends Partial<ProdutoBase> {
  //
}
