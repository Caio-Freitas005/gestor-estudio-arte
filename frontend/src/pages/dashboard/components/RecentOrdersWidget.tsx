import { Link } from "react-router";
import { formatNumber } from "@/utils/format.utils";
import { statusStyles } from "@/utils/constants";
import { PedidoPublic } from "@/types/pedido.types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Button,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

import FormSection from "@/components/FormSection";

interface RecentOrdersWidgetProps {
  pedidos: PedidoPublic[];
}

function RecentOrdersWidget({ pedidos }: RecentOrdersWidgetProps) {
  return (
    <FormSection title="Atividade Recente">
      <div className="overflow-x-auto">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className="!font-bold !text-gray-400 !text-[10px] !uppercase">
                ID
              </TableCell>
              <TableCell className="!font-bold !text-gray-400 !text-[10px] !uppercase">
                Cliente
              </TableCell>
              <TableCell className="!font-bold !text-gray-400 !text-[10px] !uppercase">
                Status
              </TableCell>
              <TableCell
                align="right"
                className="!font-bold !text-gray-400 !text-[10px] !uppercase"
              >
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow
                key={pedido.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <TableCell className="!font-bold !text-gray-700">
                  #{pedido.id}
                </TableCell>
                <TableCell className="!text-sm">
                  {pedido.cliente?.nome || "Final Consumidor"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={pedido.status}
                    size="small"
                    className={`${
                      statusStyles[pedido.status]
                    } !text-[8px] !font-black !uppercase !h-5`}
                  />
                </TableCell>
                <TableCell
                  align="right"
                  className="!font-mono !font-bold !text-sm"
                >
                  R$ {formatNumber(pedido.total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button
        component={Link}
        to="/pedidos"
        fullWidth
        variant="text"
        className="!mt-4 !text-pink-500 !font-bold"
        endIcon={<ArrowForward />}
      >
        Ver todos os pedidos
      </Button>
    </FormSection>
  );
}

export default RecentOrdersWidget;