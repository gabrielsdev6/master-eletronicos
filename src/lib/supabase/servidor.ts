import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./banco.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Cliente com a sessão de quem está logado (lida dos cookies). O RLS vale normalmente:
 * a equipe vê o estoque inteiro, visitantes só o que está à venda.
 */
export async function clienteServidor() {
  const loja = await cookies();
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => loja.getAll(),
      setAll: (lista) => {
        try {
          for (const { name, value, options } of lista) loja.set(name, value, options);
        } catch {
          // Chamado de um Server Component, que não pode gravar cookies.
          // O proxy renova a sessão na próxima requisição.
        }
      },
    },
  });
}
