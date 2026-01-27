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

  const data = defaultValues || ({} as ProdutoPublic);

  return (
    <Form method="post" className="flex flex-col gap-8 max-w-4xl">
      <FormSection
        title="Informações de Identificação"
        className="grid grid-cols-1 gap-8"
      >
        <TextField
          label="Nome do Produto"
          name="nm_produto"
          required
          defaultValue={data.nm_produto}
          variant="outlined"
          size="small"
          fullWidth
        />

        <TextField
          label="Descrição"
          name="ds_produto"
          defaultValue={data.ds_produto ?? ""}
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
          label="Valor Base (R$)"
          name="vl_base"
          required
          defaultValue={data.vl_base ?? ""}
          variant="outlined"
          size="small"
          fullWidth
        />

        <TextField
          label="Unidade Medida"
          name="ds_unidade_medida"
          defaultValue={data.ds_unidade_medida ?? ""}
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
