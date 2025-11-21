import { useLoaderData } from "react-router";
import { Typography } from "@mui/material";
import OrderForm from "../../components/OrderForm";
import { ClientePublic } from "../../types/cliente.types";

function OrderCreatePage() {
  const clients = useLoaderData() as ClientePublic[];
  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h4">Abrir Novo Pedido</Typography>
      <OrderForm clientes={clients} />
    </div>
  );
}
export default OrderCreatePage;
