// Esse arquivo espelha os schemas de:
// backend/app/models/pedido.py
// backend/app/models/item_pedido.py

import { ClientePublic } from "./cliente.types";
import { ProdutoPublic } from "./produto.types";
import { PaginatedResponse } from "./common.types";

export enum StatusPedido {
  AGUARDANDO_PAGAMENTO = "Aguardando Pagamento",
  AGUARDANDO_ARTE = "Aguardando Arte",
  EM_PRODUCAO = "Em Produção",
  PRONTO_RETIRADA = "Pronto para Retirada",
  CONCLUIDO = "Concluído",
  CANCELADO = "Cancelado",
}

export interface ItemPedidoInput {
  produto_id: number;
  quantidade: number;
  observacoes?: string | null;
  caminho_arte?: string | null;
  preco_unitario?: number;
}

export interface ItemPedidoUpdate {
  quantidade?: number;
  preco_unitario?: number;
  observacoes?: string | null;
  caminho_arte?: string | null;
}

export interface ItemPedidoPublic {
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
  observacoes?: string | null;
  caminho_arte?: string | null;
  valor_total?: number;
}

export interface PedidoBase {
  data_pedido: string;
  status: StatusPedido;
  observacoes?: string | null;
  total: number;
  cliente_id: number;
}

export interface PedidoCreate {
  cliente_id: number;
  data_pedido?: string;
  status?: StatusPedido;
  observacoes?: string;
  itens: ItemPedidoInput[];
}

export interface PedidoPublic extends PedidoBase {
  id: number;
  cliente?: ClientePublic | null;
  itens: ItemPedidoPublic[]; 
  produtos: ProdutoPublic[];
}

export type PedidoPaginated = PaginatedResponse<PedidoPublic>;

export interface PedidoUpdate extends Partial<PedidoBase> {
  //
}