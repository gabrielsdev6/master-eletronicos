// Sem as variáveis do Supabase o site roda com os dados de exemplo e o painel fica fechado.
// Assim a versão publicada continua no ar mesmo antes de existir um banco na nuvem.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const bancoConfigurado = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export function urlDaFoto(caminho: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/fotos/${caminho}`;
}
