import type { Metadata } from "next";
import Link from "next/link";
import { Marca } from "@/components/Cabecalho";
import { bancoConfigurado } from "@/lib/supabase/config";
import { FormEntrada } from "./FormEntrada";

export const metadata: Metadata = { title: "Entrar no painel" };

const ERROS: Record<string, string> = {
  "sem-acesso": "Sua conta não tem acesso ao painel. Peça ao dono da loja para liberar.",
};

export default async function Entrar({ searchParams }: PageProps<"/painel/entrar">) {
  const { erro } = await searchParams;
  const aviso = typeof erro === "string" ? ERROS[erro] : undefined;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-gelo">
      <header className="bg-marinho text-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" aria-label="Voltar ao site">
            <Marca />
          </Link>
          <Link href="/" className="text-sm font-semibold hover:text-coral">
            Ver o site
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-16">
        <div className="w-full max-w-sm rounded-2xl bg-papel p-7 ring-1 ring-linha">
          <h1 className="letreiro text-3xl">Painel da loja</h1>
          <p className="mt-2 text-cinza">Entre com o e-mail e a senha que o dono da loja cadastrou.</p>
          {aviso && (
            <p role="alert" className="mt-4 rounded-lg bg-alerta/10 px-3 py-2 text-sm font-medium text-alerta">
              {aviso}
            </p>
          )}
          <div className="mt-6">
            {bancoConfigurado ? (
              <FormEntrada />
            ) : (
              <p className="rounded-lg bg-gelo px-3 py-3 text-sm">
                O banco de dados ainda não está ligado nesta versão do site, então o painel está
                fechado. Rode o projeto localmente com o Supabase para usar o estoque.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
