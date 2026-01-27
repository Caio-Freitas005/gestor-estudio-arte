import { Form } from "react-router";
import { Button, MenuItem, TextField } from "@mui/material";
import { useOrderManager } from "../hooks/useOrderManager";
import { PedidoPublic, StatusPedido } from "../../../types/pedido.types";
import { ClientePublic } from "../../../types/cliente.types";
import { ProdutoPublic } from "../../../types/produto.types";
import AddItemRow from "../components/AddItemRow";
import ItemTable from "../components/ItemTable";
import FormSection from "../../../components/FormSection";

interface OrderFormProps {
  defaultValues?: PedidoPublic;
  clientes: ClientePublic[];
  produtos: ProdutoPublic[];
}

function OrderForm({ defaultValues, clientes, produtos }: OrderFormProps) {
  const isEditing = !!defaultValues?.cd_pedido;
  const {
    localItems,
    addItem,
    removeItem,
    updateItem,
    saveOrder,
    handleUpload,
  } = useOrderManager(defaultValues, isEditing);

  const displayItems = isEditing ? defaultValues?.itens || [] : localItems;

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        saveOrder(new FormData(e.currentTarget));
      }}
      className="flex flex-col gap-8"
    >
      <FormSection
        title="Informações de Identificação"
        className="grid grid-cols-4 md:grid-cols-3 gap-6"
      >
        <TextField
          select
          label="Cliente"
          name="cd_cliente"
          defaultValue={defaultValues?.cd_cliente || ""}
          size="small"
          required
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
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </FormSection>

      <FormSection
        title="Status e Observações"
        className="grid grid-cols-3 md:grid-cols-3 gap-6"
      >
        <TextField
          select
          label="Status"
          name="ds_status"
          defaultValue={defaultValues?.ds_status || "Aguardando Pagamento"}
          size="small"
          required
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
          multiline
        />
      </FormSection>

      <AddItemRow
        produtos={produtos}
        onAdd={addItem}
      />

      <ItemTable
        items={displayItems}
        produtos={produtos}
        onUpload={handleUpload}
        onRemove={removeItem}
        onUpdate={updateItem}
      />

      <Button type="submit" variant="contained" style={{ maxWidth: "1050px" }}>
        Salvar Pedido
      </Button>
    </Form>
  );
}

export default OrderForm;
