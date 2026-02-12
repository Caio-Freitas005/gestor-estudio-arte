import { useState, useEffect, ReactNode } from "react";
import { useSearchParams } from "react-router";
import { TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";

interface SearchHeaderProps {
  placeholder?: string;
  children?: ReactNode;
}

function Searchbar({ placeholder = "Buscar...", children}: SearchHeaderProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  // Cria um estado local para o texto do input (para ser instantâneo na tela)
  const [searchTerm, setSearchTerm] = useState(urlQuery);

  // Sincroniza se a URL mudar externamente (ex: botão voltar)
  useEffect(() => {
    setSearchTerm(urlQuery);
  }, [urlQuery]);

  // Guarda o texto no estado local até o tempo determinado, depois manda pra url
  useEffect(() => {
    if (searchTerm === urlQuery) return;

    const handler = setTimeout(() => {
      setSearchParams((prev) => {
        if (searchTerm) prev.set("q", searchTerm);
        else prev.delete("q");
        prev.set("page", "0");
        return prev;
      });
    }, 500); // 500ms de espera

    return () => clearTimeout(handler);
  }, [searchTerm, urlQuery, setSearchParams]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      {/*Campo de busca global*/}
      <div className="flex-grow">
      <TextField
        size="small"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" className="text-gray-400" />
              </InputAdornment>
            ),
          },
        }}
      />
      </div>

      {/* Container de Filtros Específicos */}
      <div className="flex flex-wrap items-center gap-3">
        {children}
      </div>
    </div>
  );
}

export default Searchbar;
