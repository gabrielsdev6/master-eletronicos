"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Menu do celular: abre por baixo do cabeçalho com todas as páginas
export function MenuCelular({ links }: { links: { href: string; rotulo: string }[] }) {
  const [aberto, setAberto] = useState(false);
  const caminho = usePathname();

  // Fecha ao trocar de página
  const [caminhoAnterior, setCaminhoAnterior] = useState(caminho);
  if (caminho !== caminhoAnterior) {
    setCaminhoAnterior(caminho);
    setAberto(false);
  }

  useEffect(() => {
    if (!aberto) return;
    const fechar = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", fechar);
    return () => window.removeEventListener("keydown", fechar);
  }, [aberto]);

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-controls="menu-celular"
        aria-label={aberto ? "Fechar menu" : "Abrir menu"}
        className="pressiona flex size-10 items-center justify-center rounded-full ring-1 ring-white/25 hover:ring-amarelo md:hidden"
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
          <path
            d={aberto ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {aberto && (
        <nav
          id="menu-celular"
          aria-label="Menu"
          className="menu-celular absolute inset-x-0 top-16 z-50 border-t border-white/10 bg-preto px-4 pb-6 pt-2 md:hidden"
        >
          <ul>
            {links.map((l) => (
              <li key={l.href} className="border-b border-white/10">
                <Link
                  href={l.href}
                  onClick={() => setAberto(false)}
                  aria-current={caminho === l.href ? "page" : undefined}
                  className="letreiro block py-4 text-2xl hover:text-amarelo aria-[current=page]:text-amarelo"
                >
                  {l.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
