import Link from "next/link";
import { enderecoCompleto, linkWhatsApp, loja } from "@/lib/loja";
import { Marca } from "./Cabecalho";

export function Rodape() {
  return (
    <footer className="mt-auto bg-marinho text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div className="space-y-3">
          <Marca />
          <p className="max-w-xs text-sm text-white/70">{enderecoCompleto}</p>
        </div>
        <div className="space-y-1 text-sm">
          <p className="mb-2 font-semibold text-coral">Horário</p>
          {loja.horario.map((h) => (
            <p key={h.dias} className="text-white/80">
              {h.dias}: {h.horas}
            </p>
          ))}
        </div>
        <div className="flex flex-col items-start gap-2 text-sm">
          <Link href="/iphones" className="hover:text-coral">
            Ver todos os iPhones
          </Link>
          <Link href="/comparar" className="hover:text-coral">
            Comparar iPhones
          </Link>
          <Link href="/troca" className="hover:text-coral">
            Avaliar meu usado na troca
          </Link>
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-coral"
          >
            Falar no WhatsApp
          </a>
          <Link href="/painel" className="text-white/50 hover:text-coral">
            Área da loja
          </Link>
        </div>
      </div>
    </footer>
  );
}
