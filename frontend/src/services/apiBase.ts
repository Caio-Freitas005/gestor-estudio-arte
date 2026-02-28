const API_URL = import.meta.env.VITE_API_URL;

async function handleResponse(response: Response): Promise<any> {
  if (!response.ok) {
    let errorMessage = `Erro HTTP: ${response.status}`;

    try {
      const errorData = await response.json();

      // Se for do Pydantic, o detail é uma lista de erros
      if (Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail[0].msg;
      }
      // Se for erro customizado, o detail é uma string direta
      else if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } catch (e) {
      // Falha silenciosa se a resposta não for um JSON válido
    }

    // Lança um objeto com a propriedade detail exata
    throw { detail: errorMessage };
  }

  if (response.status === 204) return null;
  return response.json();
}

export const apiBase = {
  get: async (path: string): Promise<any> => {
    const response = await fetch(`${API_URL}/${path}`);
    return handleResponse(response);
  },

  post: async (path: string, data: any): Promise<any> => {
    // Verifica se os dados são um FormData
    const isFormData = data instanceof FormData;

    const response = await fetch(`${API_URL}/${path}`, {
      method: "POST",
      // Se for FormData, não envia headers, caso contrário envia
      ...(isFormData
        ? {}
        : { headers: { "Content-Type": "application/json" } }),
      // Se for FormData, envia o objeto direto. Se não, stringify.
      body: isFormData ? data : JSON.stringify(data),
    });
    return handleResponse(response);
  },

  patch: async (path: string, data: any): Promise<any> => {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_URL}/${path}`, {
      method: "PATCH",
      ...(isFormData
        ? {}
        : { headers: { "Content-Type": "application/json" } }),
      body: isFormData ? data : JSON.stringify(data),
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
