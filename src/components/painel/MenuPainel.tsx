"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type ItemMenu = { href: string; rotulo: string };

// Navegação do painel: lateral no computador, faixa que rola no celular
export function MenuPainel({ itens }: { itens: ItemMenu[] }) {
  const caminho = usePathname();
  const ativo = (href: string) =>
    href === "/painel" ? caminho === "/painel" || caminho.startsWith("/painel/aparelhos") : caminho.startsWith(href);

  return (
    <nav aria-label="Painel" className="rolagem-x -mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:flex-col md:px-0">
      {itens.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          aria-current={ativo(i.href) ? "page" : undefined}
          className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-cinza hover:bg-papel hover:text-marinho aria-[current=page]:bg-papel aria-[current=page]:text-cobalto aria-[current=page]:ring-1 aria-[current=page]:ring-linha"
        >
          {i.rotulo}
        </Link>
      ))}
    </nav>
  );
}
