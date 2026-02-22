export function formatPhone(phone: string | undefined): string {
  if (!phone) return "";
  
  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("55") && cleaned.length >= 12) {
    cleaned = cleaned.substring(2);
  }

  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

export function formatDate(date: string | undefined): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
}

export function formatNumber(value: number | string) {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return "0,00";

  return num.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
