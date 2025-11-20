import { useLoaderData, redirect, LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { Box, Typography } from "@mui/material";
import ProductForm from "../../components/ProductForm";
import { productsService } from "../../services/products.service";
import { ProdutoPublic, ProdutoUpdate } from "../../types/produto.types";

export async function productUpdateLoader({ params }: LoaderFunctionArgs): Promise<ProdutoPublic> {
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

export async function productUpdateAction({ request, params }: ActionFunctionArgs) {
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

function ProductUpdatePage() {
  const productData = useLoaderData() as ProdutoPublic;
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h3" gutterBottom>
        Formulário de Produtos
      </Typography>

      <ProductForm defaultValues={productData} />
    </Box>
  );
}

export default ProductUpdatePage;
