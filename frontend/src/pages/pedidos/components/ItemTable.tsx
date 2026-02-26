import { useState } from "react";
import { formatNumber } from "../../../utils/format.utils";
import { ItemPedidoInput, ItemPedidoPublic } from "../../../types/pedido.types";
import { ProdutoPublic } from "../../../types/produto.types";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";

import {
  Edit,
  Save,
  Cancel,
  CloudUpload,
  DeleteOutline,
} from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL;

const UploadButton = ({ onUpload, produto_id, hasArt }: any) => (
  <IconButton
    component="label"
    size="small"
    color={hasArt ? "primary" : "default"}
  >
    <CloudUpload fontSize="inherit" />
    <input
      type="file"
      hidden
      accept="image/*"
      onChange={(e) => onUpload(e.target.files?.[0], produto_id)}
    />
  </IconButton>
);

interface ItemTableProps {
  items: ItemPedidoPublic[] | ItemPedidoInput[];
  produtos?: ProdutoPublic[];
  onUpload: (file: File, produto_id: number) => void;
  onRemove: (produto_id: number) => void;
  onUpdate: (updatedItem: any) => void;
}

function ItemTable({
  items,
  produtos = [],
  onUpload,
  onRemove,
  onUpdate,
}: ItemTableProps) {
  // Estado para saber qual linha está em edição
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const startEdit = (item: any) => {
    setEditId(item.produto_id);
    setEditData({ ...item });
  };

  const saveEdit = () => {
    onUpdate(editData);
    setEditId(null);
  };

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
          {items.map((item) => {
            const isEditing = editId === item.produto_id;
            // Procura o produto se a lista existir, se não, coloca um fallback
            const nomeExibicao = item.nome_produto;
            const imgUrl = item.caminho_arte?.startsWith("blob:")
              ? item.caminho_arte
              : `${API_URL}${item.caminho_arte}`;

            return (
              <TableRow key={item.produto_id}>
                <TableCell>
                  <div className="flex flex-col">
                    <Typography variant="body2" className="font-medium">
                      {nomeExibicao}
                    </Typography>

                    {item.observacoes && (
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        className="italic bg-pink-50 px-1 rounded w-fit"
                      >
                        Obs: {item.observacoes}
                      </Typography>
                    )}
                  </div>
                </TableCell>

                <TableCell align="center">
                  {isEditing ? (
                    <TextField
                      type="number"
                      size="small"
                      variant="standard"
                      value={editData.quantidade}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          quantidade: Number(e.target.value),
                        })
                      }
                    />
                  ) : (
                    item.quantidade
                  )}
                </TableCell>

                <TableCell align="right">
                  {isEditing ? (
                    <TextField
                      type="number"
                      size="small"
                      variant="standard"
                      value={editData.preco_unitario}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          preco_unitario: Number(e.target.value),
                        })
                      }
                    />
                  ) : (
                    `R$ ${formatNumber(item.preco_unitario)}`
                  )}
                </TableCell>

                <TableCell align="right">
                  R$
                  {formatNumber(
                    (isEditing
                      ? editData.preco_unitario
                      : item.preco_unitario) *
                      (isEditing ? editData.quantidade : item.quantidade),
                  )}
                </TableCell>
                <TableCell align="center">
                  {item.caminho_arte ? (
                    <div className="flex flex-col items-center gap-1">
                      <a href={imgUrl} target="_blank" rel="noreferrer">
                        <Tooltip title="Clique para ampliar">
                          <img
                            src={imgUrl}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm border-2 border-transparent hover:border-pink-400 transition-all cursor-zoom-in"
                          />
                        </Tooltip>
                      </a>
                    </div>
                  ) : (
                    <Typography variant="caption" color="textSecondary">
                      Sem arte
                    </Typography>
                  )}
                  <UploadButton
                    onUpload={onUpload}
                    produto_id={item.produto_id}
                    hasArt={!!item.caminho_arte}
                  />
                </TableCell>

                <TableCell align="center">
                  {isEditing ? (
                    <>
                      <IconButton
                        onClick={saveEdit}
                        color="primary"
                        size="small"
                      >
                        <Save fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => setEditId(null)} size="small">
                        <Cancel fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        onClick={() => startEdit(item)}
                        size="small"
                        className="group-hover:opacity-100 transition-all !text-pink-600 hover:!bg-pink-100"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => onRemove(item.produto_id)}
                        size="small"
                        className="group-hover:opacity-100 transition-all !text-red-400 hover:!bg-red-50"
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ItemTable;
