// Aparelho como o painel enxerga: com custo, arquivado e o id do banco
export type ItemEstoque = {
  id: string;
  slug: string;
  modelo: string;
  armazenamento: number;
  cor: string;
  corHex: string;
  estado: "novo" | "seminovo";
  bateria: number | null;
  preco: number;
  custo: number | null;
  quantidade: number;
  destaque: boolean;
  ativo: boolean;
  observacao: string | null;
  capa: string | null;
};

export const NOMES_FORMA: Record<string, string> = {
  pix: "Pix",
  cartao: "Cartão",
  dinheiro: "Dinheiro",
  troca: "Troca + diferença",
};
