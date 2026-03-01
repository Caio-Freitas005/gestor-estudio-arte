import { ClientePublic } from "./cliente.types";
import { PedidoPublic } from "./pedido.types";

export interface DashboardData {
  status: {
    faturamento: number;
    totalAtivos: number;
    emProducao: number;
    concluidos: number;
    cancelados: number;
    aguardandoPagamento: number;
    aguardandoArte: number;
    pronto: number;
  };
  pedidosRecentes: PedidoPublic[];
  aniversariantes: ClientePublic[];
}
