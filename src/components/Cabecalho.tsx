import Link from "next/link";
import { linkWhatsApp } from "@/lib/loja";
import { IconeConversa } from "./Icones";

export function Marca() {
  return (
    <span className="flex items-baseline gap-1.5 leading-none">
      <span className="letreiro text-2xl text-amarelo">Master</span>
      <span className="hidden text-sm font-semibold text-white/80 min-[420px]:inline">Eletrônicos</span>
    </span>
  );
}

export function Cabecalho() {
  return (
    <header className="bg-preto text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" aria-label="Master Eletrônicos, página inicial">
          <Marca />
        </Link>
        <nav className="flex items-center gap-1 text-sm font-semibold sm:gap-2">
          <Link href="/iphones" className="rounded px-2 py-2 hover:text-amarelo sm:px-3">
            iPhones
          </Link>
          <Link href="/troca" className="rounded px-2 py-2 hover:text-amarelo sm:px-3">
            Troca
          </Link>
          <Link href="/comparar" className="hidden rounded px-3 py-2 hover:text-amarelo sm:block">
            Comparar
          </Link>
          <Link href="/#endereco" className="hidden rounded px-3 py-2 hover:text-amarelo md:block">
            Endereço
          </Link>
          <a
            href={linkWhatsApp("Olá! Vim pelo site da Master Eletrônicos.")}
            target="_blank"
            rel="noopener noreferrer"
            className="pressiona ml-1 flex items-center gap-2 rounded-full bg-amarelo px-4 py-2 text-preto hover:bg-amarelo-escuro"
          >
            <IconeConversa className="size-4" />
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="sm:hidden">Chamar</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
