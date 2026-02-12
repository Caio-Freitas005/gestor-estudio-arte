import { useSearchParams } from "react-router";
import { TextField } from "@mui/material";

function DateFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const date = searchParams.get("data_pedido") || "";

  const handleChange = (val: string) => {
    setSearchParams((prev) => {
      if (val) prev.set("data_pedido", val);
      else prev.delete("data_pedido");
      
      prev.set("page", "0"); // Sempre reseta a página ao filtrar
      return prev;
    });
  };

  return (
    <TextField
      label="Data"
      type="date"
      size="small"
      value={date}
      onChange={(e) => handleChange(e.target.value)}
      slotProps={{ inputLabel: { shrink: true } }}
    />
  );
}

export default DateFilter;