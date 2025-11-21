import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { useLoaderData, Link } from "react-router";
import { PedidoPublic, StatusPedido } from "../../types/pedido.types";

function getStatusColor(status: StatusPedido) {
  switch (status) {
    case StatusPedido.CONCLUIDO:
      return "success";
    case StatusPedido.CANCELADO:
      return "error";
    case StatusPedido.EM_PRODUCAO:
      return "warning";
    case StatusPedido.PRONTO_RETIRADA:
      return "info";
    default:
      return "default";
  }
}

function OrdersListPage() {
  const orders = useLoaderData() as PedidoPublic[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" component="h1" className="text-white-800">
          Dashboard de Pedidos
        </Typography>
        <Button
          component={Link}
          to="cadastrar"
          variant="contained"
          color="primary"
          disableElevation
        >
          Novo Pedido
        </Button>
      </div>

      <TableContainer
        component={Paper}
        className="shadow-sm border border-gray-200"
      >
        <Table sx={{ minWidth: 650 }} aria-label="tabela de pedidos">
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="font-bold">#ID</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Valor Total</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  className="py-8 text-gray-500"
                >
                  Nenhum pedido encontrado. Comece criando um!
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow
                  key={order.cd_pedido}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell component="th" scope="row">
                    {order.cd_pedido}
                  </TableCell>
                  <TableCell>
                    {new Date(order.dt_pedido).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                  </TableCell>
                  <TableCell>
                    {order.cliente?.nm_cliente || (
                      <span className="text-red-400">Cliente Removido</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.ds_status}
                      color={getStatusColor(order.ds_status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right" className="font-mono">
                    R$ {Number(order.vl_total_pedido).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      component={Link}
                      to={`/pedidos/${order.cd_pedido}`}
                      variant="outlined"
                    >
                      Ver Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default OrdersListPage;
