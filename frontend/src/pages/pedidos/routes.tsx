import OrdersListPage, { ordersListLoader } from "./index";
import OrderCreatePage, {
  orderCreateAction,
  orderCreateLoader,
} from "./create";

import OrderUpdatePage, {
  orderUpdateLoader,
  orderUpdateAction,
} from "./update";

export const orderRoutes = [
  {
    index: true,
    element: <OrdersListPage />,
    loader: ordersListLoader,
  },
  {
    path: "cadastrar",
    element: <OrderCreatePage />,
    action: orderCreateAction,
    loader: orderCreateLoader,
  },
  {
    path: ":id",
    element: <OrderUpdatePage />,
    loader: orderUpdateLoader,
    action: orderUpdateAction,
  },
];
