import { useSearchParams } from "react-router";
import { MenuItem, Select, FormControl } from "@mui/material";
import { StatusPedido } from "../../../types/pedido.types"; 

function StatusFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") || "";

  const handleChange = (value: string) => {
    setSearchParams((prev) => {
      if (value) prev.set("status", value);
      else prev.delete("status");
      
      prev.set("page", "0");
      return prev;
    });
  };

  // Transforma o Enum num Array de strings para mapear os itens
  const statusOptions = Object.values(StatusPedido);

  return (
    <FormControl size="small" sx={{ minWidth: 180 }}>
      <Select
        value={currentStatus}
        onChange={(e) => handleChange(e.target.value as string)}
        displayEmpty
      >
        <MenuItem value="">Todos os Status</MenuItem>
        {statusOptions.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default StatusFilter;