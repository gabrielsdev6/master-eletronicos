import "server-only";
import { exigirEquipe } from "./sessao";

export type Movimentacao = {
  id: string;
  aparelhoId: string | null;
  descricao: string;
  tipo: "entrada" | "venda" | "ajuste";
  quantidade: number;
  precoUnitario: number | null;
  formaPagamento: string | null;
  cliente: string | null;
  observacao: string | null;
  usuarioNome: string;
  criadoEm: string;
};

export async function listarMovimentacoes(filtro: {
  aparelhoId?: string;
  tipo?: Movimentacao["tipo"];
  desde?: Date;
  ate?: Date;
  limite?: number;
}): Promise<Movimentacao[]> {
  const { sb } = await exigirEquipe();
  let consulta = sb
    .from("movimentacoes")
    .select(
      "id, aparelho_id, descricao, tipo, quantidade, preco_unitario, forma_pagamento, cliente, observacao, usuario_nome, criado_em",
    )
    .order("criado_em", { ascending: false });
  if (filtro.aparelhoId) consulta = consulta.eq("aparelho_id", filtro.aparelhoId);
  if (filtro.tipo) consulta = consulta.eq("tipo", filtro.tipo);
  if (filtro.desde) consulta = consulta.gte("criado_em", filtro.desde.toISOString());
  if (filtro.ate) consulta = consulta.lt("criado_em", filtro.ate.toISOString());
  if (filtro.limite) consulta = consulta.limit(filtro.limite);

  const { data, error } = await consulta;
  if (error) throw error;
  return data.map((m) => ({
    id: m.id,
    aparelhoId: m.aparelho_id,
    descricao: m.descricao,
    tipo: m.tipo,
    quantidade: m.quantidade,
    precoUnitario: m.preco_unitario === null ? null : Number(m.preco_unitario),
    formaPagamento: m.forma_pagamento,
    cliente: m.cliente,
    observacao: m.observacao,
    usuarioNome: m.usuario_nome,
    criadoEm: m.criado_em,
  }));
}
