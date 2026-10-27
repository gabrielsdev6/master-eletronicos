import "server-only";
import { exigirEquipe } from "./sessao";
import { urlDaFoto } from "../supabase/config";
import type { ItemEstoque } from "./tipos";

const CAMPOS =
  "id, slug, modelo, armazenamento, cor, cor_hex, estado, bateria, preco, custo, quantidade, destaque, ativo, observacao, fotos(caminho, ordem)";

type Linha = {
  id: string;
  slug: string;
  modelo: string;
  armazenamento: number;
  cor: string;
  cor_hex: string;
  estado: "novo" | "seminovo";
  bateria: number | null;
  preco: number;
  custo: number | null;
  quantidade: number;
  destaque: boolean;
  ativo: boolean;
  observacao: string | null;
  fotos: { caminho: string; ordem: number }[];
};

function paraItem(l: Linha): ItemEstoque {
  const capa = [...l.fotos].sort((a, b) => a.ordem - b.ordem)[0];
  return {
    id: l.id,
    slug: l.slug,
    modelo: l.modelo,
    armazenamento: l.armazenamento,
    cor: l.cor,
    corHex: l.cor_hex,
    estado: l.estado,
    bateria: l.bateria,
    preco: Number(l.preco),
    custo: l.custo === null ? null : Number(l.custo),
    quantidade: l.quantidade,
    destaque: l.destaque,
    ativo: l.ativo,
    observacao: l.observacao,
    capa: capa ? urlDaFoto(capa.caminho) : null,
  };
}

/** Todos os aparelhos, inclusive arquivados, do mais caro para o mais barato. */
export async function listarEstoque(): Promise<ItemEstoque[]> {
  const { sb } = await exigirEquipe();
  const { data, error } = await sb.from("aparelhos").select(CAMPOS).order("preco", { ascending: false });
  if (error) throw error;
  return (data as Linha[]).map(paraItem);
}

export async function buscarItem(id: string) {
  const { sb } = await exigirEquipe();
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  const { data, error } = await sb.from("aparelhos").select(CAMPOS).eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? paraItem(data as Linha) : null;
}
