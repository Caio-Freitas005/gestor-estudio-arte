import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "react-router";
import { productsService } from "../../services/products.service";
import {
  ProdutoCreate,
  ProdutoPublic,
  ProdutoUpdate,
} from "../../types/produto.types";

export const productsListLoader = () => productsService.getAll();

export async function productCreateAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const productData = Object.fromEntries(formData);

  const dataToSend: ProdutoCreate = {
    nm_produto: productData.nm_produto as string,
    ds_produto: (productData.ds_produto as string) || null,
    vl_base: (productData.vl_base as string) || null,
    ds_unidade_medida: (productData.ds_unidade_medida as string) || null,
  };

  try {
    await productsService.create(dataToSend);
    return redirect("/produtos");
  } catch (err) {
    console.error(err);
    // Retornar o erro para exibição depois
    return null;
  }
}

export async function productLoader({
  params,
}: LoaderFunctionArgs): Promise<ProdutoPublic> {
  if (!params.id) {
    throw new Error("ID do produto não encontrado na URL.");
  }

  try {
    const product = await productsService.getById(params.id);
    return product;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function productUpdateAction({
  request,
  params,
}: ActionFunctionArgs) {
  if (!params.id) {
    throw new Error("ID do produto não encontrado na URL.");
  }

  const formData = await request.formData();
  const productData = Object.fromEntries(formData);

  const dataToSend: ProdutoUpdate = {
    nm_produto: productData.nm_produto as string | undefined,
    ds_produto: (productData.ds_produto as string) || null,
    vl_base: (productData.vl_base as string) || null,
    ds_unidade_medida: (productData.ds_unidade_medida as string) || null,
  };

  try {
    await productsService.update(params.id, dataToSend);
    return redirect("/produtos");
  } catch (err) {
    console.error(err);
    // Retornar o erro para exibição depois
    return null;
  }
}

export async function productDeleteAction({ params }: ActionFunctionArgs) {
  if (!params.id) {
    throw new Error("ID do cliente não encontrado na URL.");
  }

  try {
    await productsService.delete(params.id);
    return redirect("/produtos");
  } catch (err) {
    console.error(err);
    throw err;
  }
}
