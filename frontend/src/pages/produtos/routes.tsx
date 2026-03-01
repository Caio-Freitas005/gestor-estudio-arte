// Esse arquivo define as rotas filhas de produtos
import ProductsListPage from "./index";
import ProductCreatePage from "./create";
import ProductUpdatePage from "./update";

import {
  productCreateAction,
  productDeleteAction,
  productLoader,
  productsListLoader,
  productUpdateAction,
} from "./products.data";

export const productRoutes = [
  {
    index: true,
    element: <ProductsListPage />,
    loader: productsListLoader,
  },
  {
    path: "cadastrar",
    element: <ProductCreatePage />,
    action: productCreateAction,
  },
  {
    path: ":id",
    element: <ProductUpdatePage />,
    loader: productLoader,
    action: productUpdateAction,
  },
  {
    path: ":id/excluir",
    action: productDeleteAction,
  },
];
