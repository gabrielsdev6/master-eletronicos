import Link from "next/link";
import { Marca } from "@/components/Cabecalho";
import { MenuPainel } from "@/components/painel/MenuPainel";
import { exigirEquipe } from "@/lib/painel/sessao";
import { sair } from "../entrar/acoes";

export default async function LayoutPainel({ children }: LayoutProps<"/painel">) {
  const { nome, papel } = await exigirEquipe();

  const itens = [
    { href: "/painel", rotulo: "Estoque" },
    { href: "/painel/movimentacoes", rotulo: "Vendas e entradas" },
    { href: "/painel/relatorios", rotulo: "Relatórios" },
    ...(papel === "dono" ? [{ href: "/painel/acessos", rotulo: "Acessos" }] : []),
    { href: "/painel/conta", rotulo: "Minha conta" },
  ];

  return (
    <div className="flex min-h-full flex-1 flex-col bg-gelo">
      <header className="bg-marinho text-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <Link href="/painel" aria-label="Painel, estoque">
              <Marca />
            </Link>
            <span className="hidden rounded bg-white/10 px-2 py-0.5 text-xs sm:inline">Painel</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-white/70 sm:inline">
              {nome} ({papel === "dono" ? "dono" : "funcionário"})
            </span>
            <Link href="/" className="font-semibold hover:text-coral">
              Ver o site
            </Link>
            <form action={sair}>
              <button type="submit" className="pressiona rounded-full px-3 py-1.5 font-semibold ring-1 ring-white/25 hover:ring-coral">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 py-6 md:grid-cols-[12rem_1fr]">
        <aside className="md:sticky md:top-6 md:self-start">
          <MenuPainel itens={itens} />
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
