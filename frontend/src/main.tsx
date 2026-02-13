import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";

import "./index.css";
import App from "./App";

import { clientRoutes } from "./pages/clientes/routes";
import { productRoutes } from "./pages/produtos/routes";
import { orderRoutes } from "./pages/pedidos/routes";
import { dashboardRoutes } from "./pages/dashboard/routes";

const theme = createTheme({
  palette: {
    primary: { main: "#ec4899", contrastText: "#ffffff" },
    secondary: { main: "#6b7280" },
    background: { default: "#f9fafb", paper: "#ffffff" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
    h4: { fontWeight: 700, letterSpacing: "-0.02em" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 20px",
          boxShadow: "none",
          "&:hover": { boxShadow: "0 4px 12px rgba(236, 72, 153, 0.2)" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ec4899",
          },
        },
      },
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      ...dashboardRoutes,
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
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>,
);
