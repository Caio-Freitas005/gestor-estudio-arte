import { useState, useEffect, useRef, HTMLAttributes, ReactNode } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";

interface AsyncAutocompleteProps<T> {
  name?: string; // O nome do campo para o FormData (ex: "cliente_id")
  label: string; // O rótulo do campo (ex: "Cliente")
  fetchFn: (query: string) => Promise<T[]>; // A função que vai chamar a API
  getOptionLabel: (option: T) => string; // Como extrair o nome para mostrar na lista
  isOptionEqualToValue: (option: T, value: T) => boolean; // Como comparar se dois itens são o mesmo (ex: pelo ID)
  defaultValue?: T | null; // O valor inicial (para edição de pedidos)
  required?: boolean;
  onChangeValue?: (value: T | null) => void; // Avisa o pai da mudança no valor
  renderOption?: (props: HTMLAttributes<HTMLLIElement>, option: T) => ReactNode; // Para customizar detalhes na lista suspensa
}

function AsyncAutoComplete<T>({
  name,
  label,
  fetchFn,
  getOptionLabel,
  isOptionEqualToValue,
  defaultValue = null,
  required = false,
  onChangeValue,
  renderOption,
}: AsyncAutocompleteProps<T>) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly T[]>([]);
  const [loading, setLoading] = useState(false);

  // O valor selecionado (o objeto inteiro, ex: Cliente)
  const [value, setValue] = useState<T | null>(defaultValue);

  // O texto que o usuário está digitando
  const [inputValue, setInputValue] = useState("");

  // Guarda a última pesquisa que foi feita com sucesso.
  // Começa como null para garantir que a 1ª vez (quando está vazio "") ele busca
  const lastFetchedQuery = useRef<string | null>(null);

  useEffect(() => {
    let active = true; // Previne atualizações se o componente for destruído

    // Para de pesquisar se não estiver aberto
    if (!open) {
      return;
    }

    // Debounce
    const handler = setTimeout(async () => {
      // Se o texto atual for igual à última pesquisa, cancela
      if (inputValue === lastFetchedQuery.current) {
        return;
      }

      setLoading(true);
      try {
        const results = await fetchFn(inputValue);
        if (active) {
          setOptions(results);
          // Atualiza a memória com o novo texto pesquisado
          lastFetchedQuery.current = inputValue;
        }
      } catch (error) {
        console.error("Erro ao buscar opções:", error);
      } finally {
        if (active) setLoading(false);
      }
    }, 500);

    // Se o inputValue mudar antes dos 500ms, limpa o timer anterior
    return () => {
      active = false;
      clearTimeout(handler);
    };
  }, [inputValue, open, fetchFn]);

  return (
    <>
      {/* Input invisível que o FormData vai ler somente quando clicar em salvar */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={value ? (value as any).id : ""}
        />
      )}

      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        value={value}
        onChange={(_event: any, newValue: T | null) => {
          setValue(newValue);
          // Avisa o componente pai que o valor mudou
          if (onChangeValue) onChangeValue(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        isOptionEqualToValue={isOptionEqualToValue}
        getOptionLabel={getOptionLabel}
        options={options}
        loading={loading}
        loadingText="Buscando..."
        noOptionsText="Nenhum resultado"
        renderOption={renderOption}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            size="small"
            required={required && !value} // O campo fica vermelho se for obrigatório e estiver vazio
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />
    </>
  );
}

export default AsyncAutoComplete;
