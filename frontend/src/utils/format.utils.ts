export function formatPhone(phone: string | undefined): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

export function formatDate(date: string | undefined): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
}
