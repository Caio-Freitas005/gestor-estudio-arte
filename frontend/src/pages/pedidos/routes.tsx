import OrdersListPage from "./index";
import OrderCreatePage from "./create";
import OrderUpdatePage from "./update";
import {
  orderCreateAction,
  orderCreateLoader,
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
    loader: orderCreateLoader,
  },
  {
    path: ":id",
    element: <OrderUpdatePage />,
    loader: orderUpdateLoader,
    action: orderUpdateAction,
    children: [
      {
        index: true,
        element: <OrderUpdatePage />,
        loader: orderUpdateLoader,
        action: orderUpdateAction,
      },
      {
        path: "itens/:cd_produto/upload-arte",
        action: orderUploadArtAction
      },
    ],
  },
];
