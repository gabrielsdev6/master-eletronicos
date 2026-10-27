import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./banco.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/** Cliente no navegador, com a sessão do painel. Usado para enviar fotos direto ao storage. */
export function clienteNavegador() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}
