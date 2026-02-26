import { Typography } from "@mui/material";
import ProductForm from "./components/ProductForm";

function ProductCreatePage() {
  return (
    <div className="flex flex-col gap-6 justify-center">
      <Typography variant="h4">
        Cadastrar <span className="text-pink-500">Produto</span>
      </Typography>
      <ProductForm />
    </div>
  );
}

export default ProductCreatePage;
