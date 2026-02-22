import { Form } from "react-router";
import { useEffect, useState } from "react";
import { formatBrazilianInput, parseBrazilianNumber } from "../../../utils/form.utils"
import { useOrderManager } from "../hooks/useOrderManager";
import { formatDateForInput } from "../../../utils/form.utils"
import { formatNumber } from "../../../utils/format.utils";
import { PedidoPublic, StatusPedido } from "../../../types/pedido.types";
import { ClientePublic } from "../../../types/cliente.types";
import { ProdutoPublic } from "../../../types/produto.types";

import {
  Button,
  Box,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";

import AddItemRow from "../components/AddItemRow";
import ItemTable from "../components/ItemTable";
import FormSection from "../../../components/FormSection";

interface OrderFormProps {
  defaultValues?: PedidoPublic;
  clientes: ClientePublic[];
  produtos: ProdutoPublic[];
}

function OrderForm({ defaultValues, clientes, produtos }: OrderFormProps) {
  const isEditing = !!defaultValues?.id;

  // Valor numérico para cálculos (subtotal, etc)
  const [desconto, setDesconto] = useState<number>(
    defaultValues?.desconto || 0,
  );

  // Valor em texto para o input (mantém o que o usuário digita)
  const [descontoInput, setDescontoInput] = useState<string>(
    formatBrazilianInput(defaultValues?.desconto || 0),
  );

  const {
    localItems,
    addItem,
    removeItem,
    updateItem,
    saveOrder,
    handleUpload,
  } = useOrderManager(defaultValues, isEditing);

  const displayItems = isEditing ? defaultValues?.itens || [] : localItems;

  // Calcula o Subtotal em tempo real
  const subtotal = displayItems.reduce((acc, item) => {
    return acc + item.quantidade * item.preco_unitario;
  }, 0);

  // Validações e Cálculo Final
  const isDescontoInvalido = desconto > subtotal;
  const totalFinal = Math.max(0, subtotal - desconto);

  // Sincroniza se o valor mudar externamente (edição)
  useEffect(() => {
    if (defaultValues?.desconto !== undefined) {
      setDesconto(defaultValues.desconto);
      setDescontoInput(formatBrazilianInput(defaultValues.desconto));
    }
  }, [defaultValues]);

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        // Trava extra de segurança antes de enviar
        if (isDescontoInvalido) {
          return;
        }
        saveOrder(new FormData(e.currentTarget));
      }}
      className="flex flex-col gap-8"
    >
      <FormSection
        title="Informações de Identificação"
        className="grid grid-cols-4 md:grid-cols-3 gap-6"
      >
        <TextField
          select
          label="Cliente"
          name="cliente_id"
          defaultValue={defaultValues?.cliente_id || ""}
          size="small"
          required
        >
          {clientes.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.nome}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Data"
          type="date"
          name="data_pedido"
          defaultValue={formatDateForInput(defaultValues?.data_pedido)}
          size="small"
          required
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </FormSection>

      <FormSection
        title="Status e Observações"
        className="grid grid-cols-3 md:grid-cols-3 gap-6"
      >
        <TextField
          select
          label="Status"
          name="status"
          defaultValue={defaultValues?.status || "Aguardando Pagamento"}
          size="small"
          required
        >
          {Object.values(StatusPedido).map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Observações"
          name="observacoes"
          defaultValue={defaultValues?.observacoes}
          size="small"
          multiline
        />
      </FormSection>

      <AddItemRow produtos={produtos} onAdd={addItem} />

      <ItemTable
        items={displayItems}
        produtos={produtos}
        onUpload={handleUpload}
        onRemove={removeItem}
        onUpdate={updateItem}
      />

      <FormSection title="Fechamento do Pedido">
        <div className="flex flex-wrap items-center gap-12">
          <TextField
            label="Desconto (R$)"
            name="desconto"
            type="text"
            size="small"
            value={descontoInput} // Usa a string direta
            onChange={(e) => {
              const stringValue = e.target.value;

              // Permite apenas números e uma vírgula ou ponto
              if (
                /^[0-9]*[.,]?[0-9]*$/.test(stringValue) ||
                stringValue === ""
              ) {
                setDescontoInput(stringValue); // Atualiza o que o usuário vê (mantendo a vírgula)

                const numValue = parseBrazilianNumber(stringValue);
                setDesconto(numValue); // Atualiza o número para o cálculo do total
              }
            }}
            error={isDescontoInvalido}
            helperText={
              isDescontoInvalido ? "Desconto maior que o subtotal" : ""
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
                inputProps: { min: 0, step: "0.01" },
              },
            }}
            sx={{ width: "200px" }}
          />

          <Box className="flex flex-col pb-1">
            <Typography
              variant="caption"
              className="!text-slate-400 !uppercase !font-bold"
            >
              Subtotal dos Itens
            </Typography>
            <Typography variant="h6" className="!text-slate-600">
              R$ {formatNumber(subtotal)}
            </Typography>
          </Box>

          <Box className="flex flex-col pb-1">
            <Typography
              variant="caption"
              className="!text-pink-400 !uppercase !font-bold"
            >
              Total do Pedido
            </Typography>
            <Typography variant="h4" className="!font-black !text-pink-600">
              R$ {formatNumber(totalFinal)}
            </Typography>
          </Box>
        </div>
      </FormSection>

      <Button
        type="submit"
        variant="contained"
        style={{ maxWidth: "1050px" }}
        disabled={isDescontoInvalido}
      >
        Salvar Pedido
      </Button>
    </Form>
  );
}

export default OrderForm;
