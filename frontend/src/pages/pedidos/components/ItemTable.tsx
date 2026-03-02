import { ItemPedidoInput, ItemPedidoPublic } from "@/types/pedido.types";
import { ProdutoPublic } from "@/types/produto.types";
import ItemTableRow from "./ItemTableRow";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface ItemTableProps {
  items: ItemPedidoPublic[] | ItemPedidoInput[];
  produtos?: ProdutoPublic[];
  onUpload: (file: File, produto_id: number) => void;
  onRemove: (produto_id: number) => void;
  onUpdate: (updatedItem: any) => void;
}

function ItemTable({ items, onUpload, onRemove, onUpdate }: ItemTableProps) {
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      style={{ maxWidth: "1050px" }}
    >
      <Table size="small">
        <TableHead className="bg-gray-50">
          <TableRow>
            <TableCell>Produto</TableCell>
            <TableCell align="center" width="100">
              Qtd
            </TableCell>
            <TableCell align="right" width="120">
              Unitário
            </TableCell>
            <TableCell align="right">Subtotal</TableCell>
            <TableCell align="center">Arte</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/*Estado vazio*/}
          {items.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                align="center"
                className="py-12 text-gray-400 italic"
              >
                Nenhum produto adicionado ao pedido ainda.
              </TableCell>
            </TableRow>
          )}

          {/* O .map agora apenas renderiza o componente ItemTableRow, 
          passando a responsabilidade de edição para cada linha individualmente. */}
          {items.map((item) => (
            <ItemTableRow
              key={item.produto_id}
              item={item}
              isOnlyItem={items.length === 1}
              onUpload={onUpload}
              onRemove={onRemove}
              onUpdate={onUpdate}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ItemTable;
