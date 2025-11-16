// Esse arquivo define as funções do cliente para acesso a API
import { apiBase } from "./apiBase";
import { ClientePublic, ClienteCreate, ClienteUpdate } from "../types/cliente.types";

const resource = "clientes";

export async function getClients(): Promise<ClientePublic[]> {
  return apiBase.get(`${resource}/`);
}

export async function getClient(id: string): Promise<ClientePublic> {
  return apiBase.get(`${resource}/${id}`);
}

export async function createClient(clientData: ClienteCreate): Promise<ClientePublic> {
  return apiBase.post(`${resource}/`, clientData);
}

export async function updateClient(id: string, clientData: ClienteUpdate): Promise<ClientePublic> {
  return apiBase.patch(`${resource}/${id}`, clientData);
}

export async function deleteClient(id: string): Promise<null> {
  return apiBase.delete(`${resource}/${id}`);
}
