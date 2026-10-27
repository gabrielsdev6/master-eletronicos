import type { Metadata } from "next";
import Link from "next/link";
import { formatarArmazenamento, formatarPreco } from "@/lib/aparelhos";
import { exigirEquipe } from "@/lib/painel/sessao";
import { NOMES_FORMA } from "@/lib/painel/tipos";
import { diaDe, diasNoMes, deslocarMes, intervaloDoMes, mesDe, mesValido, nomeDoMes } from "@/lib/painel/periodo";
import {
  DIAS_PARADO,
  aparelhosParados,
  resumirEstoque,
  resumirVendas,
  variacao,
  type AparelhoRelatorio,
  type VendaRelatorio,
} from "@/lib/painel/relatorio";
import { cartao } from "@/components/painel/estilos";
import { GraficoDiario } from "@/components/painel/GraficoDiario";
import { SeletorMes } from "@/components/painel/SeletorMes";

export const metadata: Metadata = { title: "Relatórios" };

export default async function Relatorios({ searchParams }: PageProps<"/painel/relatorios">) {
  const sp = await searchParams;
  const mes = mesValido(sp.mes) ? sp.mes : mesDe(new Date());
  const { sb } = await exigirEquipe();

  const doMes = intervaloDoMes(mes);
  const anterior = intervaloDoMes(deslocarMes(mes, -1));
  const campos = "aparelho_id, descricao, quantidade, preco_unitario, forma_pagamento, criado_em";

  const [vendasMes, vendasAnterior, aparelhos, ultimas] = await Promise.all([
    sb.from("movimentacoes").select(campos).eq("tipo", "venda").gte("criado_em", doMes.desde.toISOString()).lt("criado_em", doMes.ate.toISOString()),
    sb.from("movimentacoes").select(campos).eq("tipo", "venda").gte("criado_em", anterior.desde.toISOString()).lt("criado_em", anterior.ate.toISOString()),
    sb.from("aparelhos").select("id, modelo, armazenamento, cor, preco, custo, quantidade, criado_em").eq("ativo", true),
    sb.from("movimentacoes").select("aparelho_id, criado_em").eq("tipo", "venda").order("criado_em", { ascending: false }),
  ]);
  for (const r of [vendasMes, vendasAnterior, aparelhos, ultimas]) if (r.error) throw r.error;

  const paraVenda = (m: NonNullable<typeof vendasMes.data>[number]): VendaRelatorio => ({
    aparelhoId: m.aparelho_id,
    descricao: m.descricao,
    quantidade: m.quantidade,
    precoUnitario: m.preco_unitario === null ? null : Number(m.preco_unitario),
    formaPagamento: m.forma_pagamento,
    dia: diaDe(new Date(m.criado_em)),
  });

  const lista: AparelhoRelatorio[] = aparelhos.data!.map((a) => ({
    id: a.id,
    nome: `${a.modelo} ${formatarArmazenamento(a.armazenamento)} ${a.cor}`,
    preco: Number(a.preco),
    custo: a.custo === null ? null : Number(a.custo),
    quantidade: a.quantidade,
    criadoEm: new Date(a.criado_em),
  }));
  const custos = new Map(lista.map((a) => [a.id, a.custo]));

  const vendas = resumirVendas(vendasMes.data!.map(paraVenda), custos, diasNoMes(mes));
  const antes = resumirVendas(vendasAnterior.data!.map(paraVenda), custos, diasNoMes(deslocarMes(mes, -1)));
  const estoque = resumirEstoque(lista);

  const ultimaVenda = new Map<string, Date>();
  for (const u of ultimas.data!) {
    if (u.aparelho_id && !ultimaVenda.has(u.aparelho_id)) ultimaVenda.set(u.aparelho_id, new Date(u.criado_em));
  }
  const parados = aparelhosParados(lista, ultimaVenda, new Date());

  const mudanca = variacao(vendas.faturamento, antes.faturamento);
  const maiorForma = Math.max(...vendas.porForma.map((f) => f.valor), 1);

  const destaques = [
    {
      rotulo: "Faturamento",
      valor: formatarPreco(vendas.faturamento),
      detalhe:
        mudanca === null
          ? "Sem vendas no mês anterior para comparar"
          : `${mudanca >= 0 ? "+" : ""}${mudanca.toFixed(0)}% em relação a ${nomeDoMes(deslocarMes(mes, -1)).toLowerCase()}`,
    },
    { rotulo: "Aparelhos vendidos", valor: String(vendas.unidades), detalhe: `${vendas.vendas} venda${vendas.vendas === 1 ? "" : "s"}` },
    { rotulo: "Ticket médio", valor: formatarPreco(vendas.ticketMedio), detalhe: "Valor médio por venda" },
    {
      rotulo: "Lucro estimado",
      valor: formatarPreco(vendas.lucro),
      detalhe: vendas.lucroCompleto ? "Preço de venda menos o custo" : "Algumas vendas não têm custo cadastrado",
    },
  ];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="letreiro text-3xl sm:text-4xl">Relatórios</h1>
        <SeletorMes mes={mes} caminho="/painel/relatorios" />
      </div>

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {destaques.map((d) => (
          <div key={d.rotulo} className={`${cartao} p-4`}>
            <dt className="text-sm text-cinza">{d.rotulo}</dt>
            <dd className="letreiro mt-1 text-xl tabular-nums sm:text-2xl">{d.valor}</dd>
            <dd className="mt-1 text-xs text-cinza">{d.detalhe}</dd>
          </div>
        ))}
      </dl>

      <section className={`${cartao} p-5`} aria-labelledby="titulo-dias">
        <h2 id="titulo-dias" className="text-lg font-bold">
          Vendas por dia
        </h2>
        <div className="mt-8">
          <GraficoDiario dias={vendas.porDia} nomeMes={nomeDoMes(mes)} />
        </div>
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer font-semibold text-cobalto">Ver em tabela</summary>
          <table className="mt-3 w-full max-w-md tabular-nums">
            <thead>
              <tr className="text-left text-cinza">
                <th className="py-1 font-medium">Dia</th>
                <th className="py-1 font-medium">Vendidos</th>
                <th className="py-1 text-right font-medium">Valor</th>
              </tr>
            </thead>
            <tbody>
              {vendas.porDia
                .filter((d) => d.unidades > 0)
                .map((d) => (
                  <tr key={d.dia} className="border-t border-linha">
                    <td className="py-1">{d.dia}</td>
                    <td className="py-1">{d.unidades}</td>
                    <td className="py-1 text-right">{formatarPreco(d.valor)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </details>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={`${cartao} p-5`} aria-labelledby="titulo-formas">
          <h2 id="titulo-formas" className="text-lg font-bold">
            Formas de pagamento
          </h2>
          {vendas.porForma.length === 0 ? (
            <p className="mt-4 text-cinza">Nenhuma venda no mês.</p>
          ) : (
            <ul className="mt-4 grid gap-3">
              {vendas.porForma.map((f) => (
                <li key={f.forma}>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="font-semibold">{NOMES_FORMA[f.forma] ?? f.forma}</span>
                    <span className="tabular-nums text-cinza">
                      {f.unidades} un., {formatarPreco(f.valor)} ({Math.round((f.valor / vendas.faturamento) * 100)}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-2.5 rounded-full bg-gelo">
                    <div className="h-full rounded-full bg-cobalto" style={{ width: `${(f.valor / maiorForma) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={`${cartao} p-5`} aria-labelledby="titulo-mais">
          <h2 id="titulo-mais" className="text-lg font-bold">
            Mais vendidos
          </h2>
          {vendas.maisVendidos.length === 0 ? (
            <p className="mt-4 text-cinza">Nenhuma venda no mês.</p>
          ) : (
            <ol className="mt-4 grid gap-2">
              {vendas.maisVendidos.map((a, i) => (
                <li key={a.descricao} className="flex items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gelo text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-semibold">{a.descricao}</span>
                  <span className="shrink-0 text-sm text-cinza tabular-nums">
                    {a.unidades} un., {formatarPreco(a.valor)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={`${cartao} p-5`} aria-labelledby="titulo-estoque">
          <h2 id="titulo-estoque" className="text-lg font-bold">
            Estoque agora
          </h2>
          <dl className="mt-4 grid gap-2">
            <div className="flex justify-between gap-3">
              <dt className="text-cinza">Unidades na loja</dt>
              <dd className="font-semibold tabular-nums">{estoque.unidades}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-cinza">Valor pelo preço de venda</dt>
              <dd className="font-semibold tabular-nums">{formatarPreco(estoque.valorVenda)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-cinza">Valor pelo custo</dt>
              <dd className="font-semibold tabular-nums">{formatarPreco(estoque.valorCusto)}</dd>
            </div>
          </dl>
          {estoque.semCusto > 0 && (
            <p className="mt-3 text-sm text-cinza">
              {estoque.semCusto} unidade{estoque.semCusto === 1 ? "" : "s"} sem custo cadastrado ficaram fora do valor pelo custo.
            </p>
          )}
        </section>

        <section className={`${cartao} p-5`} aria-labelledby="titulo-parados">
          <h2 id="titulo-parados" className="text-lg font-bold">
            Parados há {DIAS_PARADO} dias ou mais
          </h2>
          {parados.length === 0 ? (
            <p className="mt-4 text-cinza">Nenhum aparelho parado. Tudo girando.</p>
          ) : (
            <ul className="mt-4 grid gap-2">
              {parados.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3">
                  <Link href={`/painel/aparelhos/${p.id}`} className="min-w-0 truncate font-semibold hover:underline">
                    {p.nome}
                  </Link>
                  <span className="shrink-0 text-sm text-cinza tabular-nums">
                    {p.quantidade} un., {p.dias} dias {p.nuncaVendeu ? "sem nenhuma venda" : "desde a última venda"}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {parados.length > 0 && (
            <p className="mt-3 text-sm text-cinza">Vale pensar em promoção ou destaque para esses.</p>
          )}
        </section>
      </div>
    </div>
  );
}
