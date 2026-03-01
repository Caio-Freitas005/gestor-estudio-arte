import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "react-router";
import { productsService } from "../../services/products.service";
import { cleanFormData, parseBrazilianNumber } from "../../utils/form.utils";
import { getCommonParams } from "../../utils/loader.utils";
import {
  ProdutoCreate,
  ProdutoPublic,
  ProdutoUpdate,
} from "../../types/produto.types";
import toast from "react-hot-toast";

export async function productsListLoader({ request }: LoaderFunctionArgs) {
  const params = getCommonParams(request, ["min_preco", "max_preco"]);
  const produtos = await productsService.getAll(params);

  return { produtos };
}

export async function productCreateAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = cleanFormData<ProdutoCreate>(formData);

  data.preco_base = parseBrazilianNumber(data.preco_base);

  try {
    await productsService.create(data);
    toast.success("Produto cadastrado com sucesso!");
    return redirect("/produtos");
  } catch (err) {
    console.error(err);
    return { error: err.detail || "Falha ao processar operação" };
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
  const data = cleanFormData<ProdutoUpdate>(formData);

  data.preco_base = parseBrazilianNumber(data.preco_base);

  try {
    await productsService.update(params.id, data);
    return { success: "Produto atualizado com sucesso!" };
  } catch (err) {
    console.error(err);
    return { error: err.detail || "Falha ao processar operação" };
  }
}

export async function productDeleteAction({ params }: ActionFunctionArgs) {
  if (!params.id) {
    throw new Error("ID do cliente não encontrado na URL.");
  }

  try {
    await productsService.delete(params.id);
    return { success: "Produto excluído com sucesso!" };
  } catch (err) {
    console.error(err);
    return { error: err.detail || "Erro ao excluir o produto." };
  }
}
