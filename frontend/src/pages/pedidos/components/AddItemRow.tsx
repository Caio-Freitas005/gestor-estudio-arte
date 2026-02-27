import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { ItemPedidoInput } from "../../../types/pedido.types";
import { ProdutoPublic } from "../../../types/produto.types";
import { searchProductsForAutocomplete } from "../orders.data";
import FormSection from "../../../components/FormSection";
import AsyncAutocomplete from "../../../components/AsyncAutoComplete";

interface AddItemRowProps {
  onAdd: (item: ItemPedidoInput) => void;
}

interface TempItemState {
  produto_id: number | "";
  quantidade: number;
  observacoes: string;
  preco_unitario: number;
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
    onAdd(tempItem as ItemPedidoInput);
    setTempItem(INITIAL_TEMP_ITEM);
    setResetKey((prev) => prev + 1);
  };

  return (
    <FormSection title="Adicionar Produto" className="flex gap-2 items-end">
      <div style={{ width: 250 }}>
        <AsyncAutocomplete<ProdutoPublic>
          key={resetKey}
          label="Produto"
          fetchFn={searchProductsForAutocomplete}
          getOptionLabel={(option) => option.nome}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChangeValue={handleProductChange}
        />
      </div>

      <TextField
        label="Qtd"
        type="number"
        value={tempItem.quantidade}
        onChange={(e) =>
          setTempItem({ ...tempItem, quantidade: Number(e.target.value) })
        }
        size="small"
        sx={{ width: 80 }}
      />

      <TextField
        label="Valor Unitário"
        type="number"
        value={tempItem.preco_unitario}
        onChange={(e) =>
          setTempItem({
            ...tempItem,
            preco_unitario: Number(e.target.value),
          })
        }
        onFocus={(e) => e.target.select()}
        size="small"
        sx={{ width: 130 }}
      />

      <TextField
        label="Observação"
        value={tempItem.observacoes}
        onChange={(e) =>
          setTempItem({ ...tempItem, observacoes: e.target.value })
        }
        size="small"
        sx={{ flexGrow: 0.3 }}
        placeholder="Ex: Nome na caneca..."
      />

      <Button
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
