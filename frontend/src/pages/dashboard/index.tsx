import { useLoaderData } from "react-router";
import { formatDate, formatNumber } from "@/utils/format.utils";
import { DashboardData } from "@/types/dashboard.types";
import { Grid } from "@mui/material";
import {
  TrendingUp,
  Handyman,
  CheckCircle,
  ShoppingBag,
  Block,
} from "@mui/icons-material";

import PageHeader from "@/components/PageHeader";
import StatCard from "./components/StatCard";
import BirthdayWidget from "./components/BirthdayWidget";
import RecentOrdersWidget from "./components/RecentOrdersWidget";
import PendingsWidget from "./components/PendingsWidget";

function DashboardPage() {
  const { status, pedidosRecentes, aniversariantes } =
    useLoaderData() as DashboardData;

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full">
      <PageHeader
        title="Painel de"
        highlight="Visualização"
        subtitle={`Seu ateliê hoje ${formatDate(String(new Date()))}`}
      />

      {/* Grid de Estatísticas Principais */}
      <Grid container spacing={3}>
        {/* Faturamento */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            label="Faturamento Total"
            value={`R$ ${formatNumber(status.faturamento)}`}
            icon={<TrendingUp sx={{ fontSize: 60 }} />}
            colorClass="text-emerald-600"
          />
        </Grid>

        {/* Ativos */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            label="Pedidos Ativos"
            value={status.totalAtivos}
            icon={<ShoppingBag sx={{ fontSize: 60 }} />}
            colorClass="text-blue-600"
          />
        </Grid>

        {/* Em Produção */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            label="Em Produção"
            value={status.emProducao}
            icon={<Handyman sx={{ fontSize: 60 }} />}
            colorClass="text-pink-600"
          />
        </Grid>

        {/* Concluídos */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            label="Concluídos"
            value={status.concluidos}
            icon={<CheckCircle sx={{ fontSize: 60 }} />}
            colorClass="text-teal-600"
          />
        </Grid>

        {/* Cancelados */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            label="Cancelados"
            value={status.cancelados}
            icon={<Block sx={{ fontSize: 60 }} />}
            colorClass="text-slate-400"
          />
        </Grid>
      </Grid>

      {/* Atividade Recente e Avisos Rápidos */}
      <Grid container spacing={4}>
        {/* Aniversariantes e Pedidos Recentes */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <div className="flex flex-col gap-8">
            <BirthdayWidget clientes={aniversariantes} />
            <RecentOrdersWidget pedidos={pedidosRecentes} />
          </div>
        </Grid>

        {/* Pendências */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <PendingsWidget status={status} />
        </Grid>
      </Grid>
    </div>
  );
}

export default DashboardPage;
