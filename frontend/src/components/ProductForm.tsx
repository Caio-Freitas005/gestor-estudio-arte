import { Form, useNavigation } from "react-router";
import { Box, Button, TextField, Typography } from "@mui/material";
import { ProdutoPublic } from "../types/produto.types";

interface ProdutoFormProps {
  defaultValues?: ProdutoPublic;
}

function ProductForm({ defaultValues }: ProdutoFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const data = defaultValues || ({} as ProdutoPublic);

  return (
    <Box
      component={Form}
      method="post"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: 2,
        border: "1px solid #ccc",
        borderRadius: 1,
        maxWidth: 500,
      }}
    >
      <Typography variant="h6">
        {data.cd_produto ? "Editar Produto" : "Cadastrar Novo Produto"}
      </Typography>

      <TextField
        label="Nome do Produto"
        name="nm_produto"
        required
        defaultValue={data.nm_produto}
        variant="outlined"
        size="small"
      />

      <TextField
        label="Descrição"
        name="ds_produto"
        defaultValue={data.ds_produto ?? ""}
        variant="outlined"
        size="small"
        multiline
        rows={3}
      />

      <TextField
        label="Valor Base (R$ 00.00)"
        name="vl_base"
        defaultValue={data.vl_base ?? ""}
        variant="outlined"
        size="small"
      />

      <TextField
        label="Unidade de Medida"
        name="ds_unidade_medida"
        defaultValue={data.ds_unidade_medida ?? ""}
        variant="outlined"
        size="small"
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Salvando..." : "Salvar Produto"}
      </Button>
    </Box>
  );
}

export default ProductForm;
