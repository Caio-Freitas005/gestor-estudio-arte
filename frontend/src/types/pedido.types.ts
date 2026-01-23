// Esse arquivo espelha os schemas de:
// backend/app/models/pedido.py
// backend/app/models/item_pedido.py

import { ClientePublic } from "./cliente.types";

export enum StatusPedido {
  AGUARDANDO_PAGAMENTO = "Aguardando Pagamento",
  AGUARDANDO_ARTE = "Aguardando Arte",
  EM_PRODUCAO = "Em Produção",
  PRONTO_RETIRADA = "Pronto para Retirada",
  CONCLUIDO = "Concluído",
  CANCELADO = "Cancelado",
}

export interface ItemPedidoInput {
  cd_produto: number;
  qt_produto: number;
  ds_observacoes_item?: string | null;
  ds_caminho_arte?: string | null;
  vl_unitario_praticado?: number;
}

export interface ItemPedidoUpdate {
  qt_produto?: number;
  vl_unitario_praticado?: number;
  ds_observacoes_item?: string | null;
  ds_caminho_arte?: string | null;
}

export interface ItemPedidoPublic {
  cd_produto: number;
  qt_produto: number;
  vl_unitario_praticado: number;
  ds_observacoes_item?: string | null;
  ds_caminho_arte?: string | null;
  vl_total_item?: number;
}

export interface PedidoBase {
  dt_pedido: string;
  ds_status: StatusPedido;
  vl_total_pedido: number;
  cd_cliente: number;
  ds_observacoes?: string | null;
}

export interface PedidoCreate {
  cd_cliente: number;
  dt_pedido?: string;
  ds_status?: StatusPedido;
  ds_observacoes?: string;
  itens: ItemPedidoInput[];
}

export interface PedidoPublic extends PedidoBase {
  cd_pedido: number;
  cliente?: ClientePublic | null;
  itens: ItemPedidoPublic[]; 
}

export interface PedidoUpdate extends Partial<PedidoBase> {
  //
}