import { LoaderFunctionArgs, ActionFunctionArgs, redirect } from "react-router";
import { ordersService } from "../../services/orders.service";
import { clientsService } from "../../services/clients.service";
import { productsService } from "../../services/products.service"; 
import { ClientePublic } from "../../types/cliente.types";
import { ProdutoPublic } from "../../types/produto.types"; 
import {
  PedidoPublic,
  PedidoCreate,
  ItemPedidoInput
} from "../../types/pedido.types";

export async function ordersListLoader() {
  const orders = await ordersService.getAll();
  return orders;
}

export type CreateLoaderData = {
  clientes: ClientePublic[];
  produtos: ProdutoPublic[];
};

export async function orderCreateLoader(): Promise<CreateLoaderData> {
  const [clientes, produtos] = await Promise.all([
    clientsService.getAll(),
    productsService.getAll(),
  ]);
  return { clientes, produtos };
}

export async function orderCreateAction({ request }: ActionFunctionArgs) {
  const data = (await request.json()) as PedidoCreate;

  try {
    await ordersService.create(data);
    return redirect("/pedidos");
  } catch (err) {
    console.error("Erro ao criar pedido:", err);
    return null;
  }
}

export type UpdateLoaderData = {
  pedido: PedidoPublic;
  clientes: ClientePublic[];
  produtos: ProdutoPublic[];
};

export async function orderUpdateLoader({
  params,
}: LoaderFunctionArgs): Promise<UpdateLoaderData> {
  if (!params.id) {
    throw new Error("ID do pedido não encontrado.");
  }

  const [pedido, clientes, produtos] = await Promise.all([
    ordersService.getById(params.id),
    clientsService.getAll(),
    productsService.getAll(),
  ]);

  return { pedido, clientes, produtos };
}

export async function orderUpdateAction({ request, params }: ActionFunctionArgs) {
  if (!params.id) throw new Error("ID inválido");
  const cd_pedido = Number(params.id);

  const data = await request.json();
  const { intent, ...payload } = data; // Separa a "intenção" do resto dos dados

  try {
    switch (intent) {
      case "add_item":
        await ordersService.addItem(cd_pedido, payload as ItemPedidoInput);
        break;

      case "remove_item":
        await ordersService.removeItem(cd_pedido, payload.cd_produto);
        break;
      
      case "update_item":
        await ordersService.updateItem(cd_pedido, payload.cd_produto, payload);
        break;

      default:
        await ordersService.update(cd_pedido, payload);
        return redirect("/pedidos")
    }

  } catch (err) {
    console.error("Erro na action de pedido:", err);
    return null;
  }
}

