import { useState } from "react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import { PedidoPaginated, PedidoPublic } from "@/types/pedido.types";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Drawer,
} from "@mui/material";

import PageHeader from "@/components/PageHeader";
import OrderDetails from "./components/OrderDetails";
import OrderTableRow from "./components/OrderTableRow";
import StatusFilter from "./components/StatusFilter";
import RangeFilter from "@/components/RangeFilter";
import Searchbar from "@/components/Searchbar";
import AppPagination from "@/components/AppPagination";
import DateFilter from "./components/DateFilter";

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
                  colSpan={7}
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
                <OrderTableRow
                  key={pedido.id}
                  pedido={pedido}
                  onOpenDetails={handleOpenDetails}
                />
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
