import type { Metadata } from "next";
import { exigirDono } from "@/lib/painel/sessao";
import { cartao } from "@/components/painel/estilos";
import { FormAcesso } from "./FormAcesso";
import { ControlesAcesso } from "./ControlesAcesso";

export const metadata: Metadata = { title: "Acessos" };

export default async function Acessos() {
  const { sb, usuarioId } = await exigirDono();
  const { data: acessos, error } = await sb
    .from("acessos")
    .select("usuario_id, nome, email, papel, ativo")
    .order("criado_em");
  if (error) throw error;

  return (
    <div className="grid max-w-3xl gap-6">
      <div>
        <h1 className="letreiro text-3xl sm:text-4xl">Acessos</h1>
        <p className="mt-2 text-cinza">
          Quem pode entrar no painel. Funcionários vendem, dão entrada e cadastram aparelhos. Só o dono vê esta tela.
        </p>
      </div>

      <section className={cartao} aria-labelledby="titulo-equipe">
        <h2 id="titulo-equipe" className="border-b border-linha px-5 py-3 text-lg font-bold">
          Equipe
        </h2>
        <ul className="divide-y divide-linha">
          {acessos.map((a) => (
            <li key={a.usuario_id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <p className="font-semibold">
                  {a.nome}
                  {a.usuario_id === usuarioId && <span className="font-normal text-cinza"> (você)</span>}
                </p>
                <p className="truncate text-sm text-cinza">
                  {a.email}, {a.papel === "dono" ? "dono" : "funcionário"}
                  {!a.ativo && ", sem acesso"}
                </p>
              </div>
              {a.usuario_id !== usuarioId && (
                <ControlesAcesso usuarioId={a.usuario_id} nome={a.nome} papel={a.papel} ativo={a.ativo} />
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className={`${cartao} p-5`} aria-labelledby="titulo-novo">
        <h2 id="titulo-novo" className="text-lg font-bold">
          Dar acesso a alguém
        </h2>
        <p className="mt-1 text-sm text-cinza">
          Crie o login e passe o e-mail e a senha para a pessoa. Ela pode trocar a senha depois em Minha conta.
        </p>
        <div className="mt-5">
          <FormAcesso />
        </div>
      </section>
    </div>
  );
}
