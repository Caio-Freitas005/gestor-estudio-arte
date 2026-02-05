import { dashboardLoader } from "./dashboard.data";
import DashboardPage from ".";

export const dashboardRoutes = [
  {
    index: true,
    element: <DashboardPage />,
    loader: dashboardLoader,
  },
];