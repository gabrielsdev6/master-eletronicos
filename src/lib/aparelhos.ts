export type Estado = "novo" | "seminovo";

export type Aparelho = {
  id: string; // slug, usado no endereço da página
  modelo: string;
  armazenamento: number; // em GB
  cor: string;
  corHex: string;
  estado: Estado;
  bateria?: number; // saúde da bateria em %, só para seminovo
  preco: number;
  quantidade: number;
  destaque: boolean;
  fotos: string[]; // endereços das fotos reais; vazio usa o desenho
};

// Modelos em ordem do mais novo para o mais antigo, como aparecem na lista
export function listarModelos(lista: Aparelho[]) {
  return [...new Set(lista.map((a) => a.modelo))];
}

export function listarArmazenamentos(lista: Aparelho[]) {
  return [...new Set(lista.map((a) => a.armazenamento))].sort((a, b) => a - b);
}

export function temTresCameras(modelo: string) {
  return modelo.includes("Pro");
}

export function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function formatarArmazenamento(gb: number) {
  return gb >= 1024 ? `${gb / 1024} TB` : `${gb} GB`;
}

export function nomeCompleto(a: Aparelho) {
  return `${a.modelo} ${formatarArmazenamento(a.armazenamento)} ${a.cor}`;
}
