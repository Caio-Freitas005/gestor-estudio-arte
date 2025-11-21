// Esse arquivo espelha os schemas de:
// backend/app/models/pedido.py

import { ClientePublic } from "./cliente.types";

// Espelha o Enum do back
export enum StatusPedido {
  AGUARDANDO_PAGAMENTO = "Aguardando Pagamento",
  AGUARDANDO_ARTE = "Aguardando Arte",
  EM_PRODUCAO = "Em Produção",
  PRONTO_RETIRADA = "Pronto para Retirada",
  CONCLUIDO = "Concluído",
  CANCELADO = "Cancelado",
}

export interface PedidoBase {
  dt_pedido: string; 
  ds_status: StatusPedido;
  vl_total_pedido: number;
  cd_cliente: number;
}

export interface PedidoCreate {
  dt_pedido: string;
  ds_status: StatusPedido;
  // vl_total_pedido é omitido na criação (back assume 0)
  cd_cliente: number;
}

export interface PedidoPublic extends PedidoBase {
  cd_pedido: number;
  cliente?: ClientePublic | null; 
}

export interface PedidoUpdate extends Partial<PedidoBase> {
  // 
}