import { useState } from "react";
import { TextField, MenuItem, Button } from "@mui/material";
import { ProdutoPublic } from "../../../types/produto.types";
import { ItemPedidoInput } from "../../../types/pedido.types";
import FormSection from "../../../components/FormSection";

interface AddItemRowProps {
  produtos: ProdutoPublic[];
  onAdd: (item: ItemPedidoInput) => void;
}

function AddItemRow({ produtos, onAdd }: AddItemRowProps) {
  const [tempItem, setTempItem] = useState({
    cd_produto: "" as any,
    qt_produto: 1,
    ds_observacoes_item: "",
    vl_unitario_praticado: 0,
  });

  const handleProductChange = (id: number) => {
    const prod = produtos.find((p) => p.cd_produto === id);
    setTempItem({
      ...tempItem,
      cd_produto: id,
      vl_unitario_praticado: prod ? Number(prod.vl_base) : 0,
    });
  };

  const submitAdd = () => {
    if (!tempItem.cd_produto) return;
    onAdd(tempItem as ItemPedidoInput);
    setTempItem({
      cd_produto: "",
      qt_produto: 1,
      ds_observacoes_item: "",
      vl_unitario_praticado: 0,
    });
  };

  return (
    <FormSection title="Adicionar Produto" className="flex gap-2 items-end">
      <TextField
        select
        label="Produto"
        value={tempItem.cd_produto}
        onChange={(e) => handleProductChange(Number(e.target.value))}
        size="small"
        sx={{ width: 200 }}
      >
        {produtos.map((p) => (
          <MenuItem key={p.cd_produto} value={p.cd_produto}>
            {p.nm_produto}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Qtd"
        type="number"
        value={tempItem.qt_produto}
        onChange={(e) =>
          setTempItem({ ...tempItem, qt_produto: Number(e.target.value) })
        }
        size="small"
        sx={{ width: 80 }}
      />

      <TextField
        label="Valor Unitário"
        type="number"
        value={tempItem.vl_unitario_praticado}
        onChange={(e) =>
          setTempItem({
            ...tempItem,
            vl_unitario_praticado: Number(e.target.value),
          })
        }
        size="small"
        sx={{ width: 130 }}
      />

      <TextField
        label="Observação"
        value={tempItem.ds_observacoes_item}
        onChange={(e) =>
          setTempItem({ ...tempItem, ds_observacoes_item: e.target.value })
        }
        size="small"
        sx={{ flexGrow: 0.3 }}
        placeholder="Ex: Nome na caneca..."
      />

      <Button
        variant="contained"
        onClick={submitAdd}
        disabled={!tempItem.cd_produto}
      >
        Adicionar
      </Button>
    </FormSection>
  );
}

export default AddItemRow;
