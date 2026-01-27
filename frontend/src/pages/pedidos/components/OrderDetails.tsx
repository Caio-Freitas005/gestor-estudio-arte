import { PedidoPublic } from "../../../types/pedido.types";
import { ProdutoPublic } from "../../../types/produto.types";
import { statusStyles } from "..";

import {
  Box,
  Typography,
  Divider,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Close, Edit, LocalPhone, Receipt, Cake } from "@mui/icons-material";

import FormSection from "../../../components/FormSection";

const API_URL = import.meta.env.VITE_API_URL;

interface OrderDetailsProps {
  order: PedidoPublic;
  produtos: ProdutoPublic[];
  onClose: () => void;
  onEdit: (id: number) => void;
}

function OrderDetails({ order, produtos, onClose, onEdit }: OrderDetailsProps) {
  return (
    <Box sx={{ width: "100%", p: 3, bgcolor: "#FDF2F8", minHeight: "100vh" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <div className="p-2 bg-pink-500 rounded-lg text-white">
            <Receipt fontSize="small" />
          </div>
          <Typography variant="h6" className="!font-bold !text-slate-800">
            Pedido #{order.cd_pedido}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Editar Pedido">
            <IconButton
              onClick={() => onEdit(order.cd_pedido)}
              className="!text-pink-600 hover:!bg-pink-50"
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Stack>
      </Stack>

      <Chip
        label={order.ds_status}
        variant="outlined"
        className={`${
          statusStyles[order.ds_status] || "!bg-gray-50"
        } !font-black !border !text-[10px] !uppercase !tracking-widest !rounded-md !mb-6`}
      />

      <Stack spacing={3}>
        <FormSection title="Dados do Cliente">
          <Typography variant="body1" className="!font-bold !text-slate-700">
            {order.cliente?.nm_cliente || "Cliente não identificado"}
          </Typography>

          <Stack spacing={0.5} className="mt-2">
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              className="text-slate-500"
            >
              <LocalPhone sx={{ fontSize: 16 }} />
              <Typography variant="body2">
                {order.cliente?.cd_telefone || "Sem contato"}
              </Typography>
            </Stack>

            {order.cliente?.dt_nascimento && (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                className="text-pink-500"
              >
                <Cake sx={{ fontSize: 16 }} />
                <Typography variant="body2" className="!font-medium">
                  Nascimento:{" "}
                  {new Date(order.cliente.dt_nascimento).toLocaleDateString(
                    "pt-BR",
                    {
                      timeZone: "UTC",
                    }
                  )}
                </Typography>
              </Stack>
            )}
          </Stack>
        </FormSection>

        <FormSection title="Itens e Observações">
          <div className="flex flex-col">
            {order.itens.map((item, index) => {
              const produto = produtos?.find(
                (p) => p.cd_produto === item.cd_produto
              );
              const imgUrl = item.ds_caminho_arte?.startsWith("blob:")
                ? item.ds_caminho_arte
                : `${API_URL}${item.ds_caminho_arte}`;

              return (
                <div
                  key={index}
                  className="flex flex-col border-b border-pink-100 last:border-0 py-4"
                >
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0">
                      {item.ds_caminho_arte ? (
                        <a
                          href={imgUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="block"
                        >
                          <Tooltip title="Clique para ampliar">
                            <img
                              src={imgUrl}
                              className="w-16 h-16 object-cover rounded-lg shadow-sm border-2 border-transparent hover:border-pink-400 transition-all cursor-zoom-in"
                            />
                          </Tooltip>
                        </a>
                      ) : (
                        <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] text-slate-400 text-center px-1">
                          Sem Arte
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <Typography
                          variant="subtitle1"
                          className="!font-bold !text-slate-800 !leading-tight truncate-multiline"
                        >
                          {produto?.nm_produto || `Produto #${item.cd_produto}`}
                        </Typography>

                        <Typography
                          variant="body1"
                          className="!font-black !text-pink-600 shrink-0"
                        >
                          R$
                          {(
                            item.qt_produto * Number(item.vl_unitario_praticado)
                          ).toFixed(2)}
                        </Typography>
                      </div>

                      <Typography
                        variant="body1"
                        className="!text-slate-500 !mt-2"
                      >
                        {item.qt_produto} unid. x R$
                        {Number(item.vl_unitario_praticado).toFixed(2)}
                      </Typography>
                    </div>
                  </div>

                  {item.ds_observacoes_item && (
                    <div className="mt-3 bg-white p-3 rounded-xl border border-pink-100 shadow-sm w-full overflow-hidden">
                      <Typography
                        variant="caption"
                        className="!text-pink-600 !uppercase !font-bold !block !mb-1"
                      >
                        Observação:
                      </Typography>
                      <Typography
                        variant="body2"
                        className="!text-slate-700 !italic !whitespace-pre-wrap !break-words"
                      >
                        {item.ds_observacoes_item}
                      </Typography>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </FormSection>

        <FormSection title="Resumo e Notas">
          <Typography
            variant="body2"
            className="!text-slate-600 !mb-4 !whitespace-pre-wrap !break-words"
          >
            {order.ds_observacoes || "Nenhuma observação geral."}
          </Typography>

          <Divider className="!my-4" />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
          >
            <Box>
              <Typography
                variant="caption"
                className="!text-slate-400 !uppercase !font-bold"
              >
                Data do Pedido
              </Typography>
              <Typography
                variant="body1"
                className="!text-slate-700 !font-medium"
              >
                {new Date(order.dt_pedido).toLocaleDateString("pt-BR")}
              </Typography>
            </Box>
            <Box className="text-right">
              <Typography
                variant="caption"
                className="!text-pink-400 !uppercase !font-bold"
              >
                Valor Total
              </Typography>
              <Typography variant="h5" className="!font-black !text-pink-600">
                R$ {Number(order.vl_total_pedido).toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </FormSection>
      </Stack>
    </Box>
  );
}

export default OrderDetails;
