import { Form } from "react-router";
import { Button, MenuItem, TextField, Typography, Paper } from "@mui/material";
import { useOrderManager } from "../hooks/useOrderManager";
import AddItemRow from "../components/AddItemRow";
import ItemTable from "../components/ItemTable";
import { PedidoPublic, StatusPedido } from "../../../types/pedido.types";
import { ClientePublic } from "../../../types/cliente.types";
import { ProdutoPublic } from "../../../types/produto.types";

export interface OrderFormProps {
  defaultValues?: PedidoPublic;
  clientes: ClientePublic[];
  produtos: ProdutoPublic[];
}

function OrderForm({
  defaultValues,
  clientes,
  produtos,
}: OrderFormProps) {
  const isEditing = !!defaultValues?.cd_pedido;
  const {
    localItems,
    setLocalItems,
    handleUpload,
    pendingFiles,
    fetcher,
    submit,
  } = useOrderManager(defaultValues, isEditing);

  const displayItems = isEditing ? defaultValues?.itens || [] : localItems;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const headerData = Object.fromEntries(formData);

    if (isEditing) {
      // Atualiza apenas cabeçalho
      submit(
        { ...headerData, cd_cliente: Number(headerData.cd_cliente) },
        { method: "post", encType: "application/json" }
      );
    } else {
      // Envio em lote para novos pedidos
      const finalData = new FormData();
      finalData.append(
        "orderData",
        JSON.stringify({
          ...headerData,
          cd_cliente: Number(headerData.cd_cliente),
          itens: localItems.map(({ ds_caminho_arte, ...rest }) => rest),
        })
      );
      pendingFiles.forEach((file, id) => finalData.append(`file_${id}`, file));

      submit(finalData, { method: "post", encType: "multipart/form-data" });
    }
  };

  const handleUpdateItem = (updatedItem: any) => {
    if (isEditing) {
      // Edição: Envia para a action com o intent "update_item"
      submit(
        { intent: "update_item", ...updatedItem },
        { method: "post", encType: "application/json" }
      );
    } else {
      // Criação: Atualiza apenas o array local
      setLocalItems((prev) =>
        prev.map((it) =>
          it.cd_produto === updatedItem.cd_produto ? updatedItem : it
        )
      );
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Typography variant="h6">
        {isEditing ? "Editar Pedido" : "Novo Pedido"}
      </Typography>

      <Paper>
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
            defaultValue={defaultValues?.ds_status || "Aguardando Pagamento"}
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
            label="Observações"
            name="ds_observacoes"
            defaultValue={defaultValues?.ds_observacoes}
            size="small"
            fullWidth
            multiline
            className="md:col-span-2"
          />
        </div>
      </Paper>

      <AddItemRow
        produtos={produtos}
        onAdd={(newItem) => {
          if (isEditing) {
            // "Edição Viva": Adiciona direto no banco
            fetcher.submit(
              { intent: "add_item", ...newItem },
              { method: "post", encType: "application/json" }
            );
          } else {
            // "Modo Criação": Apenas na memória do React
            setLocalItems([...localItems, newItem]);
          }
        }}
      />

      <ItemTable
        items={displayItems}
        produtos={produtos}
        onUpload={handleUpload}
        onRemove={(cd_produto) => {
          if (isEditing) {
            if (confirm("Deseja remover este item do pedido?")) {
              fetcher.submit(
                { intent: "remove_item", cd_produto },
                { method: "post", encType: "application/json" }
              );
            }
          } else {
            setLocalItems(
              localItems.filter((it) => it.cd_produto !== cd_produto)
            );
          }
        }}
        onUpdate={handleUpdateItem}
      />

      <Button type="submit" variant="contained">
        Salvar Pedido
      </Button>
    </Form>
  );
}

export default OrderForm;