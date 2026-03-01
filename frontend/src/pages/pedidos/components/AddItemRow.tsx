import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { ItemPedidoInput } from "@/types/pedido.types";
import { ProdutoPublic } from "@/types/produto.types";
import { searchProductsForAutocomplete } from "../orders.data";

import FormSection from "@/components/FormSection";
import AsyncAutoComplete from "@/components/AsyncAutoComplete";
import NumberInput from "./NumberInput";
import CurrencyInput from "./CurrencyInput";

interface AddItemRowProps {
  onAdd: (item: ItemPedidoInput) => void;
}

interface TempItemState {
  produto_id: number | "";
  quantidade: number | string;
  observacoes: string;
  preco_unitario: number | string;
  nome_produto?: string;
}

const INITIAL_TEMP_ITEM: TempItemState = {
  produto_id: "",
  quantidade: 1,
  observacoes: "",
  preco_unitario: 0,
};

function AddItemRow({ onAdd }: AddItemRowProps) {
  const [tempItem, setTempItem] = useState<TempItemState>(INITIAL_TEMP_ITEM);
  // Estado para resetar o componente Autocomplete para valores padrão após adicionar item
  const [resetKey, setResetKey] = useState(0);

  const handleProductChange = (produto: ProdutoPublic | null) => {
    setTempItem({
      ...tempItem,
      produto_id: produto ? produto.id : "",
      preco_unitario: produto ? Number(produto.preco_base) : 0,
      nome_produto: produto ? produto.nome : "",
    });
  };

  const submitAdd = () => {
    if (!tempItem.produto_id) return;
    // Converte números antes de enviar para o hook
    onAdd({
      ...tempItem,
      quantidade: Number(tempItem.quantidade) || 1,
      preco_unitario: Number(tempItem.preco_unitario) || 0,
    } as ItemPedidoInput);
    setTempItem(INITIAL_TEMP_ITEM);
    setResetKey((prev) => prev + 1);
  };

  return (
    <FormSection title="Adicionar Produto" className="flex gap-2 items-end">
      <div style={{ width: 250 }}>
        <AsyncAutoComplete<ProdutoPublic>
          key={resetKey}
          label="Produto"
          fetchFn={searchProductsForAutocomplete}
          getOptionLabel={(option) => option.nome}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChangeValue={handleProductChange}
        />
      </div>

      <NumberInput
        label="Qtd"
        size="small"
        sx={{ width: 80 }}
        value={tempItem.quantidade}
        onChangeValue={(val) => setTempItem({ ...tempItem, quantidade: val })}
        onEnter={submitAdd}
      />

      <CurrencyInput
        label="Valor Unitário"
        size="small"
        sx={{ width: 130 }}
        value={tempItem.preco_unitario}
        onChangeValue={(val) =>
          setTempItem({ ...tempItem, preco_unitario: val })
        }
        onEnter={submitAdd}
      />

      <TextField
        label="Observação"
        value={tempItem.observacoes}
        onChange={(e) =>
          setTempItem({ ...tempItem, observacoes: e.target.value })
        }
        onKeyUp={(e) => {
          if (e.key === "Enter") submitAdd();
        }}
        size="small"
        sx={{ flexGrow: 0.3 }}
        placeholder="Ex: Nome na caneca..."
      />

      <Button
        type="button"
        variant="contained"
        onClick={submitAdd}
        disabled={!tempItem.produto_id}
      >
        Adicionar
      </Button>
    </FormSection>
  );
}

export default AddItemRow;
