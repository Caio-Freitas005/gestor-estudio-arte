import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import "./index.css";
import App from "./App";
import Dashboard from "./pages/Dashboard";

import { clientRoutes } from "./pages/clientes/routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Dashboard /> },
      {
        path: "/clientes",
        children: clientRoutes,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
