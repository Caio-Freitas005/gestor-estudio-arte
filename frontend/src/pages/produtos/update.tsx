import { useLoaderData } from "react-router";
import { Typography } from "@mui/material";
import ProductForm from "../../components/ProductForm";
import { ProdutoPublic } from "../../types/produto.types";

function ProductUpdatePage() {
  const productData = useLoaderData() as ProdutoPublic;
  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h4">Editar Produto</Typography>
      <ProductForm defaultValues={productData} />
    </div>
  );
}
export default ProductUpdatePage;
