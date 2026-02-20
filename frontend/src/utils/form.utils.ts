export function cleanFormData<T>(formData: FormData): T {
  const data: any = {};
  formData.forEach((value, key) => {
    // Se for string vazia, vira null. Se não, mantém o valor.
    data[key] = value === "" ? null : value;
  });
  return data as T;
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