import { Form, useNavigation } from "react-router";
import { Button, TextField, Typography } from "@mui/material";
import { ClientePublic } from "../types/cliente.types";

interface ClienteFormProps {
  defaultValues?: ClientePublic;
}

function ClientForm({ defaultValues }: ClienteFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const data = defaultValues || ({} as ClientePublic);

  return (
    <Form
      method="post"
      className="flex flex-col gap-4 p-6 border border-gray-200 rounded-lg shadow-sm bg-white max-w-lg"
    >
      <Typography variant="h6" className="mb-2 text-gray-700">
        {data.cd_cliente ? "Editar Cliente" : "Cadastrar Novo Cliente"}
      </Typography>

      <TextField
        label="Nome do Cliente"
        name="nm_cliente"
        required
        defaultValue={data.nm_cliente}
        variant="outlined"
        size="small"
        fullWidth
      />
      <TextField
        label="Telefone (ex: (00) 99999-8888)"
        name="cd_telefone"
        defaultValue={data.cd_telefone ?? ""}
        variant="outlined"
        size="small"
        fullWidth
      />
      <TextField
        label="Email"
        name="nm_email"
        type="email"
        defaultValue={data.nm_email ?? ""}
        variant="outlined"
        size="small"
        fullWidth
      />
      <TextField
        label="Data de Nascimento"
        name="dt_nascimento"
        type="date"
        defaultValue={data.dt_nascimento ?? ""}
        variant="outlined"
        size="small"
        fullWidth
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
        fullWidth
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting}
        className="mt-2"
        disableElevation
      >
        {isSubmitting ? "Salvando..." : "Salvar Cliente"}
      </Button>
    </Form>
  );
}

export default ClientForm;
