import { useLoaderData, redirect, LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { Box, Typography } from "@mui/material";
import ClientForm from "../../components/ClientForm";
import { getClient, updateClient } from "../../services/clients.service"
import { ClientePublic, ClienteUpdate } from "../../types/cliente.types";

// Busca os dados do cliente específico antes da página carregar
export async function clientUpdateLoader({ params }: LoaderFunctionArgs): Promise<ClientePublic> {
  if (!params.id) {
    throw new Error("ID do cliente não encontrado na URL.");
  }

  try {
    const client = await getClient(params.id);
    return client;
  } catch (err) {
    console.error(err);
    throw err; // Lança o erro para o ErrorBoundary
  }
}

export async function clientUpdateAction({ request, params }: ActionFunctionArgs) {
  if (!params.id) {
    throw new Error("ID do cliente não encontrado na URL.");
  }

  const formData = await request.formData();
  const clientData = Object.fromEntries(formData);

  const dataToSend: ClienteUpdate = {
    nm_cliente: clientData.nm_cliente as string | undefined,
    cd_telefone: (clientData.cd_telefone as string) || null,
    nm_email: (clientData.nm_email as string) || null,
    dt_nascimento: (clientData.dt_nascimento as string) || null,
    ds_observacoes: (clientData.ds_observacoes as string) || null,
  };

  try {
    await updateClient(params.id, dataToSend);
    return redirect("/clientes");
  } catch (err) {
    console.error(err);
    // Retornar o erro para exibição depois
    return null;
  }
}

function ClientUpdatePage() {
  // Busca os dados carregados pelo loader
  const clientData = useLoaderData() as ClientePublic;
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h3" gutterBottom>
        Formulário de Clientes
      </Typography>
      {/* Passa os dados do cliente para o formulário
        para pré-preencher os campos
      */}
      <ClientForm defaultValues={clientData} />
    </Box>
  );
}

export default ClientUpdatePage;
