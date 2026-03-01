import { useState } from "react";
import { formatNumber } from "@/utils/format.utils";
import { ItemPedidoInput, ItemPedidoPublic } from "@/types/pedido.types";
import { ProdutoPublic } from "@/types/produto.types";
import NumberInput from "./NumberInput";
import CurrencyInput from "./CurrencyInput";

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
      onClick={(e) => ((e.target as HTMLInputElement).value = "")} // Para limpar
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

function ItemTable({ items, onUpload, onRemove, onUpdate }: ItemTableProps) {
  // Estado para saber qual linha está em edição
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const startEdit = (item: any) => {
    setEditId(item.produto_id);
    setEditData({ ...item });
  };

  const saveEdit = () => {
    // Garante que os dados voltem como número após a edição visual
    onUpdate({
      ...editData,
      quantidade: Number(editData.quantidade) || 1,
      preco_unitario: Number(editData.preco_unitario) || 0,
    });
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

          {items.map((item) => {
            const isEditing = editId === item.produto_id;
            const nomeItem = item.nome_produto;
            const imgUrl = item.caminho_arte?.startsWith("blob:")
              ? item.caminho_arte
              : `${API_URL}${item.caminho_arte}`;

            return (
              <TableRow key={item.produto_id}>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Typography variant="body2" className="font-medium">
                      {nomeItem}
                    </Typography>

                    {isEditing ? (
                      <TextField
                        size="small"
                        variant="standard"
                        placeholder="Observação"
                        value={editData.observacoes || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            observacoes: e.target.value,
                          })
                        }
                        onKeyUp={(e) => {
                          if (e.key === "Enter") saveEdit();
                        }}
                        fullWidth
                      />
                    ) : (
                      item.observacoes && (
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          className="italic bg-pink-50 px-1 rounded w-fit"
                        >
                          Obs: {item.observacoes}
                        </Typography>
                      )
                    )}
                  </div>
                </TableCell>

                <TableCell align="center">
                  {isEditing ? (
                    <NumberInput
                      size="small"
                      variant="standard"
                      value={editData.quantidade}
                      onChangeValue={(val) =>
                        setEditData({ ...editData, quantidade: val })
                      }
                      onEnter={saveEdit}
                    />
                  ) : (
                    item.quantidade
                  )}
                </TableCell>

                <TableCell align="right">
                  {isEditing ? (
                    <CurrencyInput
                      size="small"
                      variant="standard"
                      value={editData.preco_unitario}
                      onChangeValue={(val) =>
                        setEditData({ ...editData, preco_unitario: val })
                      }
                      onEnter={saveEdit}
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
                            loading="lazy"
                            decoding="async"
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
                      <Tooltip title="Salvar Edição">
                        <IconButton
                          onClick={saveEdit}
                          color="primary"
                          size="small"
                        >
                          <Save fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Cancelar Edição">
                        <IconButton
                          onClick={() => setEditId(null)}
                          size="small"
                        >
                          <Cancel fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={() => startEdit(item)}
                          size="small"
                          className="group-hover:opacity-100 transition-all !text-pink-600 hover:!bg-pink-100"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* Desativa a lixeira se for o único item */}
                      <Tooltip
                        title={
                          items.length === 1
                            ? "O pedido não pode ficar vazio"
                            : "Excluir"
                        }
                      >
                        <span>
                          {/* O span é necessário para o Tooltip funcionar num botão disabled */}
                          <IconButton
                            onClick={() => onRemove(item.produto_id)}
                            size="small"
                            disabled={items.length === 1}
                            className={`transition-all ${
                              items.length === 1
                                ? "opacity-30"
                                : " group-hover:opacity-100 !text-red-400 hover:!bg-red-50"
                            }`}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
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
