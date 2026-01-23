import { useLoaderData } from "react-router";
import { Typography } from "@mui/material";
import ClientForm from "./components/ClientForm";
import { ClientePublic } from "../../types/cliente.types";

function ClientUpdatePage() {
  const clientData = useLoaderData() as ClientePublic;
  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h4">Editar Cliente</Typography>
      <ClientForm defaultValues={clientData} />
    </div>
  );
}

export default ClientUpdatePage;
