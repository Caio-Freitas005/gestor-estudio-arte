import {
  Box,
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

// Função auxiliar para colorir o status
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
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <Typography variant="h4">Dashboard de Pedidos</Typography>
        <Button
          component={Link}
          to="cadastrar"
          variant="contained"
          color="primary"
        >
          Novo Pedido
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabela de pedidos">
          <TableHead>
            <TableRow>
              <TableCell>#ID</TableCell>
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
                <TableCell colSpan={6} align="center">
                  Nenhum pedido encontrado. Comece criando um!
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow
                  key={order.cd_pedido}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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
                    {order.cliente?.nm_cliente || "Cliente Removido"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.ds_status}
                      color={getStatusColor(order.ds_status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    R$ {Number(order.vl_total_pedido).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      component={Link}
                      to={`/pedidos/${order.cd_pedido}`}
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
    </Box>
  );
}

export default OrdersListPage;
