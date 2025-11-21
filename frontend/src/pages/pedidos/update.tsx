import { useLoaderData } from "react-router";
import OrderForm from "../../components/OrderForm";
import { Box, Typography, Alert } from "@mui/material";
import { UpdateLoaderData } from "./orders.data";

function OrderUpdatePage() {
  const { pedido, clientes } = useLoaderData() as UpdateLoaderData;

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h3">Pedido #{pedido.cd_pedido}</Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Editando pedido de <strong>{pedido.cliente?.nm_cliente}</strong>. Valor
        atual: <strong>R$ {Number(pedido.vl_total_pedido).toFixed(2)}</strong>
      </Alert>

      {/* Reutilização do formulário com dados preenchidos */}
      <OrderForm defaultValues={pedido} clientes={clientes} />
    </Box>
  );
}

export default OrderUpdatePage;
