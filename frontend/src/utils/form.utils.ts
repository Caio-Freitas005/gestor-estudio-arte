export function cleanFormData<T>(formData: FormData): T {
  const data: any = {};
  formData.forEach((value, key) => {
    // Se for string vazia, vira null. Se não, mantém o valor.
    data[key] = value === "" ? null : value;
  });
  return data as T;
}