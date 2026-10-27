"use client";

import { useState } from "react";
import { formatarPreco } from "@/lib/aparelhos";

type Dia = { dia: number; valor: number; unidades: number };

/**
 * Vendas por dia do mês: uma série, barras finas que crescem da base, dica ao passar o mouse
 * ou focar a barra. Os valores também estão na tabela logo abaixo (para leitor de tela e impressão).
 */
export function GraficoDiario({ dias, nomeMes }: { dias: Dia[]; nomeMes: string }) {
  const [foco, setFoco] = useState<number | null>(null);
  const maximo = Math.max(...dias.map((d) => d.valor), 1);
  // Marca da escala: o maior valor arredondado para cima
  const passo = 10 ** Math.floor(Math.log10(maximo));
  const topo = Math.ceil(maximo / passo) * passo;
  const atual = foco === null ? null : dias[foco];

  return (
    <figure>
      <div className="relative">
        <div className="flex h-48 items-end gap-[2px] border-b border-linha" role="list" aria-label={`Vendas por dia em ${nomeMes}`}>
          {dias.map((d, i) => (
            <div
              key={d.dia}
              role="listitem"
              tabIndex={0}
              aria-label={`Dia ${d.dia}: ${d.unidades} vendido${d.unidades === 1 ? "" : "s"}, ${formatarPreco(d.valor)}`}
              onMouseEnter={() => setFoco(i)}
              onMouseLeave={() => setFoco(null)}
              onFocus={() => setFoco(i)}
              onBlur={() => setFoco(null)}
              className="group flex h-full flex-1 cursor-default items-end justify-center outline-none"
            >
              <div
                className={`w-full max-w-6 rounded-t-[4px] ${
                  d.valor > 0 ? "bg-cobalto" : ""
                } ${foco === i ? "opacity-100" : foco !== null ? "opacity-50" : ""} group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-marinho`}
                style={{ height: `${(d.valor / topo) * 100}%`, minHeight: d.valor > 0 ? 3 : 0 }}
              />
            </div>
          ))}
        </div>
        <span className="pointer-events-none absolute left-0 top-0 -translate-y-1/2 bg-papel pr-1 text-xs text-cinza tabular-nums">
          {formatarPreco(topo)}
        </span>
        <div className="pointer-events-none absolute inset-x-0 top-0 border-t border-dashed border-linha" aria-hidden />

        {atual && (
          <div
            className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-marinho px-3 py-2 text-xs text-white shadow-lg"
            style={{ left: `${((foco! + 0.5) / dias.length) * 100}%` }}
            aria-hidden
          >
            <p className="font-semibold">Dia {atual.dia}</p>
            <p className="tabular-nums">
              {atual.unidades} vendido{atual.unidades === 1 ? "" : "s"}, {formatarPreco(atual.valor)}
            </p>
          </div>
        )}
      </div>
      <div className="mt-1 flex justify-between text-xs text-cinza tabular-nums" aria-hidden>
        <span>1</span>
        <span>{Math.ceil(dias.length / 2)}</span>
        <span>{dias.length}</span>
      </div>
      <figcaption className="sr-only">Vendas por dia em {nomeMes}</figcaption>
    </figure>
  );
}
