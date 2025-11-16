// Esse arquivo define as rotas filhas de produtos
import ProductsListPage, { productsListLoader } from "./index";
import ProductCreatePage, { productCreateAction } from "./create";
import ProductUpdatePage, {
  productUpdateLoader,
  productUpdateAction,
} from "./update";
import { productDeleteAction } from "./delete";

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
    path: ":id/editar",
    element: <ProductUpdatePage />,
    loader: productUpdateLoader,
    action: productUpdateAction,
  },
  {
    path: ":id/excluir",
    action: productDeleteAction,
    errorElement: <div>Oops! Erro ao excluir.</div>,
  },
];
