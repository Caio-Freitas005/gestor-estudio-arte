import { Typography } from "@mui/material";
import ProductForm from "./components/ProductForm";

function ProductCreatePage() {
  return (
    <div className="flex flex-col gap-6 justify-center">
      <Typography variant="h4">Novo Produto</Typography>
      <ProductForm />
    </div>
  );
}

export default ProductCreatePage;
