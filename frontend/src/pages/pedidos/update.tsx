import { useLoaderData, useSearchParams } from "react-router";
import { Typography, Alert } from "@mui/material";
import { UpdateLoaderData } from "./orders.data";
import { formatNumber } from "@/utils/format.utils";
import OrderForm from "./components/OrderForm";

function OrderUpdatePage() {
  const { pedido } = useLoaderData() as UpdateLoaderData;
  const [searchParams] = useSearchParams(); // <-- Lê os parâmetros da URL
  
  // Verifica se a URL contém o aviso de que a arte falhou na criação
  const uploadError = searchParams.get("aviso") === "erro_upload";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" className="text-gray-800 font-bold">
          Pedido <span className="text-pink-500">#{pedido.id}</span>
        </Typography>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold 
          ${pedido.status === "Concluído" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
        >
          {pedido.status}
        </span>
      </div>

      {uploadError && (
        <Alert severity="warning" className="shadow-sm font-medium">
          O pedido foi salvo com sucesso, mas <strong>houve um erro ao enviar uma das artes</strong> (formato inválido ou arquivo muito grande). 
          Por favor, tente enviar a arte novamente usando os botões da tabela abaixo.
        </Alert>
      )}

      {!uploadError && (
        <Alert severity="info" className="shadow-sm border border-blue-100 bg-blue-50">
          Editando pedido de <strong>{pedido.cliente?.nome}</strong>. 
          Valor total atual: <strong>R$ {formatNumber(pedido.total)}</strong>
        </Alert>
      )}

      <OrderForm key={pedido.id} defaultValues={pedido} />
    </div>
  );
}

export default OrderUpdatePage;
