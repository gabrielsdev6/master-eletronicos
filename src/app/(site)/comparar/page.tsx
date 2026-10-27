import type { Metadata } from "next";
import { listarAparelhos } from "@/lib/estoque";
import { Comparador } from "./Comparador";

export const metadata: Metadata = { title: "Comparar iPhones" };

export default async function PaginaComparar({ searchParams }: PageProps<"/comparar">) {
  const { a, b } = await searchParams;
  const opcoes = (await listarAparelhos()).filter((x) => x.quantidade > 0);
  if (opcoes.length < 2) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="letreiro text-4xl sm:text-5xl">Comparar iPhones</h1>
        <p className="mt-4 text-lg">Precisa ter pelo menos dois aparelhos à venda para comparar. Volte daqui a pouco.</p>
      </div>
    );
  }
  const existe = (id: unknown) => typeof id === "string" && opcoes.some((o) => o.id === id);

  const primeiro = existe(a) ? (a as string) : opcoes[0].id;
  // Sem o segundo escolhido, sugere o de preço mais próximo (outro modelo)
  const base = opcoes.find((o) => o.id === primeiro)!;
  const sugestao = opcoes
    .filter((o) => o.modelo !== base.modelo)
    .sort((x, y) => Math.abs(x.preco - base.preco) - Math.abs(y.preco - base.preco))[0];
  const segundo = existe(b) && b !== primeiro ? (b as string) : (sugestao ?? opcoes.find((o) => o.id !== primeiro)!).id;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="letreiro text-4xl sm:text-5xl">Comparar iPhones</h1>
      <Comparador opcoes={opcoes} inicial={[primeiro, segundo]} />
    </div>
  );
}
