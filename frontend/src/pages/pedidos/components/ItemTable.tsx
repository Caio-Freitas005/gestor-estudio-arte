import { useState } from "react";
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

const UploadButton = ({ onUpload, cd_produto, hasArt }: any) => (
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
      onChange={(e) => onUpload(e.target.files?.[0], cd_produto)}
    />
  </IconButton>
);

function ItemTable({ items, produtos, onUpload, onRemove, onUpdate }: any) {
  // Estado para saber qual linha está em edição
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const startEdit = (item: any) => {
    setEditId(item.cd_produto);
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
          {items.map((item: any) => {
            const isEditing = editId === item.cd_produto;
            const produto = produtos?.find(
              (p: any) => p.cd_produto === item.cd_produto
            );

            return (
              <TableRow key={item.cd_produto}>
                <TableCell>
                  <div className="flex flex-col">
                    <Typography variant="body2" className="font-medium">
                      {produto?.nm_produto}
                    </Typography>

                    {item.ds_observacoes_item && (
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        className="italic bg-pink-50 px-1 rounded w-fit"
                      >
                        Obs: {item.ds_observacoes_item}
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
                      value={editData.qt_produto}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          qt_produto: Number(e.target.value),
                        })
                      }
                    />
                  ) : (
                    item.qt_produto
                  )}
                </TableCell>

                <TableCell align="right">
                  {isEditing ? (
                    <TextField
                      type="number"
                      size="small"
                      variant="standard"
                      value={editData.vl_unitario_praticado}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          vl_unitario_praticado: Number(e.target.value),
                        })
                      }
                    />
                  ) : (
                    `R$ ${Number(item.vl_unitario_praticado).toFixed(2)}`
                  )}
                </TableCell>

                <TableCell align="right">
                  R$
                  {(
                    (isEditing
                      ? editData.vl_unitario_praticado
                      : item.vl_unitario_praticado) *
                    (isEditing ? editData.qt_produto : item.qt_produto)
                  ).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  {item.ds_caminho_arte ? (
                    <div className="flex flex-col items-center gap-1">
                      <a
                        href={
                          item.ds_caminho_arte.startsWith("blob:")
                            ? item.ds_caminho_arte
                            : `${API_URL}${item.ds_caminho_arte}`
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Tooltip title="Clique para ampliar">
                          <img
                            src={
                              item.ds_caminho_arte.startsWith("blob:")
                                ? item.ds_caminho_arte
                                : `${API_URL}${item.ds_caminho_arte}`
                            }
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
                    cd_produto={item.cd_produto}
                    hasArt={!!item.ds_caminho_arte}
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
                        onClick={() => onRemove(item.cd_produto)}
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
