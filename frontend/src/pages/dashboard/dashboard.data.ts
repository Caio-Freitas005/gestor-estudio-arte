const API_URL = import.meta.env.VITE_API_URL;

export async function dashboardLoader() {
  // Pede os dados já calculados no backend
  const response = await fetch(`${API_URL}/dashboard/`);
  
  if (!response.ok) {
    throw new Error("Falha ao carregar os dados do dashboard");
  }

  const data = await response.json();

  // Devolve o que a página espera receber
  return { 
    status: data.status, 
    pedidosRecentes: data.pedidosRecentes, 
    aniversariantes: data.aniversariantes 
  };
}