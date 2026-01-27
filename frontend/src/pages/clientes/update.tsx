import { useLoaderData } from "react-router";
import { Typography } from "@mui/material";
import { ClientePublic } from "../../types/cliente.types";
import ClientForm from "./components/ClientForm";

function ClientUpdatePage() {
  const clientData = useLoaderData() as ClientePublic;
  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h4">Editar <span className="text-pink-500">Cliente</span></Typography>
      <ClientForm defaultValues={clientData} />
    </div>
  );
}

export default ClientUpdatePage;
