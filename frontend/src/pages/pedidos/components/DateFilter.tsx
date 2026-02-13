import { useSearchParams } from "react-router";
import { TextField } from "@mui/material";

interface DateFilterProps {
  label: string;
  param: string;
}

function DateFilter({ label, param }: DateFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const date = searchParams.get(param) || "";

  const handleChange = (val: string) => {
    setSearchParams((prev) => {
      if (val) {
        prev.set(param, val);
      } else {
        prev.delete(param);
      }

      prev.set("page", "0"); // Sempre reseta a página ao filtrar
      return prev;
    });
  };

  return (
    <TextField
      label={label}
      type="date"
      size="small"
      value={date}
      onChange={(e) => handleChange(e.target.value)}
      slotProps={{ inputLabel: { shrink: true } }}
    />
  );
}

export default DateFilter;
