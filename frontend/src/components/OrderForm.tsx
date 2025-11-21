import { Form, useNavigation } from "react-router";
import { Button, TextField, Typography, MenuItem } from "@mui/material";
import { PedidoPublic, StatusPedido } from "../types/pedido.types";
import { ClientePublic } from "../types/cliente.types";

interface OrderFormProps {
  defaultValues?: PedidoPublic;
  clientes: ClientePublic[];
}

function OrderForm({ defaultValues, clientes }: OrderFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const data = defaultValues || {
    dt_pedido: new Date().toISOString().split("T")[0],
    ds_status: StatusPedido.AGUARDANDO_PAGAMENTO,
    vl_total_pedido: 0,
    cd_cliente: "" as unknown as number,
  };

  return (
    <Form
      method="post"
      className="flex flex-col gap-4 p-6 border border-gray-200 rounded-lg shadow-sm bg-white max-w-lg"
    >
      <Typography variant="h6" className="mb-2 text-gray-700">
        {defaultValues?.cd_pedido ? "Editar Pedido" : "Novo Pedido"}
      </Typography>

      <TextField
        select
        label="Cliente"
        name="cd_cliente"
        required
        defaultValue={data.cd_cliente || ""}
        variant="outlined"
        size="small"
        helperText="Selecione quem fez a encomenda"
        fullWidth
      >
        {clientes.map((cliente) => (
          <MenuItem key={cliente.cd_cliente} value={cliente.cd_cliente}>
            {cliente.nm_cliente}
          </MenuItem>
        ))}
      </TextField>

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Data do Pedido"
          name="dt_pedido"
          type="date"
          required
          defaultValue={data.dt_pedido}
          variant="outlined"
          size="small"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          select
          label="Status Atual"
          name="ds_status"
          required
          defaultValue={data.ds_status}
          variant="outlined"
          size="small"
          fullWidth
        >
          {Object.values(StatusPedido).map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <TextField
        label="Valor Total (R$)"
        value={data.vl_total_pedido || "0.00"}
        variant="filled"
        size="small"
        disabled
        fullWidth
        helperText="O valor é calculado somando os itens."
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting}
        className="mt-2"
        disableElevation
      >
        {isSubmitting ? "Salvando..." : "Salvar Pedido"}
      </Button>
    </Form>
  );
}

export default OrderForm;
