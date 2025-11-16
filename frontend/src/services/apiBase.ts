// Esse arquivo define o motor de acesso a API, que cuida das requisições e respostas
const API_URL = import.meta.env.VITE_API_URL;

async function handleResponse(response: Response): Promise<any> {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(
        errorData.detail || `HTTP error! status: ${response.status}`
      );
    } catch (jsonError) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export const apiBase = {
  get: async (path: string): Promise<any> => {
    const response = await fetch(`${API_URL}/${path}`);
    return handleResponse(response);
  },

  post: async (path: string, data: any): Promise<any> => {
    const response = await fetch(`${API_URL}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  patch: async (path: string, data: any): Promise<any> => {
    const response = await fetch(`${API_URL}/${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (path: string): Promise<any> => {
    const response = await fetch(`${API_URL}/${path}`, {
      method: "DELETE",
    });
    return handleResponse(response);
  },
};
