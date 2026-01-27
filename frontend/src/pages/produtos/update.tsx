import { useLoaderData } from "react-router";
import { Typography } from "@mui/material";
import { ProdutoPublic } from "../../types/produto.types";
import ProductForm from "./components/ProductForm";

function ProductUpdatePage() {
  const productData = useLoaderData() as ProdutoPublic;
  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h4">Editar <span className="text-pink-500">Produto</span></Typography>
      <ProductForm defaultValues={productData} />
    </div>
  );
}

export default ProductUpdatePage;
