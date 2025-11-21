import { useLoaderData } from "react-router";
import { Box, Typography } from "@mui/material";
import ClientForm from "../../components/ClientForm";
import { ClientePublic } from "../../types/cliente.types";

function ClientUpdatePage() {
  // Busca os dados carregados pelo loader
  const clientData = useLoaderData() as ClientePublic;
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h3" gutterBottom>
        Formulário de Clientes
      </Typography>
      {/* Passa os dados do cliente para o formulário
        para pré-preencher os campos
      */}
      <ClientForm defaultValues={clientData} />
    </Box>
  );
}

export default ClientUpdatePage;
