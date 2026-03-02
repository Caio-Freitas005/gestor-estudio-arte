import { Link } from "react-router";
import { formatNumber } from "@/utils/format.utils";
import { ProdutoPublic } from "@/types/produto.types";

import { TableRow, TableCell, IconButton, Tooltip, Chip } from "@mui/material";
import { Edit, SellOutlined, DeleteOutline } from "@mui/icons-material";

interface ProductTableRowProps {
  produto: ProdutoPublic;
  onDelete: (id: number) => void;
}

function ProductTableRow({ produto, onDelete }: ProductTableRowProps) {
  return (
    <TableRow className="hover:bg-pink-50/10 transition-colors group border-b border-gray-50">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-pink-50 rounded-xl text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-all shadow-sm shadow-pink-50">
            <SellOutlined fontSize="small" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 leading-tight">
              {produto.nome}
            </span>
            <span className="text-[10px] text-gray-400 italic">
              {produto.descricao || "Sem descrição"}
            </span>
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <Chip
          label={produto.unidade_medida || "UN"}
          size="small"
          className="!bg-gray-100 !text-gray-600 !font-black !text-[9px] !rounded-md"
        />
      </TableCell>
      
      <TableCell align="right">
        <span className="font-mono font-bold text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-50 text-sm">
          R$ {formatNumber(produto.preco_base)}
        </span>
      </TableCell>
      
      <TableCell align="center">
        <div className="flex justify-center gap-1">
          <Tooltip title="Editar">
            <IconButton
              component={Link}
              to={`${produto.id}`}
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
              onClick={() => onDelete(produto.id)}
            >
              <DeleteOutline fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default ProductTableRow;