// Esse arquivo define as funções de produtos para acesso a API
import { apiBase } from "./apiBase";
import { ProdutoPublic, ProdutoCreate, ProdutoUpdate } from "../types/produto.types";

const resource = "produtos";

export async function getProducts(): Promise<ProdutoPublic[]> {
  return apiBase.get(`${resource}/`);
}

export async function getProduct(id: string): Promise<ProdutoPublic> {
  return apiBase.get(`${resource}/${id}`);
}

export async function createProduct(productData: ProdutoCreate): Promise<ProdutoPublic> {
  return apiBase.post(`${resource}/`, productData);
}

export async function updateProduct(id: string, productData: ProdutoUpdate): Promise<ProdutoPublic> {
  return apiBase.patch(`${resource}/${id}`, productData);
}

export async function deleteProduct(id: string): Promise<null> {
  return apiBase.delete(`${resource}/${id}`);
}
