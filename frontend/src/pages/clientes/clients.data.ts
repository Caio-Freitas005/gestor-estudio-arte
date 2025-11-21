import { LoaderFunctionArgs, ActionFunctionArgs, redirect } from "react-router";
import { clientsService } from "../../services/clients.service";
import {
  ClienteCreate,
  ClienteUpdate,
  ClientePublic,
} from "../../types/cliente.types";

export const clientsListLoader = () => clientsService.getAll();

export async function clientLoader({
  params,
}: LoaderFunctionArgs): Promise<ClientePublic> {
  if (!params.id) {
    throw new Error("ID do cliente não encontrado na URL.");
  }

  try {
    const client = await clientsService.getById(params.id);
    return client;
  } catch (err) {
    console.error(err);
    throw err; // Lança o erro para o ErrorBoundary
  }
}

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

export async function clientUpdateAction({
  request,
  params,
}: ActionFunctionArgs) {
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
    await clientsService.update(params.id, dataToSend);
    return redirect("/clientes");
  } catch (err) {
    console.error(err);
    // Retornar o erro para exibição depois
    return null;
  }
}

export async function clientDeleteAction({ params }: ActionFunctionArgs) {
  if (!params.id) {
    throw new Error("ID do cliente não encontrado na URL.");
  }

  try {
    await clientsService.delete(params.id);
    return redirect("/clientes");
  } catch (err) {
    console.error(err);
    throw err;
  }
}
