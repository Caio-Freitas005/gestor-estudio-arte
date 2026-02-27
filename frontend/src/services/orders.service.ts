import { createCrudService } from "./factory";
import { apiBase } from "./apiBase";
import {
  PedidoPublic,
  PedidoCreate,
  PedidoUpdate,
  ItemPedidoInput,
  ItemPedidoUpdate,
} from "../types/pedido.types";

const basePath = "pedidos";

export const ordersService = {
  ...createCrudService<PedidoPublic, PedidoCreate, PedidoUpdate>(basePath),

  addItem: async (pedido_id: number, item: ItemPedidoInput) => {
    const response = await apiBase.post(`${basePath}/${pedido_id}/itens`, item);
    return response;
  },

  updateItem: async (
    pedido_id: number,
    produto_id: number,
    item: ItemPedidoUpdate,
  ) => {
    const response = await apiBase.patch(
      `${basePath}/${pedido_id}/itens/${produto_id}`,
      item,
    );
    return response;
  },

  removeItem: async (pedido_id: number, produto_id: number) => {
    const response = await apiBase.delete(
      `${basePath}/${pedido_id}/itens/${produto_id}`,
    );
    return response;
  },

  uploadArt: async (
    pedido_id: number,
    produto_id: number,
    formData: FormData,
  ) => {
    const response = await apiBase.post(
      `${basePath}/${pedido_id}/itens/${produto_id}/upload-arte`,
      formData,
    );
    return response;
  },
};
