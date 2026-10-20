import type { Metadata } from "next";
import Link from "next/link";
import { aparelhos, listarArmazenamentos, listarModelos } from "@/lib/aparelhos";
import { Catalogo } from "./Catalogo";

export const metadata: Metadata = { title: "iPhones" };

function texto(v: string | string[] | undefined) {
  return typeof v === "string" ? v : undefined;
}

export default async function PaginaCatalogo({ searchParams }: PageProps<"/iphones">) {
  const sp = await searchParams;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="letreiro text-4xl sm:text-5xl">iPhones</h1>
        <Link href="/comparar" className="font-semibold underline underline-offset-4 hover:no-underline">
          Comparar dois aparelhos
        </Link>
      </div>
      <Catalogo
        aparelhos={aparelhos}
        modelos={listarModelos()}
        armazenamentos={listarArmazenamentos()}
        inicial={{ modelo: texto(sp.modelo), gb: texto(sp.gb), estado: texto(sp.estado) }}
      />
    </div>
  );
}
