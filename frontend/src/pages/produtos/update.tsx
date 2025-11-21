import { useLoaderData } from "react-router";
import { Box, Typography } from "@mui/material";
import ProductForm from "../../components/ProductForm";
import { ProdutoPublic } from "../../types/produto.types";

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
