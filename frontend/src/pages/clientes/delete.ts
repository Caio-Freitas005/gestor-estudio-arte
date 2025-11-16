import { ActionFunctionArgs, redirect } from "react-router";
import { deleteClient } from "../../services/clients.service";

export async function clientDeleteAction({ params }: ActionFunctionArgs) {
  if (!params.id) {
    throw new Error("ID do cliente não encontrado na URL.");
  }

  try {
    await deleteClient(params.id);
    return redirect("/clientes");
  } catch (err) {
    console.error(err);
    throw err;
  }
}
