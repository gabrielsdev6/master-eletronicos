import type { Metadata } from "next";
import Link from "next/link";
import { formatarPreco } from "@/lib/aparelhos";
import { listarMovimentacoes, type Movimentacao } from "@/lib/painel/movimentacoes";
import { intervaloDoMes, mesDe, mesValido } from "@/lib/painel/periodo";
import { cartao } from "@/components/painel/estilos";
import { SeletorMes } from "@/components/painel/SeletorMes";
import { TabelaMovimentacoes } from "@/components/painel/TabelaMovimentacoes";

export const metadata: Metadata = { title: "Vendas e entradas" };

const FILTROS: { valor: string; rotulo: string }[] = [
  { valor: "", rotulo: "Tudo" },
  { valor: "venda", rotulo: "Vendas" },
  { valor: "entrada", rotulo: "Entradas" },
  { valor: "ajuste", rotulo: "Ajustes" },
];

export default async function Movimentacoes({ searchParams }: PageProps<"/painel/movimentacoes">) {
  const sp = await searchParams;
  const mes = mesValido(sp.mes) ? sp.mes : mesDe(new Date());
  const tipo = FILTROS.some((f) => f.valor && f.valor === sp.tipo) ? (sp.tipo as Movimentacao["tipo"]) : undefined;

  const itens = await listarMovimentacoes({ ...intervaloDoMes(mes), tipo });
  const vendas = itens.filter((m) => m.tipo === "venda");
  const unidades = vendas.reduce((s, m) => s - m.quantidade, 0);
  const faturamento = vendas.reduce((s, m) => s - m.quantidade * (m.precoUnitario ?? 0), 0);
  const entradas = itens.filter((m) => m.tipo === "entrada").reduce((s, m) => s + m.quantidade, 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="letreiro text-3xl sm:text-4xl">Vendas e entradas</h1>
        <SeletorMes mes={mes} caminho="/painel/movimentacoes" outros={tipo ? { tipo } : {}} />
      </div>

      <p className="mt-3 text-cinza">
        {tipo === "entrada" || tipo === "ajuste"
          ? `${itens.length} registro${itens.length === 1 ? "" : "s"} no mês.`
          : `${unidades} aparelho${unidades === 1 ? "" : "s"} vendido${unidades === 1 ? "" : "s"}, ${formatarPreco(faturamento)} em vendas${
              tipo ? "" : `, ${entradas} unidade${entradas === 1 ? "" : "s"} de entrada`
            }.`}
      </p>

      <nav aria-label="Filtrar por tipo" className="mt-5 flex flex-wrap gap-2">
        {FILTROS.map((f) => {
          const ativo = (f.valor || undefined) === tipo;
          const params = new URLSearchParams({ mes, ...(f.valor ? { tipo: f.valor } : {}) });
          return (
            <Link
              key={f.rotulo}
              href={`/painel/movimentacoes?${params}`}
              aria-current={ativo ? "true" : undefined}
              className="pressiona rounded-full border border-linha bg-papel px-4 py-1.5 text-sm font-semibold hover:border-marinho aria-[current=true]:border-cobalto aria-[current=true]:bg-cobalto aria-[current=true]:text-white"
            >
              {f.rotulo}
            </Link>
          );
        })}
      </nav>

      <section className={`${cartao} mt-4 overflow-hidden`}>
        <TabelaMovimentacoes itens={itens} />
      </section>
    </div>
  );
}
