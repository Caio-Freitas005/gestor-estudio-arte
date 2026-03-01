import { TextField, TextFieldProps, InputAdornment } from "@mui/material";

type CurrencyInputProps = Omit<TextFieldProps, "onChange"> & {
  value: number | string;
  onChangeValue: (val: number | string) => void;
  onEnter?: () => void;
};

function CurrencyInput({
  value,
  onChangeValue,
  onEnter,
  ...props
}: CurrencyInputProps) {
  return (
    <TextField
      {...props}
      type="number"
      value={value}
      // Impede números negativos
      onChange={(e) => {
        const val = e.target.value;
        if (val === "" || Number(val) >= 0) onChangeValue(val);
      }}
      // Se apagar tudo e clicar fora, volta para 0
      onBlur={() => {
        if (value === "") onChangeValue(0);
      }}
      onKeyDown={(e) => {
        if (["-", "+", "e", "E"].includes(e.key)) e.preventDefault();
      }}
      onKeyUp={(e) => {
        if (e.key === "Enter" && onEnter) onEnter();
      }}
      onFocus={(e) => {
        (e.target as HTMLInputElement).select();
      }}
      slotProps={{
        ...props.slotProps,
        input: {
          startAdornment: <InputAdornment position="start">R$</InputAdornment>,
          ...props.slotProps?.input, // preserva se passar outros adornments
        },
        // Adiciona trava visual do HTML5
        htmlInput: { min: 0, step: "0.01", ...props.slotProps?.htmlInput },
      }}
    />
  );
}

export default CurrencyInput;
