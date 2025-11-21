import { createCrudService } from "./factory";
import { PedidoPublic, PedidoCreate, PedidoUpdate } from "../types/pedido.types";

export const ordersService = createCrudService<PedidoPublic, PedidoCreate, PedidoUpdate>("pedidos");