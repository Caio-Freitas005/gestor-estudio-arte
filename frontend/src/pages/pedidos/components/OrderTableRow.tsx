import { Link } from "react-router";
import { formatDate, formatNumber } from "@/utils/format.utils";
import { PedidoPublic } from "@/types/pedido.types";
import { statusStyles } from "@/utils/constants";
import { TableRow, TableCell, Chip, IconButton, Tooltip } from "@mui/material";
import { Edit, ReceiptLong, VisibilityOutlined } from "@mui/icons-material";

interface OrderTableRowProps {
  pedido: PedidoPublic;
  onOpenDetails: (pedido: PedidoPublic) => void;
}

function OrderTableRow({ pedido, onOpenDetails }: OrderTableRowProps) {
  return (
    <TableRow className="hover:bg-pink-50/10 transition-colors group border-b border-gray-50">
      <TableCell>
        <div className="flex items-center gap-2">
          <ReceiptLong
            className="text-gray-300 group-hover:text-pink-400 transition-colors"
            fontSize="small"
          />
          <span className="font-bold text-gray-700">#{pedido.id}</span>
        </div>
      </TableCell>

      <TableCell className="text-gray-600 font-medium text-sm">
        {formatDate(pedido.data_pedido)}
      </TableCell>

      <TableCell className="text-gray-600 font-medium text-sm">
        {pedido.data_conclusao ? formatDate(pedido.data_conclusao) : "-"}
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
            onClick={() => onOpenDetails(pedido)}
            size="small"
            className="opacity-0 group-hover:opacity-100 transition-all !text-blue-600 hover:!bg-pink-100"
          >
            <VisibilityOutlined />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

export default OrderTableRow;
