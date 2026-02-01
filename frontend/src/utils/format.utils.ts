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
};

export function formatDateForInput (dateInput?: string | Date) {
  const d = dateInput ? new Date(dateInput) : new Date();

  // Extrai os componentes locais 
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Meses começam em 0
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`; // Retorna exatamente AAAA-MM-DD
};

export function formatNumber(number: number | undefined): any {
  return Number(number).toFixed(2);
};
