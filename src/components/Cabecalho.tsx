import Link from "next/link";
import { linkWhatsApp } from "@/lib/loja";
import { IconeConversa } from "./Icones";
import { MenuCelular } from "./MenuCelular";

const LINKS = [
  { href: "/iphones", rotulo: "iPhones" },
  { href: "/comparar", rotulo: "Comparar" },
  { href: "/troca", rotulo: "Troca" },
  { href: "/#endereco", rotulo: "Endereço" },
];

export function Marca() {
  return (
    <span className="flex items-baseline gap-1.5 leading-none">
      <span className="letreiro text-2xl text-amarelo">Master</span>
      <span className="text-sm font-semibold text-white/80">Eletrônicos</span>
    </span>
  );
}

export function Cabecalho() {
  return (
    <header className="relative z-40 bg-preto text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" aria-label="Master Eletrônicos, página inicial">
          <Marca />
        </Link>
        <div className="flex items-center gap-2">
          <nav aria-label="Principal" className="hidden items-center gap-1 text-sm font-semibold md:flex">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="rounded px-3 py-2 hover:text-amarelo">
                {l.rotulo}
              </Link>
            ))}
          </nav>
          <a
            href={linkWhatsApp("Olá! Vim pelo site da Master Eletrônicos.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chamar no WhatsApp"
            className="pressiona flex items-center gap-2 rounded-full bg-amarelo px-3 py-2.5 text-sm font-semibold text-preto hover:bg-amarelo-escuro md:ml-1 md:px-4 md:py-2"
          >
            <IconeConversa className="size-5 md:size-4" />
            <span className="hidden md:inline">WhatsApp</span>
          </a>
          <MenuCelular links={LINKS} />
        </div>
      </div>
    </header>
  );
}
