import { Form, useNavigation } from "react-router";
import { Button, TextField } from "@mui/material";
import { ProdutoPublic } from "../../../types/produto.types";
import FormSection from "../../../components/FormSection";

interface ProdutoFormProps {
  defaultValues?: ProdutoPublic;
}

function ProductForm({ defaultValues }: ProdutoFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const produto = defaultValues || ({} as ProdutoPublic);

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
          defaultValue={produto.preco_base ?? ""}
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
