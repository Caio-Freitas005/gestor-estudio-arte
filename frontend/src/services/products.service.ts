import { createCrudService } from "./factory";
import { ProdutoPublic, ProdutoCreate, ProdutoUpdate } from "../types/produto.types";

export const productsService = createCrudService<ProdutoPublic, ProdutoCreate, ProdutoUpdate>("produtos");