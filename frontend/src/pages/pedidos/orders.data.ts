import { LoaderFunctionArgs, ActionFunctionArgs, redirect } from "react-router";
import { ordersService } from "../../services/orders.service";
import { clientsService } from "../../services/clients.service";
import { clientsListLoader } from "../clientes/clients.data";
import { ClientePublic } from "../../types/cliente.types";
import {
  PedidoCreate,
  PedidoPublic,
  PedidoUpdate,
  StatusPedido,
} from "../../types/pedido.types";

export async function ordersListLoader() {
  const orders = await ordersService.getAll();
  return orders;
}

export const orderCreateLoader = () => clientsListLoader();

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

// Tipo de retorno do Loader (Pedido + Lista de Clientes para o select)
export type UpdateLoaderData = {
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
