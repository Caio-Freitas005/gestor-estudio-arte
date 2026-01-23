import { createCrudService } from "./factory";
import { apiBase } from "./apiBase"; 
import { 
  PedidoPublic, 
  PedidoCreate, 
  PedidoUpdate, 
  ItemPedidoInput, 
  ItemPedidoUpdate 
} from "../types/pedido.types";

const basePath = "pedidos";

export const ordersService = {
  ...createCrudService<PedidoPublic, PedidoCreate, PedidoUpdate>(basePath),

  addItem: async (cd_pedido: number, item: ItemPedidoInput) => {
    const response = await apiBase.post(`${basePath}/${cd_pedido}/itens`, item);
    return response.data;
  },

  updateItem: async (cd_pedido: number, cd_produto: number, item: ItemPedidoUpdate) => {
    const response = await apiBase.patch(`${basePath}/${cd_pedido}/itens/${cd_produto}`, item);
    return response.data;
  },

  removeItem: async (cd_pedido: number, cd_produto: number) => {
    const response = await apiBase.delete(`${basePath}/${cd_pedido}/itens/${cd_produto}`);
    return response.data;
  },

  uploadArt: async (cd_pedido: number, cd_produto: number, formData: FormData) => {
    const response = await apiBase.post(
      `${basePath}/${cd_pedido}/itens/${cd_produto}/upload-arte`,
      formData,
    );
    return response.data;
  }

};