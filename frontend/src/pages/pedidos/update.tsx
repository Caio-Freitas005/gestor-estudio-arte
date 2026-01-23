import { useLoaderData } from "react-router";
import { Typography, Alert } from "@mui/material";
import OrderForm from "./components/OrderForm";
import { UpdateLoaderData } from "./orders.data";

function OrderUpdatePage() {
  const { pedido, clientes, produtos } = useLoaderData() as UpdateLoaderData;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" className="text-gray-800 font-bold">
          Pedido #{pedido.cd_pedido}
        </Typography>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold 
          ${pedido.ds_status === 'Concluído' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
          {pedido.ds_status}
        </span>
      </div>

      <Alert severity="info" className="shadow-sm border border-blue-100 bg-blue-50">
        Editando pedido de <strong>{pedido.cliente?.nm_cliente}</strong>. 
        Valor total atual: <strong>R$ {Number(pedido.vl_total_pedido).toFixed(2)}</strong>
      </Alert>

      <OrderForm 
        defaultValues={pedido} 
        clientes={clientes} 
        produtos={produtos} 
      />
    </div>
  );
}

export default OrderUpdatePage;