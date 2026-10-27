import type { Metadata } from "next";
import { listarAparelhos } from "@/lib/estoque";
import { AvaliacaoTroca } from "./AvaliacaoTroca";

export const metadata: Metadata = { title: "Avaliar meu iPhone usado" };

export default async function PaginaTroca({ searchParams }: PageProps<"/troca">) {
  const { por } = await searchParams;
  const disponiveis = (await listarAparelhos()).filter((a) => a.quantidade > 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="letreiro text-4xl sm:text-5xl">Quanto vale o seu iPhone?</h1>
      <p className="mt-4 max-w-xl text-lg">
        Responda sobre o seu aparelho e veja uma estimativa na hora. Ele entra como parte do pagamento
        de um iPhone da loja.
      </p>
      <AvaliacaoTroca disponiveis={disponiveis} porInicial={typeof por === "string" ? por : ""} />
    </div>
  );
}
