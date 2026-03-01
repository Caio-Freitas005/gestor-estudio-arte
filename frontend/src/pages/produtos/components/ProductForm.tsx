import { Form } from "react-router";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useAppToast } from "../../../hooks/useAppToast";
import {
  formatBrazilianInput,
  parseBrazilianNumber,
} from "../../../utils/form.utils";
import { ProdutoPublic } from "../../../types/produto.types";
import FormSection from "../../../components/FormSection";
import toast from "react-hot-toast";

interface ProdutoFormProps {
  defaultValues?: ProdutoPublic;
}

function ProductForm({ defaultValues }: ProdutoFormProps) {
  useAppToast();

  const produto = defaultValues || ({} as ProdutoPublic);

  const [precoInput, setPrecoInput] = useState<string>(
    formatBrazilianInput(defaultValues?.preco_base || 0),
  );

  return (
    <Form
      method="post"
      className="flex flex-col gap-8 max-w-4xl"
      onSubmit={(e) => {
        const precoNum = parseBrazilianNumber(precoInput);
        if (precoNum <= 0) {
          e.preventDefault();
          toast.error("O preço base do produto deve ser maior que R$ 0,00!");
        }
      }}
    >
      <FormSection
        title="Informações de Identificação"
        className="grid grid-cols-1 gap-8"
      >
        <TextField
          label="Nome do Produto"
          name="nome"
          required
          defaultValue={produto.nome}
          variant="outlined"
          size="small"
          fullWidth
          slotProps={{
            htmlInput: {
              pattern: ".*\\S+.*",
              title: "O nome não pode conter apenas espaços em branco",
            },
          }}
        />

        <TextField
          label="Descrição"
          name="descricao"
          defaultValue={produto.descricao ?? ""}
          variant="outlined"
          size="small"
          multiline
          rows={3}
          fullWidth
        />
      </FormSection>

      <FormSection
        title="Valor e Medida"
        className="grid grid-cols-4 md:grid-cols-2 gap-6"
      >
        <TextField
          label="Preço Base (R$)"
          name="preco_base"
          required
          type="text"
          value={precoInput}
          onChange={(e) => {
            const val = e.target.value;
            if (/^[0-9]*[.,]?[0-9]*$/.test(val) || val === "") {
              setPrecoInput(val);
            }
          }}
          variant="outlined"
          size="small"
          fullWidth
        />

        <TextField
          label="Unidade Medida"
          name="unidade_medida"
          defaultValue={produto.unidade_medida ?? ""}
          variant="outlined"
          size="small"
          fullWidth
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { maxLength: 20 },
          }}
        />
      </FormSection>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        className="mt-2"
        disableElevation
      >
        Salvar Produto
      </Button>
    </Form>
  );
}

export default ProductForm;
