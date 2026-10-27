import Link from "next/link";
import { deslocarMes, mesDe, nomeDoMes } from "@/lib/painel/periodo";

// Anterior / mês atual / próximo, mantendo os outros filtros da página
export function SeletorMes({ mes, caminho, outros = {} }: { mes: string; caminho: string; outros?: Record<string, string> }) {
  const href = (m: string) => `${caminho}?${new URLSearchParams({ ...outros, mes: m })}`;
  const atual = mesDe(new Date());
  const noFuturo = deslocarMes(mes, 1) > atual;

  return (
    <div className="flex items-center gap-1 rounded-full bg-papel p-1 ring-1 ring-linha">
      <Link
        href={href(deslocarMes(mes, -1))}
        aria-label="Mês anterior"
        className="pressiona flex size-9 items-center justify-center rounded-full hover:bg-gelo"
      >
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </Link>
      <span className="min-w-36 text-center text-sm font-semibold" aria-live="polite">
        {nomeDoMes(mes)}
      </span>
      {noFuturo ? (
        <span className="size-9" aria-hidden />
      ) : (
        <Link
          href={href(deslocarMes(mes, 1))}
          aria-label="Próximo mês"
          className="pressiona flex size-9 items-center justify-center rounded-full hover:bg-gelo"
        >
          <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        </Link>
      )}
    </div>
  );
}
