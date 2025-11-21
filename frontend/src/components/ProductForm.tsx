import { Form, useNavigation } from "react-router";
import { Button, TextField, Typography } from "@mui/material";
import { ProdutoPublic } from "../types/produto.types";

interface ProdutoFormProps {
  defaultValues?: ProdutoPublic;
}

function ProductForm({ defaultValues }: ProdutoFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const data = defaultValues || ({} as ProdutoPublic);

  return (
    <Form
      method="post"
      className="flex flex-col justify-center gap-4 p-6 border border-gray-200 rounded-lg shadow-sm bg-white max-w-lg"
    >
      <Typography variant="h6" className="mb-2 text-gray-700">
        {data.cd_produto ? "Editar Produto" : "Cadastrar Novo Produto"}
      </Typography>

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

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Valor Base (R$)"
          name="vl_base"
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
      </div>

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
