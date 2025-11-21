import { redirect, useLoaderData } from "react-router";
import { Box, Typography } from "@mui/material";
import OrderForm from "../../components/OrderForm";
import { ordersService } from "../../services/orders.service";
import { clientsService } from "../../services/clients.service";
import { PedidoCreate, StatusPedido } from "../../types/pedido.types";
import { ClientePublic } from "../../types/cliente.types";

export async function orderCreateLoader() {
  const clients = clientsService.getAll();
  return clients;
}

export async function orderCreateAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const dataToSend: PedidoCreate = {
    dt_pedido: data.dt_pedido as string,
    ds_status: data.ds_status as StatusPedido,
    cd_cliente: Number(data.cd_cliente), // Converte string do select para number
  };

  try {
    await ordersService.create(dataToSend);
    return redirect("/pedidos");
  } catch (err) {
    console.error(err);
    // Retornar o erro para exibição depois
    return null;
  }
}

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
