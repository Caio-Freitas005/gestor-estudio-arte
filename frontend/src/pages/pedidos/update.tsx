import { useLoaderData } from "react-router";
import OrderForm from "../../components/OrderForm";
import { Typography, Alert } from "@mui/material";
import { UpdateLoaderData } from "./orders.data";

function OrderUpdatePage() {
  const { pedido, clientes } = useLoaderData() as UpdateLoaderData;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Typography variant="h3">Pedido #{pedido.cd_pedido}</Typography>
      </div>

      <Alert severity="info" className="shadow-sm border border-blue-100">
        Editando pedido de <strong>{pedido.cliente?.nm_cliente}</strong>. Valor
        atual: <strong>R$ {Number(pedido.vl_total_pedido).toFixed(2)}</strong>
      </Alert>

      <OrderForm defaultValues={pedido} clientes={clientes} />
    </div>
  );
}
export default OrderUpdatePage;
