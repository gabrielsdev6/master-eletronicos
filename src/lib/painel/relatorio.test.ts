import { describe, expect, it } from "vitest";
import { aparelhosParados, resumirEstoque, resumirVendas, variacao, type AparelhoRelatorio } from "./relatorio";

const venda = (id: string, qtd: number, preco: number, forma: string, dia: number) => ({
  aparelhoId: id,
  descricao: `Aparelho ${id}`,
  quantidade: -qtd,
  precoUnitario: preco,
  formaPagamento: forma,
  dia,
});

describe("resumirVendas", () => {
  it("soma faturamento, ticket médio e lucro com custo conhecido", () => {
    const custos = new Map<string, number | null>([
      ["a", 800],
      ["b", null],
    ]);
    const r = resumirVendas([venda("a", 2, 1000, "pix", 3), venda("b", 1, 500, "cartao", 3)], custos, 31);
    expect(r.unidades).toBe(3);
    expect(r.faturamento).toBe(2500);
    expect(r.ticketMedio).toBe(1250);
    expect(r.lucro).toBe(400); // só o "a" tem custo
    expect(r.lucroCompleto).toBe(false);
    expect(r.porDia[2]).toEqual({ dia: 3, valor: 2500, unidades: 3 });
    expect(r.porForma[0]).toEqual({ forma: "pix", valor: 2000, unidades: 2 });
    expect(r.maisVendidos[0].descricao).toBe("Aparelho a");
  });

  it("mês sem vendas não divide por zero", () => {
    const r = resumirVendas([], new Map(), 30);
    expect(r.ticketMedio).toBe(0);
    expect(r.porDia).toHaveLength(30);
    expect(r.lucroCompleto).toBe(true);
  });
});

describe("estoque e parados", () => {
  const hoje = new Date("2026-10-27T12:00:00Z");
  const base: AparelhoRelatorio[] = [
    { id: "a", nome: "A", preco: 1000, custo: 700, quantidade: 2, criadoEm: new Date("2026-08-01T12:00:00Z") },
    { id: "b", nome: "B", preco: 500, custo: null, quantidade: 1, criadoEm: new Date("2026-10-20T12:00:00Z") },
    { id: "c", nome: "C", preco: 900, custo: 600, quantidade: 0, criadoEm: new Date("2026-01-01T12:00:00Z") },
  ];

  it("valor do estoque separa o que não tem custo", () => {
    expect(resumirEstoque(base)).toEqual({ unidades: 3, valorVenda: 2500, valorCusto: 1400, semCusto: 1 });
  });

  it("parado conta da última venda ou do cadastro e ignora esgotados", () => {
    const parados = aparelhosParados(base, new Map([["a", new Date("2026-09-20T12:00:00Z")]]), hoje);
    expect(parados.map((p) => [p.id, p.dias])).toEqual([["a", 37]]);
  });

  it("variação não compara com zero", () => {
    expect(variacao(150, 100)).toBe(50);
    expect(variacao(10, 0)).toBeNull();
  });
});
