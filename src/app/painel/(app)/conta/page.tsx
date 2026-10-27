import type { Metadata } from "next";
import { exigirEquipe } from "@/lib/painel/sessao";
import { cartao } from "@/components/painel/estilos";
import { FormSenha } from "./FormSenha";

export const metadata: Metadata = { title: "Minha conta" };

export default async function Conta() {
  const { nome, email, papel } = await exigirEquipe();

  return (
    <div className="grid max-w-xl gap-6">
      <div>
        <h1 className="letreiro text-3xl sm:text-4xl">Minha conta</h1>
        <p className="mt-2 text-cinza">
          {nome}, {email}, {papel === "dono" ? "dono" : "funcionário"}
        </p>
      </div>
      <section className={`${cartao} p-5`} aria-labelledby="titulo-senha">
        <h2 id="titulo-senha" className="text-lg font-bold">
          Trocar senha
        </h2>
        <div className="mt-4">
          <FormSenha />
        </div>
      </section>
    </div>
  );
}
