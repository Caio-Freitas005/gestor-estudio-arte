import { LoaderFunctionArgs, ActionFunctionArgs, redirect } from "react-router";
import { ordersService } from "../../services/orders.service";
import { clientsService } from "../../services/clients.service";
import { productsService } from "../../services/products.service";
import { ClientePublic } from "../../types/cliente.types";
import { ProdutoPublic } from "../../types/produto.types";
import { PedidoPublic, PedidoCreate } from "../../types/pedido.types";

export async function ordersListLoader() {
  const [orders, products] = await Promise.all([
    ordersService.getAll(),
    productsService.getAll()
  ]);

  return { orders, products };
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
  const formData = await request.formData();

  const orderDataRaw = formData.get("orderData") as string;
  if (!orderDataRaw) return null;

  const data = JSON.parse(orderDataRaw) as PedidoCreate;

  try {
    const newOrder = await ordersService.create(data);

    // Percorre o FormData em busca de arquivos pendentes (file_ID)
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("file_") && value instanceof File) {
        const cd_produto = Number(key.split("_")[1]);

        // Cria um FormData temporário para cada upload
        const fileFormData = new FormData();
        fileFormData.append("file", value);

        // Faz o upload de cada arte vinculando ao novo pedido
        await ordersService.uploadArt(
          newOrder.cd_pedido,
          cd_produto,
          fileFormData
        );
      }
    }

    return redirect("/pedidos");
  } catch (err) {
    console.error("Erro ao criar pedido e artes:", err);
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

// Define os handlers para cada ação específica de itens
const itemUpdateHandlers: Record<
  string,
  (id: number, payload: any) => Promise<any>
> = {
  add_item: (id, payload) => ordersService.addItem(id, payload),
  remove_item: (id, payload) =>
    ordersService.removeItem(id, payload.cd_produto),
  update_item: (id, payload) =>
    ordersService.updateItem(id, payload.cd_produto, payload),
};

export async function orderUpdateAction({
  request,
  params,
}: ActionFunctionArgs) {
  if (!params.id) throw new Error("ID inválido");
  const cd_pedido = Number(params.id);

  const data = await request.json();
  const { intent, ...payload } = data;

  try {
    // Tenta encontrar um handler para a intenção (add, remove, update item)
    const handler = itemUpdateHandlers[intent];

    if (handler) {
      await handler(cd_pedido, payload);
      return { success: true }; // Retorno para o fetcher não recarregar a página inteira
    }

    // Caso não haja intenção específica, é a atualização do cabeçalho do pedido
    await ordersService.update(cd_pedido, payload);
    return redirect("/pedidos");
  } catch (err) {
    console.error("Erro na action de pedido:", err);
    return { error: "Falha ao processar operação" };
  }
}

export async function orderUploadArtAction({ request, params }) {
  const formData = await request.formData();
  return await ordersService.uploadArt(
    Number(params.id), // 'id' vem da rota pai (:id)
    Number(params.cd_produto),
    formData
  );
}
