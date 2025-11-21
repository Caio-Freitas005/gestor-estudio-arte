import {
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  ActionFunctionArgs,
} from "react-router";
import {
  PedidoPublic,
  PedidoUpdate,
  StatusPedido,
} from "../../types/pedido.types";

import { ClientePublic } from "../../types/cliente.types";
import { ordersService } from "../../services/orders.service";
import { clientsService } from "../../services/clients.service";
import OrderForm from "../../components/OrderForm";
import { Box, Typography, Alert } from "@mui/material";

// Tipo de retorno do Loader (Pedido + Lista de Clientes para o select)
type LoaderData = {
  pedido: PedidoPublic;
  clientes: ClientePublic[];
};

// Busca o pedido específico e a lista de clientes
export async function orderUpdateLoader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Error("ID do pedido não encontrado.");
  }

  // Busca em paralelo para ser mais rápido
  const [pedido, clientes] = await Promise.all([
    ordersService.getById(params.id),
    clientsService.getAll(),
  ]);

  return { pedido, clientes };
}

export async function orderUpdateAction({
  request,
  params,
}: ActionFunctionArgs) {
  if (!params.id) throw new Error("ID inválido");

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const dataToSend: PedidoUpdate = {
    dt_pedido: data.dt_pedido as string,
    ds_status: data.ds_status as StatusPedido,
    cd_cliente: Number(data.cd_cliente),
  };

  try {
    await ordersService.update(params.id, dataToSend);
    return redirect("/pedidos");
  } catch (err) {
    console.error(err);
    return null;
  }
}

function OrderUpdatePage() {
  const { pedido, clientes } = useLoaderData() as LoaderData;

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
