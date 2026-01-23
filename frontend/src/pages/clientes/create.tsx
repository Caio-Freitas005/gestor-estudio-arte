import { Typography } from "@mui/material";
import ClientForm from "./components/ClientForm";

function ClientCreatePage() {
  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h4">Novo Cliente</Typography>
      <ClientForm />
    </div>
  );
}

export default ClientCreatePage;
