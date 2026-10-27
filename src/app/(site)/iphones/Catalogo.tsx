"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { formatarArmazenamento, type Aparelho } from "@/lib/aparelhos";
import { CartaoAparelho } from "@/components/CartaoAparelho";

export type Filtros = { modelo?: string; gb?: string; estado?: string };

function urlDe(f: Filtros) {
  const params = new URLSearchParams();
  for (const [chave, valor] of Object.entries(f)) {
    if (valor) params.set(chave, valor);
  }
  const qs = params.toString();
  return qs ? `/iphones?${qs}` : "/iphones";
}

function Opcao({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`pressiona shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold ${
        ativo ? "border-cobalto bg-cobalto text-white" : "border-linha bg-papel hover:border-marinho"
      }`}
    >
      {children}
    </button>
  );
}

export function Catalogo({
  aparelhos,
  modelos,
  armazenamentos,
  inicial,
}: {
  aparelhos: Aparelho[];
  modelos: string[];
  armazenamentos: number[];
  inicial: Filtros;
}) {
  const [filtros, setFiltros] = useState(inicial);

  function mudar(mudanca: Filtros) {
    const proximo = { ...filtros, ...mudanca };
    history.replaceState(null, "", urlDe(proximo));
    const aplicar = () => flushSync(() => setFiltros(proximo));
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Os cartões deslizam para o novo lugar em vez de pular
    if (document.startViewTransition && !reduzir) {
      document.startViewTransition(aplicar);
    } else {
      aplicar();
    }
  }

  const lista = aparelhos
    .filter((a) => !filtros.modelo || a.modelo === filtros.modelo)
    .filter((a) => !filtros.gb || String(a.armazenamento) === filtros.gb)
    .filter((a) => !filtros.estado || a.estado === filtros.estado)
    // Esgotados vão para o fim da lista
    .sort((a, b) => Number(a.quantidade === 0) - Number(b.quantidade === 0));

  const temFiltro = Boolean(filtros.modelo || filtros.gb || filtros.estado);

  return (
    <>
      <div className="mt-8 space-y-3">
        <div className="rolagem-x -mx-4 flex gap-2 overflow-x-auto px-4" role="group" aria-label="Modelo">
          <Opcao ativo={!filtros.modelo} onClick={() => mudar({ modelo: undefined })}>
            Todos os modelos
          </Opcao>
          {modelos.map((m) => (
            <Opcao key={m} ativo={filtros.modelo === m} onClick={() => mudar({ modelo: m })}>
              {m}
            </Opcao>
          ))}
        </div>

        <div className="rolagem-x -mx-4 flex gap-2 overflow-x-auto px-4">
          <div className="flex gap-2" role="group" aria-label="Estado">
            <Opcao ativo={!filtros.estado} onClick={() => mudar({ estado: undefined })}>
              Novo e seminovo
            </Opcao>
            <Opcao ativo={filtros.estado === "novo"} onClick={() => mudar({ estado: "novo" })}>
              Só novo
            </Opcao>
            <Opcao ativo={filtros.estado === "seminovo"} onClick={() => mudar({ estado: "seminovo" })}>
              Só seminovo
            </Opcao>
          </div>
          <span className="mx-1 w-px shrink-0 bg-linha" aria-hidden />
          <div className="flex gap-2" role="group" aria-label="Armazenamento">
            <Opcao ativo={!filtros.gb} onClick={() => mudar({ gb: undefined })}>
              Qualquer memória
            </Opcao>
            {armazenamentos.map((gb) => (
              <Opcao key={gb} ativo={filtros.gb === String(gb)} onClick={() => mudar({ gb: String(gb) })}>
                {formatarArmazenamento(gb)}
              </Opcao>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-cinza" aria-live="polite">
        {lista.length === 1 ? "1 aparelho" : `${lista.length} aparelhos`}
        {temFiltro && (
          <>
            {" "}
            <button
              type="button"
              onClick={() => mudar({ modelo: undefined, gb: undefined, estado: undefined })}
              className="font-semibold text-marinho underline underline-offset-4"
            >
              Limpar filtros
            </button>
          </>
        )}
      </p>

      {lista.length > 0 ? (
        <div className="mt-4 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {lista.map((a) => (
            <div key={a.id} style={{ viewTransitionName: `aparelho-${a.id}` }}>
              <CartaoAparelho aparelho={a} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-linha p-10 text-center">
          <p className="font-semibold">Nenhum aparelho com essa combinação agora.</p>
          <p className="mt-1 text-cinza">Tire um dos filtros ou pergunte no WhatsApp se vai chegar.</p>
        </div>
      )}
    </>
  );
}
