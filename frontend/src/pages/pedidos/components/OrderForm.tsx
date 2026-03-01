import { Form, useNavigation } from "react-router";
import { useState } from "react";
import { useOrderManager } from "../hooks/useOrderManager";
import { useAppToast } from "@/hooks/useAppToast";
import { formatDateForInput } from "@/utils/form.utils";
import { formatNumber, formatPhone } from "@/utils/format.utils";
import { PedidoPublic, StatusPedido } from "@/types/pedido.types";
import { ClientePublic } from "@/types/cliente.types";
import { searchClientsForAutocomplete } from "../orders.data";

import { formatBrazilianInput, parseBrazilianNumber } from "@/utils/form.utils";

import {
  Button,
  Box,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";

import AddItemRow from "./AddItemRow";
import ItemTable from "./ItemTable";
import FormSection from "@/components/FormSection";
import AsyncAutoComplete from "@/components/AsyncAutoComplete";
import toast from "react-hot-toast";

interface OrderFormProps {
  defaultValues?: PedidoPublic;
}

function OrderForm({ defaultValues }: OrderFormProps) {
  useAppToast();

  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";

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
    return acc + Number(item.quantidade) * Number(item.preco_unitario);
  }, 0);

  const isPedidoVazio = displayItems.length === 0;
  const isTotalZerado = subtotal - desconto <= 0 && !isPedidoVazio;
  const isDescontoInvalido = desconto > subtotal;
  const totalFinal = Math.max(0, subtotal - desconto);
  const hasError = isDescontoInvalido || isTotalZerado || isPedidoVazio;

  return (
    <Form
      onKeyDown={(e) => {
        if (
          e.key === "Enter" &&
          (e.target as HTMLElement).tagName !== "TEXTAREA"
        ) {
          e.preventDefault();
        }
      }}
      onSubmit={(e) => {
        e.preventDefault();
        // Trava extra de segurança antes de enviar
        if (isDescontoInvalido) {
          toast.error(
            "O desconto não pode ser maior que o subtotal do pedido!",
          );
          return;
        }
        if (isPedidoVazio) {
          toast.error("O pedido não pode estar vazio!");
          return;
        }
        if (isTotalZerado) {
          toast.error("O total do pedido não pode ser R$ 0,00!");
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
        <div className="md:col-span-1 col-span-2">
          <AsyncAutoComplete<ClientePublic>
            name="cliente_id"
            label="Cliente"
            // Se estiver editando um pedido, preenche o cliente atual
            defaultValue={defaultValues?.cliente || null}
            fetchFn={searchClientsForAutocomplete}
            // Diz ao componente como mostrar o nome do cliente na lista
            getOptionLabel={(option) => option.nome}
            // Diz como ele sabe se dois clientes são o mesmo
            isOptionEqualToValue={(option, value) => option.id === value.id}
            required
            // Customiza como a lista suspensa é desenhada
            renderOption={(props, option) => {
              // Separa a key do resto das propriedades
              const { key, ...optionProps } = props as any;

              return (
                <li key={option.id} {...optionProps}>
                  <div className="flex flex-col py-1">
                    <span className="font-medium text-slate-800 leading-tight">
                      {option.nome}
                    </span>
                    <span className="text-[13px] text-slate-400 mt-0.5">
                      {option.telefone
                        ? `📞 ${formatPhone(option.telefone)}`
                        : option.email
                          ? `✉️ ${option.email}`
                          : `ID #${option.id}`}
                    </span>
                  </div>
                </li>
              );
            }}
          />
        </div>

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

      <AddItemRow onAdd={addItem} />

      <ItemTable
        items={displayItems}
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
              }
            }}
            onBlur={() => {
              // Só atualiza o estado quando sai do campo
              const numValue = parseBrazilianNumber(descontoInput);
              setDesconto(numValue);
            }}
            onKeyDown={(e) => {
              // Se apertar Enter, também atualiza o cálculo
              if (e.key === "Enter") {
                const numValue = parseBrazilianNumber(descontoInput);
                setDesconto(numValue);
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
        disabled={hasError}
      >
        {isSubmitting ? "Processando Pedido..." : "Salvar Pedido"}
      </Button>
    </Form>
  );
}

export default OrderForm;
