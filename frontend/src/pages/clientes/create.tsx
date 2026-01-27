import { Typography } from "@mui/material";
import ClientForm from "./components/ClientForm";

function ClientCreatePage() {
  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h4">Cadastrar <span className="text-pink-500">Cliente</span></Typography>
      <ClientForm />
    </div>
  );
}

export default ClientCreatePage;
