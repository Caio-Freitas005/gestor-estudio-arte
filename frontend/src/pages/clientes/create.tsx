import { Box, Typography } from "@mui/material";
import ClientForm from "../../components/ClientForm";

function ClientCreatePage() {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h3" gutterBottom>
        Formulário de Clientes
      </Typography>

      <ClientForm />
    </Box>
  );
}

export default ClientCreatePage;
