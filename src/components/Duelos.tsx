import Link from "next/link";
import { duelosProntos, resumoComparacao } from "@/lib/comparar";
import { Celular } from "./Celular";

// Comparações prontas das dúvidas mais comuns, com a frase gerada dos preços do estoque
export function Duelos() {
  const duelos = duelosProntos();
  if (duelos.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="letreiro text-3xl sm:text-4xl">Em dúvida entre dois?</h2>
        <Link href="/comparar" className="font-semibold underline underline-offset-4 hover:no-underline">
          Montar outra comparação
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {duelos.map(([a, b]) => (
          <Link
            key={`${a.id}-${b.id}`}
            href={`/comparar?a=${a.id}&b=${b.id}`}
            className="cartao group flex flex-col rounded-2xl bg-nevoa p-5"
          >
            <div className="flex h-40 items-center justify-center gap-3" aria-hidden>
              <Celular modelo={a.modelo} corHex={a.corHex} className="w-[19%]" />
              <span className="letreiro flex size-10 shrink-0 items-center justify-center rounded-full bg-amarelo text-lg">
                x
              </span>
              <Celular modelo={b.modelo} corHex={b.corHex} className="w-[19%]" />
            </div>
            <h3 className="mt-4 text-lg font-bold underline-offset-4 group-hover:underline">
              {a.modelo} ou {b.modelo}?
            </h3>
            <p className="mt-1 text-cinza">{resumoComparacao(a, b)}</p>
            <span className="mt-4 text-sm font-semibold">Ver comparação completa</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
