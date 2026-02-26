import { apiBase } from "./apiBase";
import { PaginatedResponse } from "../types/common.types";

// Define uma interface genérica para o que os serviços fazem
export interface CrudService<T, TCreate, TUpdate> {
  getAll: (params?: Record<string, any>) => Promise<PaginatedResponse<T>>;
  getById: (id: string | number) => Promise<T>;
  create: (data: TCreate) => Promise<T>;
  update: (id: string | number, data: TUpdate) => Promise<T>;
  delete: (id: string | number) => Promise<void>;
}

export function createCrudService<T, TCreate, TUpdate>(
  resource: string,
): CrudService<T, TCreate, TUpdate> {
  return {
    getAll: (params) => {
      // Remove parâmetros vazios ou nulos para limpar a URL
      const cleanParams = params
        ? Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v != null && v !== ""),
          )
        : {};

      const query = new URLSearchParams(cleanParams).toString();
      const path = query ? `${resource}/?${query}` : `${resource}/`;

      return apiBase.get(path);
    },

    getById: (id) => apiBase.get(`${resource}/${id}`),

    create: (data) => apiBase.post(`${resource}/`, data),

    update: (id, data) => apiBase.patch(`${resource}/${id}`, data),

    delete: (id) => apiBase.delete(`${resource}/${id}`),
  };
}
