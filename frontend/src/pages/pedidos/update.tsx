import { useLoaderData } from "react-router";
import { Typography, Alert } from "@mui/material";
import { UpdateLoaderData } from "./orders.data";
import { formatNumber } from "../../utils/format.utils";
import OrderForm from "./components/OrderForm";

function OrderUpdatePage() {
  const { pedido, clientes, produtos } = useLoaderData() as UpdateLoaderData;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" className="text-gray-800 font-bold">
          Pedido <span className="text-pink-500">#{pedido.id}</span>
        </Typography>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold 
          ${pedido.status === 'Concluído' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
          {pedido.status}
        </span>
      </div>

      <Alert severity="info" className="shadow-sm border border-blue-100 bg-blue-50">
        Editando pedido de <strong>{pedido.cliente?.nome}</strong>. 
        Valor total atual: <strong>R$ {formatNumber(pedido.total)}</strong>
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