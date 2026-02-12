// Esse arquivo espelha os schemas de:
// backend/app/models/cliente.py

import { PaginatedResponse } from "./common.types";

interface ClienteBase {
  nome: string;
  telefone?: string | null;
  email?: string | null;
  data_nascimento?: string | null; // O <input type="date"> do HTML envia strings
  observacoes?: string | null;
}

export interface ClienteCreate extends ClienteBase {
  //
}

export interface ClientePublic extends ClienteBase {
  id: number;
}

export type ClientePaginated = PaginatedResponse<ClientePublic>;

// Partial torna todos os campos opcionais
export interface ClienteUpdate extends Partial<ClienteBase> {
  //
}
