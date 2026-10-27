import type { Metadata } from "next";
import Link from "next/link";
import { FormAparelho } from "../FormAparelho";

export const metadata: Metadata = { title: "Cadastrar aparelho" };

export default function NovoAparelho() {
  return (
    <div className="max-w-3xl">
      <Link href="/painel" className="text-sm font-semibold text-cobalto hover:underline">
        Voltar ao estoque
      </Link>
      <h1 className="letreiro mt-3 text-3xl sm:text-4xl">Cadastrar aparelho</h1>
      <p className="mt-2 text-cinza">Depois de cadastrar, você adiciona as fotos.</p>
      <div className="mt-6">
        <FormAparelho />
      </div>
    </div>
  );
}
