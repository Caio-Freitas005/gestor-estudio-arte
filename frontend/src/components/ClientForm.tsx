import { Form, useNavigation } from "react-router";
import { Box, Button, TextField, Typography } from "@mui/material";
import { ClientePublic } from "../types/cliente.types";

interface ClienteFormProps {
  defaultValues?: ClientePublic;
}

function ClientForm({ defaultValues }: ClienteFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const data = defaultValues || ({} as ClientePublic);

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
        {data.cd_cliente ? "Editar Cliente" : "Cadastrar Novo Cliente"}
      </Typography>

      <TextField
        label="Nome do Cliente"
        name="nm_cliente"
        required
        defaultValue={data.nm_cliente}
        variant="outlined"
        size="small"
      />
      <TextField
        label="Telefone (ex: (00) 99999-8888)"
        name="cd_telefone"
        // ?? (Coalescência Nula) para converter null ou undefined para string vazia
        defaultValue={data.cd_telefone ?? ""}
        variant="outlined"
        size="small"
      />
      <TextField
        label="Email"
        name="nm_email"
        type="email"
        defaultValue={data.nm_email ?? ""}
        variant="outlined"
        size="small"
      />
      <TextField
        label="Data de Nascimento"
        name="dt_nascimento"
        type="date"
        defaultValue={data.dt_nascimento ?? ""}
        variant="outlined"
        size="small"
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <TextField
        label="Observações"
        name="ds_observacoes"
        defaultValue={data.ds_observacoes ?? ""}
        variant="outlined"
        size="small"
        multiline
        rows={3}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Salvando..." : "Salvar Cliente"}
      </Button>
    </Box>
  );
}

export default ClientForm;
