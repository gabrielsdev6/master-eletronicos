"use server";

import { redirect } from "next/navigation";
import { clienteServidor } from "@/lib/supabase/servidor";

export type EstadoEntrada = { erro?: string; email?: string };

/**
 * Entra no painel com e-mail e senha. A mesma mensagem vale para e-mail ou senha errados,
 * para ninguém descobrir quais e-mails têm conta. Quem entra mas não tem acesso ativo
 * é barrado pelo painel logo em seguida.
 */
export async function entrar(_: EstadoEntrada, form: FormData): Promise<EstadoEntrada> {
  const email = String(form.get("email") ?? "")
    .trim()
    .toLowerCase();
  const senha = String(form.get("senha") ?? "");
  if (!email || !senha) return { erro: "Preencha o e-mail e a senha.", email };

  const sb = await clienteServidor();
  const { error } = await sb.auth.signInWithPassword({ email, password: senha });
  if (error) {
    if (error.status === 429) {
      return { erro: "Muitas tentativas seguidas. Espere alguns minutos e tente de novo.", email };
    }
    if (error.code !== "invalid_credentials") console.error("entrada falhou", error);
    return { erro: "E-mail ou senha incorretos.", email };
  }
  redirect("/painel");
}

export async function sair(): Promise<void> {
  const sb = await clienteServidor();
  await sb.auth.signOut();
  redirect("/painel/entrar");
}
