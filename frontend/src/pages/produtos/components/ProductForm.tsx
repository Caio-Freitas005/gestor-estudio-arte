import { Form, useNavigation } from "react-router";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { formatBrazilianInput, parseBrazilianNumber } from "../../../utils/form.utils";
import { ProdutoPublic } from "../../../types/produto.types";
import FormSection from "../../../components/FormSection";

interface ProdutoFormProps {
  defaultValues?: ProdutoPublic;
}

function ProductForm({ defaultValues }: ProdutoFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const produto = defaultValues || ({} as ProdutoPublic);

  const [precoInput, setPrecoInput] = useState<string>(
    formatBrazilianInput(defaultValues?.preco_base || 0)
  );

  return (
    <Form method="post" className="flex flex-col gap-8 max-w-4xl">
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
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </FormSection>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting}
        className="mt-2"
        disableElevation
      >
        {isSubmitting ? "Salvando..." : "Salvar Produto"}
      </Button>
    </Form>
  );
}

export default ProductForm;
