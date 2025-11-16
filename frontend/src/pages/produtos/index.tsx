import { useLoaderData, Link, Form } from "react-router";
import { Box, Typography, Button } from "@mui/material";
import { getProducts } from "../../services/products.service";
import { ProdutoPublic } from "../../types/produto.types";

export const productsListLoader = () => getProducts();

function ProductsListPage() {
  const products = useLoaderData() as ProdutoPublic[];

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Gestão de Produtos
        </Typography>

        <Button
          component={Link}
          to="cadastrar"
          variant="contained"
          color="primary"
        >
          Cadastrar Produto
        </Button>
      </Box>

      <hr style={{ margin: "2rem 0" }} />

      <Typography variant="h5" gutterBottom>
        Produtos Cadastrados
      </Typography>

      {products.length === 0 ? (
        <p>Nenhum produto cadastrado ainda.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.cd_produto}>
              <strong>{product.nm_produto}</strong> (Valor Base:{" "}
              {product.vl_base || "N/A"})
              <Button
                component={Link}
                to={`${product.cd_produto}/editar`}
                size="small"
                color="warning"
                style={{ marginLeft: "1rem" }}
              >
                Editar
              </Button>
              <Form
                method="post"
                action={`${product.cd_produto}/excluir`}
                onSubmit={(e) => {
                  if (
                    !window.confirm(
                      "Tem certeza que deseja excluir este produto?"
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
                style={{ display: "inline", marginLeft: "1rem" }}
              >
                <Button type="submit" size="small" color="error">
                  Excluir
                </Button>
              </Form>
            </li>
          ))}
        </ul>
      )}
    </Box>
  );
}

export default ProductsListPage;
