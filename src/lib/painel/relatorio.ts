// Contas dos relatórios. Funções puras: recebem os dados já buscados, então dá para testar sem banco.

export type VendaRelatorio = {
  aparelhoId: string | null;
  descricao: string;
  quantidade: number; // negativa, como no histórico
  precoUnitario: number | null;
  formaPagamento: string | null;
  dia: number; // dia do mês no horário de Brasília
};

export type AparelhoRelatorio = {
  id: string;
  nome: string;
  preco: number;
  custo: number | null;
  quantidade: number;
  criadoEm: Date;
};

const DIA_MS = 24 * 60 * 60 * 1000;
export const DIAS_PARADO = 30;

export function resumirVendas(vendas: VendaRelatorio[], custos: Map<string, number | null>, diasNoMes: number) {
  let unidades = 0;
  let faturamento = 0;
  let lucro = 0;
  let unidadesComCusto = 0;
  const porDia = Array.from({ length: diasNoMes }, (_, i) => ({ dia: i + 1, valor: 0, unidades: 0 }));
  const porForma = new Map<string, { valor: number; unidades: number }>();
  const porAparelho = new Map<string, { descricao: string; unidades: number; valor: number }>();

  for (const v of vendas) {
    const qtd = -v.quantidade;
    const valor = qtd * (v.precoUnitario ?? 0);
    unidades += qtd;
    faturamento += valor;

    const custo = v.aparelhoId ? custos.get(v.aparelhoId) : null;
    if (custo !== null && custo !== undefined) {
      lucro += valor - qtd * custo;
      unidadesComCusto += qtd;
    }

    const dia = porDia[v.dia - 1];
    if (dia) {
      dia.valor += valor;
      dia.unidades += qtd;
    }

    const forma = v.formaPagamento ?? "outro";
    const f = porForma.get(forma) ?? { valor: 0, unidades: 0 };
    f.valor += valor;
    f.unidades += qtd;
    porForma.set(forma, f);

    const chave = v.aparelhoId ?? v.descricao;
    const a = porAparelho.get(chave) ?? { descricao: v.descricao, unidades: 0, valor: 0 };
    a.unidades += qtd;
    a.valor += valor;
    porAparelho.set(chave, a);
  }

  return {
    unidades,
    faturamento,
    vendas: vendas.length,
    ticketMedio: vendas.length ? faturamento / vendas.length : 0,
    lucro,
    // Lucro só conta vendas de aparelhos com custo cadastrado
    lucroCompleto: unidadesComCusto === unidades,
    porDia,
    porForma: [...porForma.entries()]
      .map(([forma, f]) => ({ forma, ...f }))
      .sort((a, b) => b.valor - a.valor),
    maisVendidos: [...porAparelho.values()].sort((a, b) => b.unidades - a.unidades || b.valor - a.valor).slice(0, 5),
  };
}

export function resumirEstoque(aparelhos: AparelhoRelatorio[]) {
  let unidades = 0;
  let valorVenda = 0;
  let valorCusto = 0;
  let semCusto = 0;
  for (const a of aparelhos) {
    unidades += a.quantidade;
    valorVenda += a.quantidade * a.preco;
    if (a.custo === null) semCusto += a.quantidade;
    else valorCusto += a.quantidade * a.custo;
  }
  return { unidades, valorVenda, valorCusto, semCusto };
}

/**
 * Aparelhos com estoque que não vendem há DIAS_PARADO dias ou mais.
 * Sem nenhuma venda, conta desde o cadastro.
 */
export function aparelhosParados(aparelhos: AparelhoRelatorio[], ultimaVenda: Map<string, Date>, hoje: Date) {
  return aparelhos
    .filter((a) => a.quantidade > 0)
    .map((a) => {
      const desde = ultimaVenda.get(a.id) ?? a.criadoEm;
      return { ...a, dias: Math.floor((hoje.getTime() - desde.getTime()) / DIA_MS), nuncaVendeu: !ultimaVenda.has(a.id) };
    })
    .filter((a) => a.dias >= DIAS_PARADO)
    .sort((a, b) => b.dias - a.dias);
}

/** Variação percentual entre dois valores; null quando não dá para comparar. */
export function variacao(atual: number, anterior: number) {
  if (anterior <= 0) return null;
  return ((atual - anterior) / anterior) * 100;
}
