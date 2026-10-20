// Valores de exemplo: trocar pelas taxas reais da maquininha da loja.
// O preço do site é o preço no Pix. No cartão, soma o acréscimo da parcela.
export const MAX_PARCELAS = 12;

// Acréscimo em % sobre o preço do Pix, por número de parcelas (índice 0 = 1x)
const ACRESCIMO_CARTAO = [4.5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

export function simularCartao(precoPix: number, parcelas: number) {
  const acrescimo = ACRESCIMO_CARTAO[parcelas - 1] ?? 0;
  const total = Math.round(precoPix * (1 + acrescimo / 100) * 100) / 100;
  return { total, parcela: Math.round((total / parcelas) * 100) / 100 };
}

export function formatarCentavos(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
