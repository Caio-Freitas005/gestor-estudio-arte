import { useLoaderData } from "react-router";
import { Typography } from "@mui/material";
import OrderForm from "./components/OrderForm";

function OrderCreatePage() {
  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h4" className="text-gray-800 font-bold">
        Abrir <span className="text-pink-500">Pedido</span>
      </Typography>

      <OrderForm />
    </div>
  );
}

export default OrderCreatePage;
