import { redirect } from "react-router";
import { Box, Typography } from "@mui/material";
import ProductForm from "../../components/ProductForm";
import { productsService } from "../../services/products.service";
import { ProdutoCreate } from "../../types/produto.types";

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

function ProductCreatePage() {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h3" gutterBottom>
        Formulário de Produtos
      </Typography>

      <ProductForm />
    </Box>
  );
}

export default ProductCreatePage;
