import { ordersService } from "../../services/orders.service";
import { clientsService } from "../../services/clients.service";
import { StatusPedido } from "../../types/pedido.types";
import { PedidoPaginated } from "../../types/pedido.types";
import { ClientePaginated } from "../../types/cliente.types";

export async function dashboardLoader() {
  const [pedidosResp, clientesResp] = await Promise.all([
    ordersService.getAll({ limit: 1000 }),
    clientsService.getAll({ limit: 1000 }),
  ]) as [PedidoPaginated, ClientePaginated];

  const pedidos = pedidosResp.dados;
  const clientes = clientesResp.dados;

  const mesAtual = new Date().getMonth() + 1;

  // Filtra aniversariantes do mês
  const aniversariantes = clientes.filter((cliente) => {
    if (!cliente.data_nascimento) return false;
    // Assume que a data vem no formato YYYY-MM-DD ou similar
    const mesNascimento = new Date(cliente.data_nascimento).getUTCMonth() + 1;
    return mesNascimento === mesAtual;
  });

  // Cálculo de faturamento (apenas pedidos concluídos ou em fluxo positivo)
  const faturamentoTotal = pedidos
    .filter(
      (p) =>
        p.status !== StatusPedido.CANCELADO &&
        p.status !== StatusPedido.AGUARDANDO_PAGAMENTO &&
        p.status !== StatusPedido.AGUARDANDO_ARTE
    ).reduce((acc, p) => acc + Number(p.total), 0);

  const stats = {
    totalGeral: pedidos.length, // Total histórico
    faturamento: faturamentoTotal,

    totalAtivos: pedidos.filter(
      (p) =>
        p.status !== StatusPedido.CONCLUIDO &&
        p.status !== StatusPedido.CANCELADO
    ).length,

    cancelados: pedidos.filter(
        (p) => p.status === StatusPedido.CANCELADO
    ).length,
      
    
    aguardandoPagamento: pedidos.filter(
      (p) => p.status === StatusPedido.AGUARDANDO_PAGAMENTO
    ).length,

    emProducao: pedidos.filter(
        (p) => p.status === StatusPedido.EM_PRODUCAO
    ).length,

    pronto: pedidos.filter(
        (p) => p.status === StatusPedido.PRONTO_RETIRADA
    ).length,

    concluidos: pedidos.filter(
        (p) => p.status === StatusPedido.CONCLUIDO
    ).length,

    aguardandoArte: pedidos.filter(
      (p) => p.status === StatusPedido.AGUARDANDO_ARTE
    ).length,
  };

  // Pega os 5 últimos pedidos, ordenados por ID (assumindo que ID maior é mais recente)
  const pedidosRecentes = [...pedidos].sort((a, b) => b.id - a.id).slice(0, 5);

  return { stats, pedidosRecentes, aniversariantes };
}
