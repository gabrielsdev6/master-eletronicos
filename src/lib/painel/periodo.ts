// Meses no formato "2026-10", sempre no horário de Brasília (sem horário de verão desde 2019)
const FUSO = "-03:00";

export function mesDe(data: Date) {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(data);
  const ano = partes.find((p) => p.type === "year")!.value;
  const mes = partes.find((p) => p.type === "month")!.value;
  return `${ano}-${mes}`;
}

export function mesValido(texto: unknown): texto is string {
  return typeof texto === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(texto);
}

export function deslocarMes(mes: string, quantos: number) {
  const [ano, m] = mes.split("-").map(Number);
  const total = ano * 12 + (m - 1) + quantos;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}`;
}

export function intervaloDoMes(mes: string) {
  return {
    desde: new Date(`${mes}-01T00:00:00${FUSO}`),
    ate: new Date(`${deslocarMes(mes, 1)}-01T00:00:00${FUSO}`),
  };
}

export function nomeDoMes(mes: string) {
  const texto = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${mes}-15T12:00:00Z`),
  );
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function diasNoMes(mes: string) {
  const [ano, m] = mes.split("-").map(Number);
  return new Date(Date.UTC(ano, m, 0)).getUTCDate();
}

/** Dia do mês (1 a 31) de uma data, no horário de Brasília. */
export function diaDe(data: Date) {
  return Number(new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo", day: "numeric" }).format(data));
}
