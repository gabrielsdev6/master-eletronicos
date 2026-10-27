import Link from "next/link";
import { aparelhos, formatarPreco, listarModelos } from "@/lib/aparelhos";

// Faixa de LED da fachada: modelos com estoque e o menor preço de cada um
export function Letreiro() {
  const itens = listarModelos()
    .map((modelo) => {
      const disponiveis = aparelhos.filter((a) => a.modelo === modelo && a.quantidade > 0);
      if (disponiveis.length === 0) return null;
      return { modelo, desde: Math.min(...disponiveis.map((a) => a.preco)) };
    })
    .filter((i) => i !== null);

  const faixa = (copia: boolean) => (
    <ul className="letreiro-faixa" aria-hidden={copia || undefined}>
      {itens.map((i) => (
        <li key={i.modelo} className="flex items-center gap-3">
          <span className="size-2 rotate-45 bg-coral" aria-hidden />
          <Link
            href={`/iphones?modelo=${encodeURIComponent(i.modelo)}`}
            tabIndex={copia ? -1 : undefined}
            className="whitespace-nowrap hover:underline"
          >
            <span className="font-bold text-white">{i.modelo}</span>{" "}
            <span className="text-coral">desde {formatarPreco(i.desde)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Modelos na loja agora" className="letreiro-led overflow-hidden bg-marinho py-4">
      <div className="letreiro-trilho flex w-max">
        {faixa(false)}
        {faixa(true)}
      </div>
    </section>
  );
}
