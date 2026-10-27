import type { Metadata } from "next";
import Link from "next/link";
import { formatarPreco } from "@/lib/aparelhos";
import { listarEstoque } from "@/lib/painel/dados";
import { botaoPrimario, cartao } from "@/components/painel/estilos";
import { EstoqueLista } from "./EstoqueLista";

export const metadata: Metadata = { title: "Estoque" };

export default async function Estoque({ searchParams }: PageProps<"/painel">) {
  const { erro } = await searchParams;
  const itens = await listarEstoque();
  const ativos = itens.filter((i) => i.ativo);

  const unidades = ativos.reduce((s, i) => s + i.quantidade, 0);
  const valor = ativos.reduce((s, i) => s + i.quantidade * i.preco, 0);
  const esgotados = ativos.filter((i) => i.quantidade === 0).length;

  const resumo = [
    { rotulo: "Aparelhos à venda", valor: String(ativos.length - esgotados) },
    { rotulo: "Unidades na loja", valor: String(unidades) },
    { rotulo: "Valor em estoque", valor: formatarPreco(valor) },
    { rotulo: "Esgotados", valor: String(esgotados) },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="letreiro text-3xl sm:text-4xl">Estoque</h1>
        <Link href="/painel/aparelhos/novo" className={botaoPrimario}>
          Cadastrar aparelho
        </Link>
      </div>

      {erro === "so-dono" && (
        <p role="alert" className="mt-4 rounded-lg bg-alerta/10 px-4 py-3 text-sm font-medium text-alerta">
          Só o dono da loja pode abrir a tela de acessos.
        </p>
      )}

      <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {resumo.map((r) => (
          <div key={r.rotulo} className={`${cartao} p-4`}>
            <dt className="text-sm text-cinza">{r.rotulo}</dt>
            <dd className="letreiro mt-1 text-xl tabular-nums sm:text-2xl">{r.valor}</dd>
          </div>
        ))}
      </dl>

      <EstoqueLista itens={itens} />
    </div>
  );
}
