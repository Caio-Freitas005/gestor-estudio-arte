// Esse arquivo espelha os schemas de:
// backend/app/models/cliente.py

interface ClienteBase {
  nm_cliente: string;
  cd_telefone: string | null;
  nm_email: string | null;
  dt_nascimento: string | null; // O <input type="date"> do HTML envia strings
  ds_observacoes: string | null;
}

export interface ClienteCreate extends ClienteBase {
  //
}

export interface ClientePublic extends ClienteBase {
  cd_cliente: number;
}

export interface ClienteUpdate {
  nm_cliente?: string; // O ? significa que o campo é opcional
  cd_telefone?: string | null;
  nm_email?: string | null;
  dt_nascimento?: string | null;
  ds_observacoes?: string | null;
}
