import { VisibilityOutlined } from "@mui/icons-material";
import { useState } from "react";
import {
  useLoaderData,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router";
import { Edit, ReceiptLong } from "@mui/icons-material";
import { formatDate, formatNumber } from "../../utils/format.utils";

import {
  PedidoPaginated,
  PedidoPublic,
  StatusPedido,
} from "../../types/pedido.types";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Drawer,
} from "@mui/material";

import PageHeader from "../../components/PageHeader";
import OrderDetails from "./components/OrderDetails";
import StatusFilter from "./components/StatusFilter";
import RangeFilter from "../../components/RangeFilter";
import Searchbar from "../../components/Searchbar";
import AppPagination from "../../components/AppPagination";
import DateFilter from "./components/DateFilter";

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

function OrdersListPage() {
  const { pedidos } = useLoaderData() as {
    pedidos: PedidoPaginated;
  };

  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<PedidoPublic | null>(null);

  const handleOpenDetails = (pedido: PedidoPublic) => {
    setSelectedOrder(pedido);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const [searchParams] = useSearchParams();
  const hasFilter =
    searchParams.get("q") ||
    searchParams.get("data_pedido") ||
    searchParams.get("data_conclusao") ||
    searchParams.get("min_total") ||
    searchParams.get("max_total");

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <PageHeader
        title="Gestão de"
        highlight="Pedidos"
        subtitle="Fluxo de Produção"
        buttonLabel="Novo Pedido"
        buttonTo="cadastrar"
      ></PageHeader>

      <Searchbar placeholder="Buscar por cliente ou observação">
        <DateFilter label="Pedido" param="data_pedido" />
        <DateFilter label="Conclusão" param="data_conclusao" />
        <StatusFilter />
        <RangeFilter label="Total" paramMin="min_total" paramMax="max_total" />
      </Searchbar>

      <TableContainer className="!border-none !shadow-none overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <Table sx={{ minWidth: 650 }}>
          <TableHead className="bg-gray-50/50">
            <TableRow>
              <TableCell className="!font-bold text-gray-400 !text-[10px] !uppercase !tracking-wider">
                ID
              </TableCell>
              <TableCell className="!font-bold text-gray-400 !text-[10px] !uppercase !tracking-wider">
                Data
              </TableCell>
              <TableCell className="!font-bold text-gray-400 !text-[10px] !uppercase !tracking-wider">
                Data de Conclusão
              </TableCell>
              <TableCell className="!font-bold text-gray-400 !text-[10px] !uppercase !tracking-wider">
                Cliente
              </TableCell>
              <TableCell className="!font-bold text-gray-400 !text-[10px] !uppercase !tracking-wider">
                Status
              </TableCell>
              <TableCell
                align="right"
                className="!font-bold text-gray-400 !text-[10px] !uppercase !tracking-wider"
              >
                Total
              </TableCell>
              <TableCell
                align="center"
                className="!font-bold text-gray-400 !text-[10px] !uppercase !tracking-wider"
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.dados.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  className="py-20 text-gray-400 italic"
                >
                  {hasFilter
                    ? "Nenhum resultado encontrado para esta busca."
                    : "Nenhum pedido em aberto. Cadastre algum pedido."}
                </TableCell>
              </TableRow>
            ) : (
              pedidos.dados.map((pedido) => (
                <TableRow
                  key={pedido.id}
                  className="hover:bg-pink-50/10 transition-colors group border-b border-gray-50"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ReceiptLong
                        className="text-gray-300 group-hover:text-pink-400 transition-colors"
                        fontSize="small"
                      />
                      <span className="font-bold text-gray-700">
                        #{pedido.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 font-medium text-sm">
                    {formatDate(pedido.data_pedido)}
                  </TableCell>
                  <TableCell className="text-gray-600 font-medium text-sm">
                    {pedido.data_conclusao
                      ? formatDate(pedido.data_conclusao)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-gray-800">
                      {pedido.cliente?.nome || (
                        <span className="text-red-300">Não identificado</span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={pedido.status}
                      variant="outlined"
                      size="small"
                      className={`${
                        statusStyles[pedido.status] || "!bg-gray-50"
                      } !font-black !border !text-[9px] !uppercase !tracking-widest !rounded-md`}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <span className="font-mono font-bold text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-100 text-sm">
                      R$ {formatNumber(pedido.total)}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar Pedido">
                      <IconButton
                        component={Link}
                        to={`/pedidos/${pedido.id}`}
                        size="small"
                        className="opacity-0 group-hover:opacity-100 transition-all !text-pink-600 hover:!bg-pink-100"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ver Detalhes">
                      <IconButton
                        onClick={() => handleOpenDetails(pedido)}
                        size="small"
                        className="opacity-0 group-hover:opacity-100 transition-all !text-blue-600 hover:!bg-pink-100"
                      >
                        <VisibilityOutlined />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <AppPagination total={pedidos.total} />
      </TableContainer>
      <Drawer
        anchor="right"
        open={Boolean(selectedOrder)}
        onClose={handleCloseDetails}
        slotProps={{
          paper: {
            className:
              "!w-full sm:!w-[500px] sm:!rounded-l-2xl !bg-[#FDF2F8] !shadow-2xl !overflow-x-hidden",
          },
        }}
      >
        {selectedOrder && (
          <OrderDetails
            pedido={selectedOrder}
            onClose={handleCloseDetails}
            onEdit={(id) => navigate(`${id}`)}
          />
        )}
      </Drawer>
    </div>
  );
}

export default OrdersListPage;
