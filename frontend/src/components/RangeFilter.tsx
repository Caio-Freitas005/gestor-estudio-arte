import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { TextField, Typography } from "@mui/material";

interface RangeFilterProps {
  label: string;
  paramMin: string;
  paramMax: string;
}

function RangeFilter({ label, paramMin, paramMax }: RangeFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentMin = searchParams.get(paramMin) || "";
  const currentMax = searchParams.get(paramMax) || "";

  // Estado local
  const [min, setMin] = useState(currentMin);
  const [max, setMax] = useState(currentMax);

  useEffect(() => {
    // Só faz update se os valores realmente mudaram
    if (min === currentMin && max === currentMax) {
      return;
    }

    const handler = setTimeout(() => {
      setSearchParams((prev) => {
        // Atualiza Mínimo
        if (min) prev.set(paramMin, min);
        else prev.delete(paramMin);

        // Atualiza Máximo
        if (max) prev.set(paramMax, max);
        else prev.delete(paramMax);

        prev.set("page", "0");
        return prev;
      });
    }, 600);

    return () => clearTimeout(handler);
  }, [min, max, currentMin, currentMax, paramMin, paramMax, setSearchParams]);

  return (
    <div className="flex items-center gap-2 px-3">
      <Typography
        variant="caption"
        className="font-bold text-gray-400 uppercase tracking-tight"
      >
        {label}
      </Typography>
      <TextField
        size="small"
        placeholder="Mín"
        type="number"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        sx={{ width: 90 }}
      />
      <TextField
        size="small"
        placeholder="Máx"
        type="number"
        value={max}
        onChange={(e) => setMax(e.target.value)}
        sx={{ width: 90 }}
      />
    </div>
  );
}

export default RangeFilter;
