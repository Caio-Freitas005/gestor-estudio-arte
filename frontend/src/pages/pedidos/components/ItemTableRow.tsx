import { useState } from "react";
import { formatNumber } from "@/utils/format.utils";
import { ItemPedidoInput, ItemPedidoPublic } from "@/types/pedido.types";
import NumberInput from "./NumberInput";
import CurrencyInput from "./CurrencyInput";

import {
  TableRow,
  TableCell,
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

// O UploadButton foi movido para dentro da Row para manter a lógica de arte encapsulada por item
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

interface ItemTableRowProps {
  item: ItemPedidoPublic | ItemPedidoInput;
  isOnlyItem: boolean; // Recebe se é o único item para gerir a lixeira
  onUpload: (file: File, produto_id: number) => void;
  onRemove: (produto_id: number) => void;
  onUpdate: (updatedItem: any) => void;
}

function ItemTableRow({
  item,
  isOnlyItem,
  onUpload,
  onRemove,
  onUpdate,
}: ItemTableRowProps) {
  // Estado para saber se essa linha específica está em edição.
  // Isso remove a necessidade do editId no componente Pai.
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const startEdit = () => {
    setEditData({ ...item });
    setIsEditing(true);
  };

  const saveEdit = () => {
    // Garante que os dados voltem como número após a edição visual
    onUpdate({
      ...editData,
      quantidade: Number(editData.quantidade) || 1,
      preco_unitario: Number(editData.preco_unitario) || 0,
    });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditData(null);
    setIsEditing(false);
  };

  const nomeItem = item.nome_produto;
  const imgUrl = item.caminho_arte?.startsWith("blob:")
    ? item.caminho_arte
    : `${API_URL}${item.caminho_arte}`;

  return (
    <TableRow>
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
          (isEditing ? editData.preco_unitario : item.preco_unitario) *
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
              <IconButton onClick={saveEdit} color="primary" size="small">
                <Save fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Cancelar Edição">
              <IconButton onClick={cancelEdit} size="small">
                <Cancel fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip title="Editar">
              <IconButton
                onClick={startEdit}
                size="small"
                className="group-hover:opacity-100 transition-all !text-pink-600 hover:!bg-pink-100"
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Lógica de trava da lixeira agora depende da prop isOnlyItem */}
            <Tooltip
              title={isOnlyItem ? "O pedido não pode ficar vazio" : "Excluir"}
            >
              <span>
                {/* O span é necessário para o Tooltip funcionar num botão disabled */}
                <IconButton
                  onClick={() => onRemove(item.produto_id)}
                  size="small"
                  disabled={isOnlyItem}
                  className={`transition-all ${
                    isOnlyItem
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
}

export default ItemTableRow;
