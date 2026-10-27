import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./banco.types";
import { SUPABASE_URL } from "./config";

/**
 * Cliente com a chave de serviço: passa por cima do RLS. Usado só para criar contas de
 * acesso, depois de conferir que quem pediu é o dono. Nunca vai para o navegador.
 */
export function clienteServico() {
  return createClient<Database>(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}
