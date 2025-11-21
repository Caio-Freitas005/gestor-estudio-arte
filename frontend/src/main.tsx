import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";

import "./index.css";
import App from "./App";

import { clientRoutes } from "./pages/clientes/routes";
import { productRoutes } from "./pages/produtos/routes";
import { orderRoutes } from "./pages/pedidos/routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Navigate to="/pedidos" replace /> },
      {
        path: "/clientes",
        children: clientRoutes,
      },
      {
        path: "/produtos",
        children: productRoutes,
      },
      {
        path: "/pedidos",
        children: orderRoutes,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
