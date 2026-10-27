import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { clienteServidor } from "../supabase/servidor";

export type Papel = "dono" | "funcionario";

/**
 * Garante que quem está acessando faz parte da equipe (acesso ativo).
 * Devolve o cliente do Supabase já com a sessão; o RLS libera o estoque para a equipe.
 * O `cache` do React evita repetir a checagem na mesma requisição.
 */
export const exigirEquipe = cache(async () => {
  const sb = await clienteServidor();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/painel/entrar");

  const { data: acesso } = await sb
    .from("acessos")
    .select("nome, email, papel, ativo")
    .eq("usuario_id", user.id)
    .maybeSingle();
  if (!acesso?.ativo) redirect("/painel/entrar?erro=sem-acesso");

  return { sb, usuarioId: user.id, nome: acesso.nome, email: acesso.email, papel: acesso.papel as Papel };
});

/** Só o dono passa: usado em acessos (dar e tirar acesso). */
export async function exigirDono() {
  const sessao = await exigirEquipe();
  if (sessao.papel !== "dono") redirect("/painel?erro=so-dono");
  return sessao;
}
