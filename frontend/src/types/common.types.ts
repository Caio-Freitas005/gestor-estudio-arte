// Interface para a resposta paginada do backend
export interface PaginatedResponse<T> {
  dados: T[];
  total: number;
}