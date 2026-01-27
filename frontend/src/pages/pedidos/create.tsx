import { useLoaderData } from "react-router";
import { Typography } from "@mui/material";
import { CreateLoaderData } from "./orders.data";
import OrderForm from "./components/OrderForm";

function OrderCreatePage() {
  // Tipagem forte baseada no retorno do loader
  const { clientes, produtos } = useLoaderData() as CreateLoaderData;

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h4" className="text-gray-800 font-bold">
        Abrir <span className="text-pink-500">Pedido</span>
      </Typography>

      <OrderForm clientes={clientes} produtos={produtos} />
    </div>
  );
}

export default OrderCreatePage;
