// Esse arquivo define as rotas filhas de clientes
import ClientsListPage from "./index";
import ClientCreatePage from "./create";
import ClientUpdatePage from "./update";
import {
  clientLoader,
  clientsListLoader,
  clientCreateAction,
  clientUpdateAction,
  clientDeleteAction,
} from "./clients.data";

export const clientRoutes = [
  {
    index: true, // Substitui path: /clientes
    element: <ClientsListPage />,
    loader: clientsListLoader,
  },
  {
    path: "cadastrar", // Caminho relativo a /clientes
    element: <ClientCreatePage />,
    action: clientCreateAction,
  },
  {
    path: ":id",
    element: <ClientUpdatePage />,
    loader: clientLoader,
    action: clientUpdateAction,
  },
  {
    path: ":id/excluir",
    action: clientDeleteAction,
    errorElement: <div>Oops! Erro ao excluir.</div>,
  },
];
