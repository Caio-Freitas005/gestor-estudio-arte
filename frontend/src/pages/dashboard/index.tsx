import { useLoaderData, Link } from "react-router";
import { formatDate, formatNumber } from "../../utils/format.utils";
import { statusStyles } from "../pedidos/index";

import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Button,
  Paper,
} from "@mui/material";
import {
  TrendingUp,
  AccessTime,
  Handyman,
  CheckCircle,
  ShoppingBag,
  ArrowForward,
  Brush,
  Cake,
  Block,
} from "@mui/icons-material";

import PageHeader from "../../components/PageHeader";
import FormSection from "../../components/FormSection";
import StatCard from "./components/StatCard";

function DashboardPage() {
  const { status, pedidosRecentes, aniversariantes } = useLoaderData() as any;

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
      <Grid size={{ xs: 12 }}></Grid>

      {/* Atividade Recente e Avisos Rápidos */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <div className="flex flex-col gap-8">
            <FormSection title="Aniversariantes do Mês">
              {aniversariantes.length === 0 ? (
                <Typography variant="body2" className="text-gray-400 italic">
                  Nenhum aniversariante este mês.
                </Typography>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {aniversariantes.map((cliente: any) => (
                    <div
                      key={cliente.id}
                      className="flex items-center gap-3 p-3 bg-pink-50/50 rounded-xl border border-pink-100"
                    >
                      <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white shadow-sm">
                        <Cake fontSize="small" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm">
                          {cliente.nome}
                        </span>
                        <span className="text-[11px] text-pink-600 font-medium">
                          Dia {new Date(cliente.data_nascimento).getUTCDate()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </FormSection>

            <FormSection title="Atividade Recente">
              <div className="overflow-x-auto">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className="!font-bold !text-gray-400 !text-[10px] !uppercase">
                        ID
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-400 !text-[10px] !uppercase">
                        Cliente
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-400 !text-[10px] !uppercase">
                        Status
                      </TableCell>
                      <TableCell
                        align="right"
                        className="!font-bold !text-gray-400 !text-[10px] !uppercase"
                      >
                        Total
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pedidosRecentes.map((pedido: any) => (
                      <TableRow
                        key={pedido.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell className="!font-bold !text-gray-700">
                          #{pedido.id}
                        </TableCell>
                        <TableCell className="!text-sm">
                          {pedido.cliente?.nome || "Final Consumidor"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={pedido.status}
                            size="small"
                            className={`${
                              statusStyles[pedido.status]
                            } !text-[8px] !font-black !uppercase !h-5`}
                          />
                        </TableCell>
                        <TableCell
                          align="right"
                          className="!font-mono !font-bold !text-sm"
                        >
                          R$ {formatNumber(pedido.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button
                component={Link}
                to="/pedidos"
                fullWidth
                variant="text"
                className="!mt-4 !text-pink-500 !font-bold"
                endIcon={<ArrowForward />}
              >
                Ver todos os pedidos
              </Button>
            </FormSection>
          </div>
        </Grid>

        {/* Pendências */}
        <Grid size={{ xs: 12, lg: 4 }}>
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
        </Grid>
      </Grid>
    </div>
  );
}

export default DashboardPage;
