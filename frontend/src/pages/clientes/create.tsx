import { redirect } from "react-router";
import { Box, Typography } from "@mui/material";
import ClientForm from "../../components/ClientForm";
import { clientsService } from "../../services/clients.service";
import { ClienteCreate } from "../../types/cliente.types";

// Essa action será chamada pelo <Form> do ClientForm.jsx
export async function clientCreateAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const clientData = Object.fromEntries(formData);

  // as string necessário porque o formData só lida com string
  const dataToSend: ClienteCreate = {
    nm_cliente: clientData.nm_cliente as string,
    cd_telefone: (clientData.cd_telefone as string) || null,
    nm_email: (clientData.nm_email as string) || null,
    dt_nascimento: (clientData.dt_nascimento as string) || null,
    ds_observacoes: (clientData.ds_observacoes as string) || null,
  };

  try {
    await clientsService.create(dataToSend);
    return redirect("/clientes");
  } catch (err) {
    console.error(err);
    // Retornar o erro para exibição depois
    return null;
  }
}

function ClientCreatePage() {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h3" gutterBottom>
        Formulário de Clientes
      </Typography>

      <ClientForm />
    </Box>
  );
}

export default ClientCreatePage;
