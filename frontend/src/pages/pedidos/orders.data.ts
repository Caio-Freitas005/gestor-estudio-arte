import { LoaderFunctionArgs, ActionFunctionArgs, redirect } from "react-router";
import { ordersService } from "../../services/orders.service";
import { clientsService } from "../../services/clients.service";
import { productsService } from "../../services/products.service";
import { ClientePublic } from "../../types/cliente.types";
import { ProdutoPublic } from "../../types/produto.types";
import { PedidoPublic, PedidoCreate } from "../../types/pedido.types";
import { getCommonParams } from "../../utils/loader.utils";
import { FILE_UPLOAD_PREFIX } from "../../utils/constants";

export async function ordersListLoader({ request }: LoaderFunctionArgs) {
  const params = getCommonParams(request, [
    "status",
    "data_pedido",
    "data_conclusao",
    "min_total",
    "max_total",
  ]);

  const [pedidos, produtos] = await Promise.all([
    ordersService.getAll(params), // O objeto 'params' já tem q, status, skip, limit, etc.
    productsService.getAll(),
  ]);

  // Retorna 'pedidos' como objeto (para a tabela) e 'produtos' como array (para filtros/modais)
  return {
    pedidos,
    produtos: produtos.dados,
  };
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

  return {
    clientes: clientes.dados,
    produtos: produtos.dados,
  };
}

export async function orderCreateAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const orderDataRaw = formData.get("orderData") as string;
  if (!orderDataRaw) return null;

  const data = JSON.parse(orderDataRaw) as PedidoCreate;

  try {
    const newOrder = await ordersService.create(data);

    // Percorre o FormData em busca de arquivos pendentes (Prefixo_ID)
    for (const [key, value] of formData.entries()) {
      if (key.startsWith(FILE_UPLOAD_PREFIX) && value instanceof File) {
        // Extrai apenas o id, retirando o prefixo por completo
        const produto_id = Number(key.substring(FILE_UPLOAD_PREFIX.length));

        // Cria um FormData temporário para cada upload
        const fileFormData = new FormData();
        fileFormData.append("file", value);

        // Faz o upload de cada arte vinculando ao novo pedido
        await ordersService.uploadArt(newOrder.id, produto_id, fileFormData);
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
    ordersService.getById(Number(params.id)),
    clientsService.getAll(),
    productsService.getAll(),
  ]);

  return {
    pedido,
    clientes: clientes.dados,
    produtos: produtos.dados,
  };
}

// Define os handlers para cada ação específica de itens
const itemUpdateHandlers: Record<
  string,
  (id: number, payload: any) => Promise<any>
> = {
  add_item: (id, payload) => ordersService.addItem(id, payload),
  remove_item: (id, payload) =>
    ordersService.removeItem(id, payload.produto_id),
  update_item: (id, payload) =>
    ordersService.updateItem(id, payload.produto_id, payload),
};

export async function orderUpdateAction({
  request,
  params,
}: ActionFunctionArgs) {
  if (!params.id) throw new Error("ID inválido");
  const id = Number(params.id);

  const data = await request.json();
  const { intent, ...payload } = data;

  try {
    // Tenta encontrar um handler para a intenção (add, remove, update item)
    const handler = itemUpdateHandlers[intent];

    if (handler) {
      await handler(id, payload);
      return { success: true }; // Retorno para o fetcher não recarregar a página inteira
    }

    // Caso não haja intenção específica, é a atualização do cabeçalho do pedido
    await ordersService.update(id, payload);
    return redirect("/pedidos");
  } catch (err) {
    console.error("Erro na action de pedido:", err);
    return { error: "Falha ao processar operação" };
  }
}

export async function orderUploadArtAction({
  request,
  params,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  return await ordersService.uploadArt(
    Number(params.id), // 'id' vem da rota pai (:id)
    Number(params.produto_id),
    formData,
  );
}
