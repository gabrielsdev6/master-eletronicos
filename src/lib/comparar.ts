import { aparelhos, formatarArmazenamento, formatarPreco, type Aparelho } from "./aparelhos";
import { ESPECIFICACOES } from "./especificacoes";

export function nomeCurto(a: Aparelho) {
  return `${a.modelo} ${formatarArmazenamento(a.armazenamento)}`;
}

// Frase que resume a diferença entre dois aparelhos, gerada dos dados
export function resumoComparacao(a: Aparelho, b: Aparelho) {
  if (a.preco === b.preco) return `Os dois custam ${formatarPreco(a.preco)} no Pix.`;
  const [caro, barato] = a.preco > b.preco ? [a, b] : [b, a];
  let frase = `O ${nomeCurto(caro)} custa ${formatarPreco(caro.preco - barato.preco)} a mais`;
  const eCaro = ESPECIFICACOES[caro.modelo];
  const eBarato = ESPECIFICACOES[barato.modelo];
  if (eCaro && eBarato) {
    const horas = eCaro.videoHoras - eBarato.videoHoras;
    if (horas > 0) frase += ` e dura ${horas}h a mais em vídeo`;
    if (horas < 0) frase += `, mas dura ${-horas}h a menos em vídeo`;
  }
  return `${frase}.`;
}

// Dúvidas comuns de quem vai comprar. Só aparecem se os dois modelos tiverem estoque.
const DUELOS: [string, string][] = [
  ["iPhone 15", "iPhone 16"],
  ["iPhone 16", "iPhone 17"],
  ["iPhone 13", "iPhone 14"],
];

export function duelosProntos() {
  const primeiroDisponivel = (modelo: string) =>
    aparelhos.find((a) => a.modelo === modelo && a.quantidade > 0);
  return DUELOS.map(([x, y]) => [primeiroDisponivel(x), primeiroDisponivel(y)] as const).filter(
    (par): par is readonly [Aparelho, Aparelho] => Boolean(par[0] && par[1]),
  );
}
