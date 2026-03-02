import { StatusPedido } from "../types/pedido.types";

export const FILE_UPLOAD_PREFIX = "file_";

export const statusStyles: Record<string, string> = {
  [StatusPedido.AGUARDANDO_PAGAMENTO]:
    "!bg-amber-50 !text-amber-700 !border-amber-100",
  [StatusPedido.AGUARDANDO_ARTE]: "!bg-pink-50 !text-pink-700 !border-pink-200",
  [StatusPedido.EM_PRODUCAO]: "!bg-blue-50 !text-blue-700 !border-blue-100",
  [StatusPedido.PRONTO_RETIRADA]:
    "!bg-purple-50 !text-purple-700 !border-purple-100",
  [StatusPedido.CONCLUIDO]:
    "!bg-emerald-50 !text-emerald-700 !border-emerald-100",
  [StatusPedido.CANCELADO]: "!bg-red-100 !text-red-500 !border-red-200",
};
