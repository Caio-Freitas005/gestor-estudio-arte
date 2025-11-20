import { createCrudService } from "./factory";
import { ClientePublic, ClienteCreate, ClienteUpdate } from "../types/cliente.types";

export const clientsService = createCrudService<ClientePublic, ClienteCreate, ClienteUpdate>("clientes");