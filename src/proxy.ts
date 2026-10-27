import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, bancoConfigurado } from "@/lib/supabase/config";

/**
 * Roda antes de cada página do painel: renova a sessão e manda quem não está logado
 * para a tela de entrada. É só a primeira barreira: cada página e ação confere de novo.
 */
export async function proxy(request: NextRequest) {
  const entrando = request.nextUrl.pathname.startsWith("/painel/entrar");
  if (!bancoConfigurado) {
    return entrando ? NextResponse.next() : NextResponse.redirect(new URL("/painel/entrar", request.url));
  }

  let resposta = NextResponse.next({ request });
  const sb = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (lista) => {
        for (const { name, value } of lista) request.cookies.set(name, value);
        resposta = NextResponse.next({ request });
        for (const { name, value, options } of lista) resposta.cookies.set(name, value, options);
      },
    },
  });

  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user && !entrando) {
    return NextResponse.redirect(new URL("/painel/entrar", request.url));
  }
  return resposta;
}

export const config = {
  matcher: ["/painel/:path*"],
};
