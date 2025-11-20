import { apiBase } from "./apiBase";

// Define uma interface genérica para o que os serviços fazem
export interface CrudService<T, TCreate, TUpdate> {
  getAll: () => Promise<T[]>;
  getById: (id: string | number) => Promise<T>;
  create: (data: TCreate) => Promise<T>;
  update: (id: string | number, data: TUpdate) => Promise<T>;
  delete: (id: string | number) => Promise<void>;
}

export function createCrudService<T, TCreate, TUpdate>(resource: string): CrudService<T, TCreate, TUpdate> {
  return {
    getAll: () => apiBase.get(`${resource}/`),
    
    getById: (id) => apiBase.get(`${resource}/${id}`),
    
    create: (data) => apiBase.post(`${resource}/`, data),
    
    update: (id, data) => apiBase.patch(`${resource}/${id}`, data),
    
    delete: (id) => apiBase.delete(`${resource}/${id}`),
  };
}