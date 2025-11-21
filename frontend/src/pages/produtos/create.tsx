import { Box, Typography } from "@mui/material";
import ProductForm from "../../components/ProductForm";

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
