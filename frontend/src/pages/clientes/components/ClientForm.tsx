import { useState } from "react";
import { useAppToast } from "@/hooks/useAppToast";
import { Form, useNavigation } from "react-router";
import { formatPhoneInput } from "@/utils/form.utils";
import { Button, TextField } from "@mui/material";
import { ClientePublic } from "@/types/cliente.types";
import FormSection from "@/components/FormSection";

interface ClienteFormProps {
  defaultValues?: ClientePublic;
}

function ClientForm({ defaultValues }: ClienteFormProps) {
  useAppToast();

  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";

  const cliente = defaultValues || ({} as ClientePublic);

  // Estado para controlar o que é visto no input
  const [telefoneInput, setTelefoneInput] = useState<string>(
    formatPhoneInput(cliente.telefone),
  );

  return (
    <Form method="post" className="flex flex-col gap-8 max-w-4xl">
      <FormSection
        title="Informações de Contato"
        className="grid grid-cols-4 md:grid-cols-3 gap-6"
      >
        <TextField
          label="Nome do Cliente"
          name="nome"
          required
          defaultValue={cliente.nome}
          variant="outlined"
          size="small"
          fullWidth
          slotProps={{
            htmlInput: {
              pattern: ".*\\S+.*",
              title: "O nome não pode conter apenas espaços em branco",
            },
          }}
        />
        <TextField
          label="Telefone"
          name="telefone"
          value={telefoneInput}
          onChange={(e) => setTelefoneInput(formatPhoneInput(e.target.value))}
          variant="outlined"
          size="small"
          fullWidth
          slotProps={{ htmlInput: { maxLength: 20 } }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          defaultValue={cliente.email ?? ""}
          variant="outlined"
          size="small"
          fullWidth
          slotProps={{ htmlInput: { maxLength: 100 } }}
        />
      </FormSection>

      <FormSection
        title="Informações Adicionais"
        className="grid grid-cols-1 gap-8"
      >
        <TextField
          label="Data de Nascimento"
          name="data_nascimento"
          type="date"
          defaultValue={cliente.data_nascimento ?? ""}
          variant="outlined"
          size="small"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="Observações"
          name="observacoes"
          defaultValue={cliente.observacoes ?? ""}
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
        className="mt-2"
        disableElevation
      >
        {isSubmitting ? "Salvando..." : "Salvar Cliente"}
      </Button>
    </Form>
  );
}

export default ClientForm;
