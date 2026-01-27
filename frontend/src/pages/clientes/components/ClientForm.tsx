import { Form, useNavigation } from "react-router";
import { Button, TextField } from "@mui/material";
import { ClientePublic } from "../../../types/cliente.types";
import FormSection from "../../../components/FormSection";

interface ClienteFormProps {
  defaultValues?: ClientePublic;
}

function ClientForm({ defaultValues }: ClienteFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const data = defaultValues || ({} as ClientePublic);

  return (
    <Form method="post" className="flex flex-col gap-8 max-w-4xl">
      <FormSection
        title="Informações de Contato"
        className="grid grid-cols-4 md:grid-cols-3 gap-6"
      >
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
          label="Telefone"
          name="cd_telefone"
          defaultValue={data.cd_telefone ?? ""}
          variant="outlined"
          size="small"
          slotProps={{ htmlInput: { maxLength: 15 } }}
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
      </FormSection>

      <FormSection
        title="Informações Adicionais"
        className="grid grid-cols-1 gap-8"
      >
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
      </FormSection>

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
