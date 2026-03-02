import { Link } from "react-router";
import { formatPhone, formatDate } from "@/utils/format.utils";
import { ClientePublic } from "@/types/cliente.types";

import { TableRow, TableCell, IconButton, Tooltip } from "@mui/material";
import {
  Edit,
  WhatsApp,
  Email,
  PersonOutline,
  DeleteOutline,
} from "@mui/icons-material";

interface ClientTableRowProps {
  cliente: ClientePublic;
  onDelete: (id: number) => void;
}

function ClientTableRow({ cliente, onDelete }: ClientTableRowProps) {
  return (
    <TableRow className="hover:bg-pink-50/10 transition-colors group border-b border-gray-50">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-pink-100 group-hover:text-pink-500 transition-colors">
            <PersonOutline fontSize="small" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 leading-tight">
              {cliente.nome}
            </span>
            <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">
              ID #{cliente.id}
            </span>
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex flex-col gap-1">
          {cliente.telefone && (
            <div className="flex items-center text-sm text-gray-600 font-medium">
              <WhatsApp fontSize="inherit" className="me-2 text-green-500" />
              {formatPhone(cliente.telefone)}
            </div>
          )}
          {cliente.email && (
            <div className="flex items-center text-sm text-gray-600 italic">
              <Email fontSize="inherit" className="me-2 text-pink-400" />
              {cliente.email}
            </div>
          )}
        </div>
      </TableCell>
      
      <TableCell className="text-gray-600 font-medium text-sm">
        {cliente.data_nascimento ? formatDate(cliente.data_nascimento) : "-"}
      </TableCell>
      
      <TableCell className="text-gray-600 font-medium !whitespace-pre-wrap !break-words text-sm">
        {cliente.observacoes}
      </TableCell>
      
      <TableCell align="center">
        <div className="flex justify-center gap-1">
          <Tooltip title="Editar">
            <IconButton
              component={Link}
              to={`${cliente.id}`}
              size="small"
              className="opacity-0 group-hover:opacity-100 transition-all !text-pink-600 hover:!bg-pink-100"
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              size="small"
              className="opacity-0 group-hover:opacity-100 transition-all !text-red-400 hover:!bg-red-50"
              onClick={() => onDelete(cliente.id)}
            >
              <DeleteOutline fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default ClientTableRow;