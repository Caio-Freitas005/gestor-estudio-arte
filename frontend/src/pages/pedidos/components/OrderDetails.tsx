import { PedidoPublic } from "../../../types/pedido.types";
import { ProdutoPublic } from "../../../types/produto.types";
import { statusStyles } from "..";
import {
  formatPhone,
  formatDate,
  formatNumber,
} from "../../../utils/format.utils";

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
  pedido: PedidoPublic;
  produtos: ProdutoPublic[];
  onClose: () => void;
  onEdit: (id: number) => void;
}

function OrderDetails({
  pedido,
  produtos,
  onClose,
  onEdit,
}: OrderDetailsProps) {
  // Calcula o Subtotal somando os itens
  const subtotal = pedido.itens.reduce((acc, item) => {
    return acc + item.quantidade * item.preco_unitario;
  }, 0);

  // Garante que o desconto é tratado como número (caso venha null/undefined)
  const desconto = pedido.desconto || 0;

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
            Pedido #{pedido.id}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Editar Pedido">
            <IconButton
              onClick={() => onEdit(pedido.id)}
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
        label={pedido.status}
        variant="outlined"
        className={`${
          statusStyles[pedido.status] || "!bg-gray-50"
        } !font-black !border !text-[10px] !uppercase !tracking-widest !rounded-md !mb-6`}
      />

      <Stack spacing={3}>
        <FormSection title="Dados do Cliente">
          <Typography variant="body1" className="!font-bold !text-slate-700">
            {pedido.cliente?.nome || "Cliente não identificado"}
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
                {formatPhone(pedido.cliente?.telefone) || "Sem contato"}
              </Typography>
            </Stack>

            {pedido.cliente?.data_nascimento && (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                className="text-pink-500"
              >
                <Cake sx={{ fontSize: 16 }} />
                <Typography variant="body2" className="!font-medium">
                  Nascimento: {formatDate(pedido.cliente.data_nascimento)}
                </Typography>
              </Stack>
            )}
          </Stack>
        </FormSection>

        <FormSection title="Itens e Observações">
          <div className="flex flex-col">
            {pedido.itens.map((item, index) => {
              const produto = produtos?.find((p) => p.id === item.produto_id);
              const imgUrl = item.caminho_arte?.startsWith("blob:")
                ? item.caminho_arte
                : `${API_URL}${item.caminho_arte}`;

              return (
                <div
                  key={index}
                  className="flex flex-col border-b border-pink-100 last:border-0 py-4"
                >
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0">
                      {item.caminho_arte ? (
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
                          {produto.nome}
                        </Typography>

                        <Typography
                          variant="body1"
                          className="!font-black !text-pink-600 shrink-0"
                        >
                          R${" "}
                          {formatNumber(item.quantidade * item.preco_unitario)}
                        </Typography>
                      </div>

                      <Typography
                        variant="body1"
                        className="!text-slate-500 !mt-2"
                      >
                        {item.quantidade} unid. x R${" "}
                        {formatNumber(item.preco_unitario)}
                      </Typography>
                    </div>
                  </div>

                  {item.observacoes && (
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
                        {item.observacoes}
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
            {pedido.observacoes || "Nenhuma observação geral."}
          </Typography>

          <Divider className="!my-4" />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
          >
            <Stack spacing={2}>
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
                  {formatDate(pedido.data_pedido)}
                </Typography>
              </Box>
              {pedido.data_conclusao && (
                <Box>
                  <Typography
                    variant="caption"
                    className="!text-slate-400 !uppercase !font-bold"
                  >
                    Data de Conclusão
                  </Typography>
                  <Typography
                    variant="body1"
                    className="!text-slate-700 !font-medium"
                  >
                    {formatDate(pedido.data_conclusao)}
                  </Typography>
                </Box>
              )}
            </Stack>

            <Box className="text-right">
              <Stack spacing={0.5} alignItems="flex-end">
                <Typography variant="body2" className="!text-slate-500">
                  Subtotal: R$ {formatNumber(subtotal)}
                </Typography>

                {desconto > 0 && (
                  <Typography
                    variant="body2"
                    className="!text-red-500 !font-bold"
                  >
                    Desconto: - R$ {formatNumber(desconto)}
                  </Typography>
                )}

                <Box className="mt-2">
                  <Typography
                    variant="caption"
                    className="!text-pink-400 !uppercase !font-bold block"
                  >
                    Valor Total
                  </Typography>
                  <Typography
                    variant="h5"
                    className="!font-black !text-pink-600"
                  >
                    R$ {formatNumber(pedido.total)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </FormSection>
      </Stack>
    </Box>
  );
}

export default OrderDetails;
