import { Paper, Typography } from "@mui/material";
import { AccessTime, Brush, CheckCircle } from "@mui/icons-material";
import { DashboardData } from "@/types/dashboard.types";

interface PendingsWidgetProps {
  status: DashboardData["status"];
}

function PendingsWidget({ status }: PendingsWidgetProps) {
  return (
    <div className="flex flex-col gap-4 sticky top-8">
      <Paper className="p-6 !rounded-2xl bg-amber-50 border border-amber-100">
        <div className="flex items-center gap-3 mb-2 text-amber-700">
          <AccessTime />
          <Typography className="!font-bold uppercase !text-xs !tracking-widest">
            Pendentes de Pagto
          </Typography>
        </div>
        <Typography variant="h4" className="!font-black text-amber-700">
          {status.aguardandoPagamento}
        </Typography>
        <Typography variant="caption" className="text-amber-600/80">
          Pedidos aguardando confirmação financeira
        </Typography>
      </Paper>

      <Paper className="p-6 !rounded-2xl bg-pink-50 border border-pink-100">
        <div className="flex items-center gap-3 mb-2 text-pink-700">
          <Brush />
          <Typography className="!font-bold uppercase !text-xs !tracking-widest">
            Aguardando Arte
          </Typography>
        </div>
        <Typography variant="h4" className="!font-black text-pink-700">
          {status.aguardandoArte}
        </Typography>
        <Typography variant="caption" className="text-pink-600/80">
          Itens que precisam de definição visual
        </Typography>
      </Paper>

      <Paper className="p-6 !rounded-2xl bg-purple-50 border border-purple-100">
        <div className="flex items-center gap-3 mb-2 text-purple-700">
          <CheckCircle />
          <Typography className="!font-bold uppercase !text-xs !tracking-widest">
            Prontos p/ Retirada
          </Typography>
        </div>
        <Typography variant="h4" className="!font-black text-purple-700">
          {status.pronto}
        </Typography>
        <Typography variant="caption" className="text-purple-600/80">
          Avisar clientes para buscar
        </Typography>
      </Paper>
    </div>
  );
}

export default PendingsWidget;