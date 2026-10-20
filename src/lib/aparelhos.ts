export type Estado = "novo" | "seminovo";

export type Aparelho = {
  id: string;
  modelo: string;
  armazenamento: number; // em GB
  cor: string;
  corHex: string;
  estado: Estado;
  bateria?: number; // saúde da bateria em %, só para seminovo
  preco: number;
  quantidade: number;
  destaque: boolean;
};

// Dados de exemplo para a demonstração
export const aparelhos: Aparelho[] = [
  { id: "17-pro-max-256-laranja", modelo: "iPhone 17 Pro Max", armazenamento: 256, cor: "Laranja-cósmico", corHex: "#e46a2a", estado: "novo", preco: 11499, quantidade: 2, destaque: true },
  { id: "17-pro-256-azul", modelo: "iPhone 17 Pro", armazenamento: 256, cor: "Azul-intenso", corHex: "#2c3a55", estado: "novo", preco: 9999, quantidade: 3, destaque: true },
  { id: "17-256-lavanda", modelo: "iPhone 17", armazenamento: 256, cor: "Lavanda", corHex: "#c9bfe0", estado: "novo", preco: 7299, quantidade: 4, destaque: false },
  { id: "16-pro-128-deserto", modelo: "iPhone 16 Pro", armazenamento: 128, cor: "Titânio-deserto", corHex: "#c8b39c", estado: "seminovo", bateria: 94, preco: 6299, quantidade: 1, destaque: false },
  { id: "16-128-preto", modelo: "iPhone 16", armazenamento: 128, cor: "Preto", corHex: "#2b2b2d", estado: "novo", preco: 5499, quantidade: 5, destaque: true },
  { id: "16-128-verde", modelo: "iPhone 16", armazenamento: 128, cor: "Verde-acinzentado", corHex: "#a9c2b4", estado: "novo", preco: 5499, quantidade: 2, destaque: false },
  { id: "15-pro-max-256-natural", modelo: "iPhone 15 Pro Max", armazenamento: 256, cor: "Titânio natural", corHex: "#a8a297", estado: "seminovo", bateria: 89, preco: 5799, quantidade: 1, destaque: false },
  { id: "15-128-azul", modelo: "iPhone 15", armazenamento: 128, cor: "Azul", corHex: "#d3e1e8", estado: "seminovo", bateria: 91, preco: 3899, quantidade: 3, destaque: true },
  { id: "14-128-roxo", modelo: "iPhone 14", armazenamento: 128, cor: "Roxo", corHex: "#c7bcd6", estado: "seminovo", bateria: 87, preco: 3199, quantidade: 2, destaque: false },
  { id: "13-128-meia-noite", modelo: "iPhone 13", armazenamento: 128, cor: "Meia-noite", corHex: "#262a33", estado: "seminovo", bateria: 85, preco: 2499, quantidade: 4, destaque: false },
  { id: "13-256-estelar", modelo: "iPhone 13", armazenamento: 256, cor: "Estelar", corHex: "#ece6dc", estado: "seminovo", bateria: 88, preco: 2799, quantidade: 0, destaque: false },
  { id: "12-64-branco", modelo: "iPhone 12", armazenamento: 64, cor: "Branco", corHex: "#f1f1ef", estado: "seminovo", bateria: 84, preco: 1799, quantidade: 2, destaque: false },
  { id: "11-64-vermelho", modelo: "iPhone 11", armazenamento: 64, cor: "Vermelho", corHex: "#b1222f", estado: "seminovo", bateria: 82, preco: 1399, quantidade: 1, destaque: false },
];

export function buscarAparelho(id: string) {
  return aparelhos.find((a) => a.id === id);
}

// Modelos em ordem do mais novo para o mais antigo, como aparecem nos dados
export function listarModelos() {
  return [...new Set(aparelhos.map((a) => a.modelo))];
}

export function listarArmazenamentos() {
  return [...new Set(aparelhos.map((a) => a.armazenamento))].sort((a, b) => a - b);
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
