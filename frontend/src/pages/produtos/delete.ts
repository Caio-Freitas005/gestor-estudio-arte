import { ActionFunctionArgs, redirect } from "react-router";
import { deleteProduct } from "../../services/products.service";

export async function productDeleteAction({ params }: ActionFunctionArgs) {
  if (!params.id) {
    throw new Error("ID do cliente não encontrado na URL.");
  }

  try {
    await deleteProduct(params.id);
    return redirect("/produtos");
  } catch (err) {
    console.error(err);
    throw err;
  }
}
