import { useState } from "react";
import { TextField, MenuItem, Button } from "@mui/material";
import { ProdutoPublic } from "../../../types/produto.types";
import { ItemPedidoInput } from "../../../types/pedido.types";
import FormSection from "../../../components/FormSection";

interface AddItemRowProps {
  produtos: ProdutoPublic[];
  onAdd: (item: ItemPedidoInput) => void;
}

interface TempItemState {
  produto_id: number | ""; 
  quantidade: number; 
  observacoes: string;
  preco_unitario: number;
}

const INITIAL_TEMP_ITEM: TempItemState = {
  produto_id: "",
  quantidade: 1,
  observacoes: "",
  preco_unitario: 0,
};

function AddItemRow({ produtos, onAdd }: AddItemRowProps) {
  const [tempItem, setTempItem] = useState<TempItemState>(INITIAL_TEMP_ITEM);

  const handleProductChange = (id: number) => {
    const prod = produtos.find((p) => p.id === id);
    setTempItem({
      ...tempItem,
      produto_id: id,
      preco_unitario: prod ? Number(prod.preco_base) : 0,
    });
  };

  const submitAdd = () => {
    if (!tempItem.produto_id) return;
    onAdd(tempItem as ItemPedidoInput);
    setTempItem(INITIAL_TEMP_ITEM);
  };

  return (
    <FormSection title="Adicionar Produto" className="flex gap-2 items-end">
      <TextField
        select
        label="Produto"
        value={tempItem.produto_id}
        onChange={(e) => handleProductChange(Number(e.target.value))}
        size="small"
        sx={{ width: 200 }}
      >
        {produtos.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.nome}
          </MenuItem>
        ))}
      </TextField>

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
