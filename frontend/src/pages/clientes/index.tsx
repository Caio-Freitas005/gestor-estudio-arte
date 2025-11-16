import { useLoaderData, Link, Form } from "react-router";
import { Box, Typography, Button } from "@mui/material";
import { getClients } from "../../services/clients.service";
import { ClientePublic } from "../../types/cliente.types";

export const clientsListLoader = () => getClients();

function ClientsListPage() {
  const clients = useLoaderData() as ClientePublic[];

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
          Gestão de Clientes
        </Typography>

        <Button
          component={Link}
          to="cadastrar"
          variant="contained"
          color="primary"
        >
          Cadastrar Cliente
        </Button>
      </Box>

      <hr style={{ margin: "2rem 0" }} />

      <Typography variant="h5" gutterBottom>
        Clientes Cadastrados
      </Typography>

      {clients.length === 0 ? (
        <p>Nenhum cliente cadastrado ainda.</p>
      ) : (
        <ul>
          {clients.map((client) => (
            <li key={client.cd_cliente}>
              <strong>{client.nm_cliente}</strong> (Telefone:{" "}
              {client.cd_telefone || "N/A"})
              <Button
                component={Link}
                to={`${client.cd_cliente}/editar`}
                size="small"
                color="warning"
                style={{ marginLeft: "1rem" }}
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

export default ClientsListPage;
