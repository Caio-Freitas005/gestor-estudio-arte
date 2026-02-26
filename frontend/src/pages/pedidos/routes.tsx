import OrdersListPage from "./index";
import OrderCreatePage from "./create";
import OrderUpdatePage from "./update";
import {
  orderCreateAction,
  ordersListLoader,
  orderUpdateAction,
  orderUpdateLoader,
  orderUploadArtAction,
} from "./orders.data";

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
  },
  {
    path: ":id",
    element: <OrderUpdatePage />,
    loader: orderUpdateLoader,
    action: orderUpdateAction,
    children: [
      {
        path: "itens/:produto_id/upload-arte",
        action: orderUploadArtAction,
      },
    ],
  },
];
