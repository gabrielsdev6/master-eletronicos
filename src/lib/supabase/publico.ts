import { createClient } from "@supabase/supabase-js";
import type { Database } from "./banco.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Cliente com a chave pública. Só enxerga o que o RLS libera para visitantes:
 * aparelhos ativos e as fotos deles.
 */
export function clientePublico() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}
