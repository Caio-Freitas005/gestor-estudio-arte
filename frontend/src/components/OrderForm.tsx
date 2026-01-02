import { useState, useEffect } from "react";
import { Form, useNavigation, useSubmit, useFetcher } from "react-router";
import {
  Button,
  TextField,
  Typography,
  MenuItem,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";

import {
  PedidoPublic,
  StatusPedido,
  ItemPedidoInput,
} from "../types/pedido.types";
import { ClientePublic } from "../types/cliente.types";
import { ProdutoPublic } from "../types/produto.types";

interface OrderFormProps {
  defaultValues?: PedidoPublic;
  clientes: ClientePublic[];
  produtos: ProdutoPublic[];
}

// Interface para controlar a edição de uma linha completa
interface EditingRowState {
  qt_produto: number;
  vl_unitario_praticado: number;
  ds_observacoes_item: string;
}

function OrderForm({ defaultValues, clientes, produtos }: OrderFormProps) {
  const navigation = useNavigation();
  const submit = useSubmit();
  const fetcher = useFetcher(); // Usado para ações parciais (add/remove item) ao editar

  const isSubmitting =
    navigation.state === "submitting" || fetcher.state !== "idle";
  const isEditing = !!defaultValues?.cd_pedido; // Flag para saber se é Edição

  // --- ESTADOS ---
  // Lista de itens: Ao editar, usa defaultValues (que vem do servidor).
  // Ao criar, usa o estado local.
  const [localItems, setLocalItems] = useState<ItemPedidoInput[]>([]);

  // Sincroniza estado local se estiver criando, ou apenas inicializa
  useEffect(() => {
    if (!isEditing && defaultValues?.itens) {
      setLocalItems(
        defaultValues.itens.map((it) => ({
          cd_produto: it.cd_produto,
          qt_produto: it.qt_produto,
          ds_observacoes_item: it.ds_observacoes_item || "",
          vl_unitario_praticado: it.vl_unitario_praticado,
        }))
      );
    }
  }, [defaultValues, isEditing]);

  // Define qual lista usar para renderizar a tabela
  const displayItems = isEditing ? defaultValues?.itens || [] : localItems;

  // Estado temporário para o input "Adicionar Produto"
  const [tempItem, setTempItem] = useState({
    cd_produto: "" as unknown as number,
    qt_produto: 1,
    ds_observacoes_item: "",
    vl_unitario_praticado: "" as unknown as number,
  });

  // Estado para controlar edição inline de itens (apenas visual antes de salvar)
  const [editingRow, setEditingRow] = useState<Record<number, EditingRowState>>(
    {}
  );

  // --- HANDLERS ---
  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = Number(e.target.value);
    const prod = produtos.find((p) => p.cd_produto === id);

    setTempItem({
      ...tempItem,
      cd_produto: id,
      // Preenche automaticamente com o preço base, mas permite alterar depois
      vl_unitario_praticado: prod ? Number(prod.vl_base) : 0,
    });
  };

  const handleAddItem = () => {
    if (!tempItem.cd_produto || tempItem.qt_produto < 1) return;

    const newItem: ItemPedidoInput = {
      cd_produto: tempItem.cd_produto,
      qt_produto: tempItem.qt_produto,
      ds_observacoes_item: tempItem.ds_observacoes_item,
      vl_unitario_praticado: Number(tempItem.vl_unitario_praticado),
    };

    if (isEditing) {
      // Edição: Dispara ação imediata para o servidor
      fetcher.submit(
        { intent: "add_item", ...newItem },
        { method: "post", encType: "application/json" }
      );
    } else {
      // Criação: Adiciona na lista local
      setLocalItems((prev) => {
        // Verifica se o produto já existe na lista
        const exists = prev.find(
          (item) => item.cd_produto === newItem.cd_produto
        );

        if (exists) {
          // Se existe, mapeia a lista e soma a quantidade apenas no item correto
          return prev.map((item) =>
            item.cd_produto === newItem.cd_produto
              ? { ...item, qt_produto: item.qt_produto + newItem.qt_produto }
              : item
          );
        }
        // Se não existe, adiciona normal
        return [...prev, newItem];
      });
    }

    // Limpa campos
    setTempItem({
      cd_produto: "" as unknown as number,
      qt_produto: 1,
      ds_observacoes_item: "",
      vl_unitario_praticado: "" as unknown as number,
    });
  };

  const handleRemoveItem = (cd_produto: number) => {
    if (displayItems.length <= 1) {
      alert(
        "O pedido deve ter pelo menos um produto. Para cancelar o pedido, altere o status para Cancelado."
      );
      return;
    }

    if (isEditing) {
      // Edição: Remove do servidor
      const confirm = window.confirm(
        "Tem certeza que deseja remover este item do pedido?"
      );
      if (confirm) {
        fetcher.submit(
          { intent: "remove_item", cd_produto },
          { method: "post", encType: "application/json" } // POST na action, que chama o DELETE service
        );
      }
    } else {
      // Criação: Remove local
      setLocalItems((prev) =>
        prev.filter((it) => it.cd_produto !== cd_produto)
      );
    }
  };

// Inicia a edição de uma linha
  const startEditing = (item: any, currentPrice: number) => {
      setEditingRow({
          ...editingRow,
          [item.cd_produto]: {
              qt_produto: item.qt_produto,
              vl_unitario_praticado: currentPrice,
              ds_observacoes_item: item.ds_observacoes_item || ""
          }
      });
  };

  // Cancela a edição
  const cancelEditing = (cd_produto: number) => {
      const newState = { ...editingRow };
      delete newState[cd_produto];
      setEditingRow(newState);
  };

  // Salva a edição da linha inteira
  const saveEditing = (cd_produto: number) => {
    const data = editingRow[cd_produto];
    if (!data || data.qt_produto < 1) return;

    if (isEditing) {
      // Edição: Atualiza item no servidor
      fetcher.submit(
        { 
            intent: "update_item", 
            cd_produto, 
            qt_produto: data.qt_produto,
            vl_unitario_praticado: data.vl_unitario_praticado,
            ds_observacoes_item: data.ds_observacoes_item
        },
        { method: "post", encType: "application/json" }
      );
    } else {
      // Criação: Atualiza o array local
      setLocalItems((prev) =>
        prev.map((it) =>
          it.cd_produto === cd_produto ? { 
              ...it, 
              qt_produto: data.qt_produto,
              vl_unitario_praticado: data.vl_unitario_praticado,
              ds_observacoes_item: data.ds_observacoes_item
            } : it
        )
      );
    }
    
    // Limpa estado de edição
    cancelEditing(cd_produto);
  };

  const handleSubmitHeader = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isEditing && localItems.length === 0) {
      alert("Adicione pelo menos um produto ao pedido antes de salvar.");
      return; // Interrompe a função aqui
    }

    const formData = new FormData(e.currentTarget);
    const headerData = Object.fromEntries(formData);

    const payload = {
      ...headerData,
      cd_cliente: Number(headerData.cd_cliente),
      itens: isEditing ? [] : localItems,
    };

    submit(payload as any, {
      method: "post",
      encType: "application/json",
    });
  };

  // Calcula total (se editando, usa o total do backend, se criando calcula estimado)
  const totalDisplay = isEditing
    ? Number(defaultValues?.vl_total_pedido || 0)
    : displayItems.reduce((acc, item) => {
        const prod = produtos.find((p) => p.cd_produto === item.cd_produto);
        const preco =
          item.vl_unitario_praticado ??
          (prod?.vl_base ? Number(prod.vl_base) : 0);
        return acc + preco * item.qt_produto;
      }, 0);

  return (
    <Form
      onSubmit={handleSubmitHeader}
      className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200"
    >
      <Typography
        variant="h6"
        className="text-gray-700 border-b pb-2 flex justify-between"
      >
        <span>
          {isEditing
            ? `Editar Pedido #${defaultValues?.cd_pedido}`
            : "Novo Pedido"}
        </span>
        {isEditing && (
          <span className="text-xs font-normal bg-blue-50 text-blue-600 px-2 py-1 rounded">
            Modo Edição Viva (Itens salvos automaticamente)
          </span>
        )}
      </Typography>

      {/* --- CABEÇALHO --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          select
          label="Cliente"
          name="cd_cliente"
          defaultValue={defaultValues?.cd_cliente || ""}
          size="small"
          required
          fullWidth
        >
          {clientes.map((c) => (
            <MenuItem key={c.cd_cliente} value={c.cd_cliente}>
              {c.nm_cliente}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Data"
          type="date"
          name="dt_pedido"
          defaultValue={
            defaultValues?.dt_pedido
              ? new Date(defaultValues.dt_pedido).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0]
          }
          size="small"
          required
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          select
          label="Status"
          name="ds_status"
          defaultValue={
            defaultValues?.ds_status || StatusPedido.AGUARDANDO_PAGAMENTO
          }
          size="small"
          required
          fullWidth
        >
          {Object.values(StatusPedido).map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Total (R$)"
          value={totalDisplay.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
          size="small"
          disabled
          fullWidth
          variant="filled"
        />

        <TextField
          label="Observações"
          name="ds_observacoes"
          defaultValue={defaultValues?.ds_observacoes}
          size="small"
          fullWidth
          multiline
          className="md:col-span-2"
        />
      </div>

      {/* --- ADICIONAR PRODUTOS --- */}
      <Paper variant="outlined" className="p-4 bg-gray-50 flex flex-col gap-3">
        <Typography variant="subtitle2" className="font-bold text-gray-700">
          Adicionar Produtos
        </Typography>
        <div className="flex gap-2 items-end">
          <TextField
            select
            label="Produto"
            value={tempItem.cd_produto}
            onChange={handleProductChange}
            size="small"
            className="flex-grow w-full md:w-auto"
          >
            {produtos.map((p) => (
              <MenuItem key={p.cd_produto} value={p.cd_produto}>
                {p.nm_produto} - R$ {Number(p.vl_base).toFixed(2)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Qtd"
            type="number"
            value={tempItem.qt_produto}
            onChange={(e) =>
              setTempItem({ ...tempItem, qt_produto: Number(e.target.value) })
            }
            size="small"
            className="w-20"
            slotProps={{ htmlInput: { min: 1 } }}
          />
          <TextField
            label="Valor Negociável"
            type="number"
            value={tempItem.vl_unitario_praticado}
            onChange={(e) =>
              setTempItem({
                ...tempItem,
                vl_unitario_praticado: Number(e.target.value),
              })
            }
            size="small"
            className="w-42"
          />
          <TextField
            label="Obs. do Item"
            value={tempItem.ds_observacoes_item}
            onChange={(e) =>
              setTempItem({ ...tempItem, ds_observacoes_item: e.target.value })
            }
            size="small"
            className="flex-grow"
            placeholder="Ex: Cor Azul..."
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddItem}
            disabled={!tempItem.cd_produto}
            className="h-10 whitespace-nowrap"
          >
            {isSubmitting ? "..." : "Adicionar"}
          </Button>
        </div>
      </Paper>

      {/* --- TABELA DE ITENS --- */}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell>Produto</TableCell>
              <TableCell align="center" width="120px">
                Qtd
              </TableCell>
              <TableCell align="right">Unitário</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="center">Ação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayItems.map((item) => {
              const prod = produtos.find(
                (p) => p.cd_produto === item.cd_produto
              );

              // Determina o valor a ser exibido (se editando ou visualizando)
              const isRowEditing = !!editingRow[item.cd_produto];
              const editData = editingRow[item.cd_produto];

              // Valor atual do item (pode vir do backend ou do estado local de novo item)
              const currentPrice = (item as any).vl_unitario_praticado ?? (prod?.vl_base ? Number(prod.vl_base) : 0);

              return (
                <TableRow key={item.cd_produto} sx={{ backgroundColor: isRowEditing ? '#f8f9fa' : 'inherit' }}>
                  {/* COLUNA PRODUTO + OBS */}
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="font-medium">{prod?.nm_produto || `ID ${item.cd_produto}`}</span>
                        {isRowEditing ? (
                            <TextField 
                                size="small" 
                                variant="standard"
                                placeholder="Observação..."
                                value={editData.ds_observacoes_item}
                                onChange={(e) => setEditingRow({
                                    ...editingRow, 
                                    [item.cd_produto]: { ...editData, ds_observacoes_item: e.target.value }
                                })}
                                fullWidth
                                className="mt-1"
                            />
                        ) : (
                            item.ds_observacoes_item && <span className="text-xs text-gray-500 italic">{item.ds_observacoes_item}</span>
                        )}
                    </div>
                  </TableCell>

                  {/* COLUNA QUANTIDADE */}
                  <TableCell align="center">
                    {isRowEditing ? (
                         <TextField 
                            type="number"
                            size="small"
                            variant="standard"
                            value={editData.qt_produto}
                            onChange={(e) => setEditingRow({
                                ...editingRow, 
                                [item.cd_produto]: { ...editData, qt_produto: Number(e.target.value) }
                            })}
                            slotProps={{ htmlInput: { min: 1, style: { textAlign: 'center' } } }}
                        />
                    ) : (
                        item.qt_produto
                    )}
                  </TableCell>

                  {/* COLUNA VALOR UNITÁRIO */}
                  <TableCell align="right">
                    {isRowEditing ? (
                         <TextField 
                            type="number"
                            size="small"
                            variant="standard"
                            value={editData.vl_unitario_praticado}
                            onChange={(e) => setEditingRow({
                                ...editingRow, 
                                [item.cd_produto]: { ...editData, vl_unitario_praticado: Number(e.target.value) }
                            })}
                            slotProps={{ htmlInput: { style: { textAlign: 'right' } } }}
                        />
                    ) : (
                        `R$ ${Number(currentPrice).toFixed(2)}`
                    )}
                  </TableCell>

                  {/* COLUNA SUBTOTAL */}
                  <TableCell align="right">
                    R$ {( (isRowEditing ? editData.vl_unitario_praticado : currentPrice) * (isRowEditing ? editData.qt_produto : item.qt_produto) ).toFixed(2)}
                  </TableCell>
                  
                  {/* COLUNA AÇÕES */}
                  <TableCell align="center">
                    {isRowEditing ? (
                        <div className="flex justify-center gap-1">
                            <Tooltip title="Salvar">
                                <IconButton size="small" color="primary" onClick={() => saveEditing(item.cd_produto)}>
                                    <SaveIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancelar">
                                <IconButton size="small" color="default" onClick={() => cancelEditing(item.cd_produto)}>
                                    <CancelIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </div>
                    ) : (
                        <div className="flex justify-center gap-1">
                            <Tooltip title="Editar Item">
                                <IconButton size="small" color="primary" onClick={() => startEditing(item, currentPrice)}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Remover">
                                <IconButton size="small" color="error" onClick={() => handleRemoveItem(item.cd_produto)}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {displayItems.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  className="text-gray-500 py-4"
                >
                  Nenhum item.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="flex justify-end pt-4 border-t">
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Salvando..."
            : isEditing
            ? "Salvar Alterações"
            : "Criar Pedido"}
        </Button>
      </div>
    </Form>
  );
}

export default OrderForm;
