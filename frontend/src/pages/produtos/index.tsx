import { useLoaderData, Link, Form } from "react-router";
import { Typography, Button } from "@mui/material";
import { ProdutoPublic } from "../../types/produto.types";

function ProductsListPage() {
  const products = useLoaderData() as ProdutoPublic[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" component="h1" className="text-white-800">
          Gestão de Produtos
        </Typography>

        <Button
          component={Link}
          to="cadastrar"
          variant="contained"
          color="primary"
          disableElevation
        >
          Cadastrar Produto
        </Button>
      </div>

      <hr className="border-gray-200" />

      <div>
        <Typography variant="h5" className="mb-4 text-white-700">
          Produtos Cadastrados
        </Typography>

        {products.length === 0 ? (
          <p className="text-gray-500 italic">
            Nenhum produto cadastrado ainda.
          </p>
        ) : (
          <ul className="grid gap-3">
            {products.map((product) => (
              <li
                key={product.cd_produto}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-yellow-500 text-lg">
                    {product.nm_produto}
                  </span>
                  <span className="text-sm text-green-500">
                    Descrição:{" "}
                    {product.ds_produto ? `${product.ds_produto}` : "N/A"}
                  </span>
                  <span className="text-sm text-green-500">
                    Valor Base:{" "}
                    {product.vl_base ? `R$ ${product.vl_base}` : "N/A"}
                  </span>
                  <span className="text-sm text-green-500">
                    Unidade de Medida:{" "}
                    {product.ds_unidade_medida
                      ? `${product.ds_unidade_medida}`
                      : "N/A"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    component={Link}
                    to={`${product.cd_produto}/editar`}
                    size="small"
                    color="warning"
                    variant="outlined"
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
                  >
                    <Button
                      type="submit"
                      size="small"
                      color="error"
                      variant="outlined"
                    >
                      Excluir
                    </Button>
                  </Form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProductsListPage;
