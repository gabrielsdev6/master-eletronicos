import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import type { Aparelho } from "./aparelhos";
import { aparelhosExemplo } from "./exemplo";
import { clientePublico } from "./supabase/publico";
import { bancoConfigurado, urlDaFoto } from "./supabase/config";

const CAMPOS =
  "slug, modelo, armazenamento, cor, cor_hex, estado, bateria, preco, quantidade, destaque, fotos(caminho, ordem)";

type Linha = {
  slug: string;
  modelo: string;
  armazenamento: number;
  cor: string;
  cor_hex: string;
  estado: Aparelho["estado"];
  bateria: number | null;
  preco: number;
  quantidade: number;
  destaque: boolean;
  fotos: { caminho: string; ordem: number }[];
};

function paraAparelho(l: Linha): Aparelho {
  return {
    id: l.slug,
    modelo: l.modelo,
    armazenamento: l.armazenamento,
    cor: l.cor,
    corHex: l.cor_hex,
    estado: l.estado,
    bateria: l.bateria ?? undefined,
    preco: Number(l.preco),
    quantidade: l.quantidade,
    destaque: l.destaque,
    fotos: [...l.fotos].sort((a, b) => a.ordem - b.ordem).map((f) => urlDaFoto(f.caminho)),
  };
}

/**
 * Aparelhos à venda no site (ativos), do mais caro para o mais barato.
 * Lido a cada visita, então o que a equipe muda no painel aparece na hora.
 */
export const listarAparelhos = cache(async (): Promise<Aparelho[]> => {
  if (!bancoConfigurado) return aparelhosExemplo;
  await connection();
  const { data, error } = await clientePublico()
    .from("aparelhos")
    .select(CAMPOS)
    .eq("ativo", true)
    .order("preco", { ascending: false });
  if (error) throw error;
  return (data as Linha[]).map(paraAparelho);
});

export async function buscarAparelho(slug: string) {
  const lista = await listarAparelhos();
  return lista.find((a) => a.id === slug);
}
