import { useLoaderData } from "react-router";
import { Typography } from "@mui/material";
import OrderForm from "../../components/OrderForm";
import { CreateLoaderData } from "./orders.data";

function OrderCreatePage() {
  // Tipagem forte baseada no retorno do loader
  const { clientes, produtos } = useLoaderData() as CreateLoaderData;

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h4" className="text-gray-800 font-bold">
        Abrir Novo Pedido
      </Typography>
      
      <OrderForm clientes={clientes} produtos={produtos} />
    </div>
  );
}
export default OrderCreatePage;