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
  
  // Estado local para evitar múltiplas requisições durante a digitação
  const [min, setMin] = useState(searchParams.get(paramMin) || "");
  const [max, setMax] = useState(searchParams.get(paramMax) || "");

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams((prev) => {
        // Atualiza Mínimo
        if (min) prev.set(paramMin, min);
        else prev.delete(paramMin);

        // Atualiza Máximo
        if (max) prev.set(paramMax, max);
        else prev.delete(paramMax);

        // Se houve mudança nos filtros, volta para a primeira página
        if (min !== (searchParams.get(paramMin) || "") || max !== (searchParams.get(paramMax) || "")) {
          prev.set("page", "0");
        }
        return prev;
      });
    }, 600);

    return () => clearTimeout(handler);
  }, [min, max, paramMin, paramMax, setSearchParams, searchParams]);

  return (
    <div className="flex items-center gap-2 px-3">
      <Typography variant="caption" className="font-bold text-gray-400 uppercase tracking-tight">
        {label}
      </Typography>
      <TextField
        size="small"
        placeholder="Mín"
        type="number"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        sx={{ width: 120, }}
      />
      <TextField
        size="small"
        placeholder="Máx"
        type="number"
        value={max}
        onChange={(e) => setMax(e.target.value)}
        sx={{ width: 120, }}
      />
    </div>
  );
}

export default RangeFilter;