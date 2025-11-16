// Esse arquivo define as rotas filhas de clientes
import ClientsListPage, { clientsListLoader } from "./index";
import ClientCreatePage, { clientCreateAction } from "./create";
import ClientUpdatePage, {
  clientUpdateLoader,
  clientUpdateAction,
} from "./update";
import { clientDeleteAction } from "./delete";

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
    path: ":id/editar",
    element: <ClientUpdatePage />,
    loader: clientUpdateLoader,
    action: clientUpdateAction,
  },
  {
    path: ":id/excluir",
    action: clientDeleteAction,
    errorElement: <div>Oops! Erro ao excluir.</div>,
  },
];
