export function cleanFormData<T>(formData: FormData): T {
  const data: any = {};
  formData.forEach((value, key) => {
    // Se for string vazia, vira null. Se não, mantém o valor.
    data[key] = value === "" ? null : value;
  });
  return data as T;
}

export function formatDateForInput(dateInput?: string | Date) {
  // Editar (string vinda do Banco de Dados)
  // Retorna a string pura YYYY-MM-DD para o browser não tentar ajustar o fuso.
  if (typeof dateInput === "string") {
    return dateInput.split("T")[0];
  }

  // Se for Novo Pedido (undefined) ou um objeto Date, usa o relógio LOCAL
  const d = dateInput || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Converte uma string com vírgula ou ponto em um número decimal válido.
 * Utilizado para inputs monetários onde o usuário pode digitar no padrão brasileiro.
 */
export const parseBrazilianNumber = (value: any): number => {
  if (!value) return 0;
  
  // Substitui a vírgula por ponto para o parseFloat entender
  const normalizedValue = value.replace(',', '.');
  const parsed = parseFloat(normalizedValue);
  
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Prepara o valor para exibição no input, garantindo que o ponto interno 
 * seja visualizado como vírgula pelo usuário.
 */
export const formatBrazilianInput = (value: number | undefined): string => {
  if (value === undefined || value === 0) return "0";
  return value.toString().replace('.', ',');
};

export function formatPhoneInput(value: string | null | undefined): string {
  if (!value) return "";

  // Remove tudo o que não for número
  let v = value.replace(/\D/g, "");

  // Se a string começar com 55 e tiver 12 ou 13 dígitos (veio do banco de dados), arranca o 55
  if (v.startsWith("55") && v.length >= 12) {
    v = v.substring(2);
  }

  // Limita a 11 dígitos e aplica as máscaras
  v = v.substring(0, 11);

  // Aplica a máscara com base no tamanho
  if (v.length <= 10) {
    // Fixo: (XX) XXXX-XXXX
    return v.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  } else {
    // Celular: (XX) XXXXX-XXXX
    return v.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
  }
}