import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  aparelhos,
  buscarAparelho,
  formatarArmazenamento,
  nomeCompleto,
} from "@/lib/aparelhos";
import { CelularGiratorio } from "@/components/CelularGiratorio";
import { CartaoAparelho, Etiqueta } from "@/components/CartaoAparelho";
import { Compra } from "@/components/Compra";

export function generateStaticParams() {
  return aparelhos.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: PageProps<"/iphones/[id]">): Promise<Metadata> {
  const aparelho = buscarAparelho((await params).id);
  return { title: aparelho ? nomeCompleto(aparelho) : "Aparelho não encontrado" };
}

export default async function PaginaAparelho({ params }: PageProps<"/iphones/[id]">) {
  const aparelho = buscarAparelho((await params).id);
  if (!aparelho) notFound();

  const esgotado = aparelho.quantidade === 0;

  const parecidos = aparelhos
    .filter((a) => a.id !== aparelho.id && a.modelo === aparelho.modelo && a.quantidade > 0)
    .slice(0, 4);

  const ficha = [
    ["Modelo", aparelho.modelo],
    ["Armazenamento", formatarArmazenamento(aparelho.armazenamento)],
    ["Cor", aparelho.cor],
    ["Estado", aparelho.estado === "novo" ? "Novo, lacrado" : "Seminovo, revisado"],
    ...(aparelho.bateria ? [["Saúde da bateria", `${aparelho.bateria}%`]] : []),
    ["Disponível", esgotado ? "Esgotado" : aparelho.quantidade === 1 ? "Última unidade" : `${aparelho.quantidade} unidades`],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/iphones" className="text-sm font-semibold underline underline-offset-4 hover:no-underline">
        Voltar para os iPhones
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <CelularGiratorio modelo={aparelho.modelo} corHex={aparelho.corHex} esgotado={esgotado} />

        <div>
          <h1 className="letreiro text-4xl sm:text-5xl">{aparelho.modelo}</h1>
          <p className="mt-3 text-lg text-cinza">
            {formatarArmazenamento(aparelho.armazenamento)}, {aparelho.cor}
          </p>

          <div className="mt-6">
            <Etiqueta aparelho={aparelho} grande />
          </div>

          <Compra aparelho={aparelho} />

          <dl className="mt-10 border-t border-linha">
            {ficha.map(([rotulo, valor]) => (
              <div key={rotulo} className="flex justify-between gap-4 border-b border-linha py-3">
                <dt className="text-cinza">{rotulo}</dt>
                <dd className="text-right font-semibold">{valor}</dd>
              </div>
            ))}
          </dl>
          {!esgotado && (
            <Link
              href={`/comparar?a=${aparelho.id}`}
              className="mt-4 inline-block font-semibold underline underline-offset-4 hover:no-underline"
            >
              Comparar com outro iPhone
            </Link>
          )}
        </div>
      </div>

      {parecidos.length > 0 && (
        <section className="mt-16">
          <h2 className="letreiro mb-6 text-2xl sm:text-3xl">Outras opções de {aparelho.modelo}</h2>
          <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {parecidos.map((a) => (
              <CartaoAparelho key={a.id} aparelho={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
