import { apiBase } from "@/services/apiBase";

export async function dashboardLoader() {
  try {
    const data = await apiBase.get("dashboard/");
    return {
      status: data.status,
      pedidosRecentes: data.pedidosRecentes,
      aniversariantes: data.aniversariantes,
    };
  } catch (err: any) {
    throw new Error(err.detail || "Falha ao carregar os dados do dashboard");
  }
}
