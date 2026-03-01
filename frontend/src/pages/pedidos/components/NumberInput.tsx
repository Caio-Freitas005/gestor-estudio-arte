import { TextField, TextFieldProps } from "@mui/material";

type NumberInputProps = Omit<TextFieldProps, "onChange"> & {
  value: number | string;
  min?: number;
  onChangeValue: (val: number | string) => void;
  onEnter?: () => void;
};

function NumberInput({
  value,
  min = 1,
  onChangeValue,
  onEnter,
  ...props
}: NumberInputProps) {
  return (
    <TextField
      {...props}
      type="number"
      value={value}
      // Permite apagar temporariamente (string vazia) e ignora o sinal de menos
      onChange={(e) => {
        const val = e.target.value;
        if (val === "" || Number(val) >= 0) onChangeValue(val);
      }}
      // Quando tira o foco do input, se estiver vazio ou for 0, volta para 1
      onBlur={() => {
        if (!value || Number(value) < min) onChangeValue(min);
      }}
      // Impede o uso das teclas no input
      onKeyDown={(e) => {
        if (["-", "+", "e", "E"].includes(e.key)) e.preventDefault();
      }}
      // Se apertar Enter, adiciona o item em vez de salvar o pedido
      onKeyUp={(e) => {
        if (e.key === "Enter" && onEnter) onEnter();
      }}
      slotProps={{
        ...props.slotProps,
        htmlInput: { min, ...props.slotProps?.htmlInput },
      }}
    />
  );
}

export default NumberInput;
