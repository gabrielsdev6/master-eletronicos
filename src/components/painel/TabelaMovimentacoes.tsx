import Link from "next/link";
import { formatarPreco } from "@/lib/aparelhos";
import type { Movimentacao } from "@/lib/painel/movimentacoes";
import { NOMES_FORMA } from "@/lib/painel/tipos";

const ESTILO_TIPO: Record<Movimentacao["tipo"], { rotulo: string; classe: string }> = {
  venda: { rotulo: "Venda", classe: "bg-cobalto/10 text-cobalto" },
  entrada: { rotulo: "Entrada", classe: "bg-ok/10 text-ok" },
  ajuste: { rotulo: "Ajuste", classe: "bg-coral/15 text-coral-escuro" },
};

const formatoData = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

// Histórico de vendas, entradas e ajustes, do mais recente para o mais antigo
export function TabelaMovimentacoes({ itens, comAparelho = true }: { itens: Movimentacao[]; comAparelho?: boolean }) {
  if (itens.length === 0) {
    return <p className="p-8 text-center text-cinza">Nada registrado nesse período.</p>;
  }

  return (
    <ul className="divide-y divide-linha">
      {itens.map((m) => {
        const estilo = ESTILO_TIPO[m.tipo];
        const total = m.tipo === "venda" && m.precoUnitario !== null ? -m.quantidade * m.precoUnitario : null;
        return (
          <li key={m.id} className="grid gap-x-4 gap-y-1 px-4 py-3 sm:grid-cols-[6.5rem_1fr_auto] sm:items-center">
            <div className="flex items-center gap-2 sm:block">
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${estilo.classe}`}>
                {estilo.rotulo}
              </span>
              <time dateTime={m.criadoEm} className="text-xs text-cinza tabular-nums sm:mt-1 sm:block">
                {formatoData.format(new Date(m.criadoEm))}
              </time>
            </div>
            <div className="min-w-0">
              {comAparelho && (
                <p className="font-semibold">
                  {m.aparelhoId ? (
                    <Link href={`/painel/aparelhos/${m.aparelhoId}`} className="hover:underline">
                      {m.descricao}
                    </Link>
                  ) : (
                    m.descricao
                  )}
                </p>
              )}
              <p className="text-sm text-cinza">
                {[
                  m.formaPagamento && NOMES_FORMA[m.formaPagamento],
                  m.cliente && `cliente ${m.cliente}`,
                  m.observacao,
                  `por ${m.usuarioNome}`,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
            <div className="text-left tabular-nums sm:text-right">
              <p className="font-bold">
                {m.quantidade > 0 ? `+${m.quantidade}` : m.quantidade} un.
              </p>
              {total !== null && <p className="text-sm text-cinza">{formatarPreco(total)}</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
