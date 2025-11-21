import { Form, useNavigation } from "react-router";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";

import { PedidoPublic, StatusPedido } from "../types/pedido.types";
import { ClientePublic } from "../types/cliente.types";

interface OrderFormProps {
  defaultValues?: PedidoPublic;
  clientes: ClientePublic[]; // Recebe a lista carregada pelo Loader
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
    <Box
      component={Form}
      method="post"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: 2,
        border: "1px solid #ccc",
        borderRadius: 1,
        maxWidth: 500,
      }}
    >
      <Typography variant="h6">
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
      >
        {clientes.map((cliente) => (
          <MenuItem key={cliente.cd_cliente} value={cliente.cd_cliente}>
            {cliente.nm_cliente}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Data do Pedido"
        name="dt_pedido"
        type="date"
        required
        defaultValue={data.dt_pedido}
        variant="outlined"
        size="small"
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
      >
        {Object.values(StatusPedido).map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Valor Total (R$)"
        value={data.vl_total_pedido || "0.00"}
        variant="filled"
        size="small"
        disabled
        helperText="O valor é calculado somando os itens."
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Salvando..." : "Salvar Pedido"}
      </Button>
    </Box>
  );
}

export default OrderForm;