import { useLoaderData } from "react-router";
import { Box, Typography } from "@mui/material";
import OrderForm from "../../components/OrderForm";
import { ClientePublic } from "../../types/cliente.types";

function OrderCreatePage() {
  const clients = useLoaderData() as ClientePublic[];
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h3" gutterBottom>
        Abrir Novo Pedido
      </Typography>
      <OrderForm clientes={clients} />
    </Box>
  );
}

export default OrderCreatePage;
