import { useLoaderData, Link, Form } from "react-router";
import { Typography, Button } from "@mui/material";
import { ClientePublic } from "../../types/cliente.types";

function ClientsListPage() {
  const clients = useLoaderData() as ClientePublic[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" component="h1" className="text-white-800">
          Gestão de Clientes
        </Typography>

        <Button
          component={Link}
          to="cadastrar"
          variant="contained"
          color="primary"
          disableElevation
        >
          Cadastrar Cliente
        </Button>
      </div>

      <hr className="border-gray-200" />

      <div>
        <Typography variant="h5" className="mb-4 text-white-700">
          Clientes Cadastrados
        </Typography>

        {clients.length === 0 ? (
          <p className="text-white-500 italic">
            Nenhum cliente cadastrado ainda.
          </p>
        ) : (
          <ul className="grid gap-3">
            {clients.map((client) => (
              <li
                key={client.cd_cliente}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-yellow-500 text-lg">
                    Nome: {client.nm_cliente}
                  </span>
                  <span className="text-sm text-blue-500">
                    Telefone: {client.cd_telefone || "N/A"}
                  </span>
                  <span className="text-sm text-purple-500">
                    Email: {client.nm_email || "N/A"}
                  </span>
                  <span className="text-sm text-green-500">
                    Data de Nascimento:{" "}
                    {client.dt_nascimento
                      ? new Date(client.dt_nascimento).toLocaleDateString(
                          "pt-BR",
                          {
                            timeZone: "UTC",
                          }
                        )
                      : "N/A"}
                  </span>
                  <span className="text-sm text-green-500">
                    Observações: {client.ds_observacoes || "N/A"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    component={Link}
                    to={`${client.cd_cliente}/editar`}
                    size="small"
                    color="warning"
                    variant="outlined"
                  >
                    Editar
                  </Button>

                  <Form
                    method="post"
                    action={`${client.cd_cliente}/excluir`}
                    onSubmit={(e) => {
                      if (
                        !window.confirm(
                          "Tem certeza que deseja excluir este cliente?"
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

export default ClientsListPage;
