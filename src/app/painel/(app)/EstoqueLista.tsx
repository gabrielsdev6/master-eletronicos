"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatarArmazenamento, formatarPreco } from "@/lib/aparelhos";
import type { ItemEstoque } from "@/lib/painel/tipos";
import { Celular } from "@/components/Celular";
import { campo, cartao } from "@/components/painel/estilos";
import { DialogoMovimento, type TipoMovimento } from "./DialogoMovimento";

type Aba = "venda" | "esgotados" | "arquivados";

export function EstoqueLista({ itens }: { itens: ItemEstoque[] }) {
  const [aba, setAba] = useState<Aba>("venda");
  const [busca, setBusca] = useState("");
  const [movimento, setMovimento] = useState<{ item: ItemEstoque; tipo: TipoMovimento } | null>(null);
  const [aviso, setAviso] = useState("");

  const contagem = {
    venda: itens.filter((i) => i.ativo && i.quantidade > 0).length,
    esgotados: itens.filter((i) => i.ativo && i.quantidade === 0).length,
    arquivados: itens.filter((i) => !i.ativo).length,
  };

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return itens
      .filter((i) =>
        aba === "venda" ? i.ativo && i.quantidade > 0 : aba === "esgotados" ? i.ativo && i.quantidade === 0 : !i.ativo,
      )
      .filter((i) => !termo || `${i.modelo} ${i.cor} ${i.armazenamento} ${i.estado}`.toLowerCase().includes(termo));
  }, [itens, aba, busca]);

  const abas: { valor: Aba; rotulo: string }[] = [
    { valor: "venda", rotulo: "À venda" },
    { valor: "esgotados", rotulo: "Esgotados" },
    { valor: "arquivados", rotulo: "Arquivados" },
  ];

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Filtrar estoque" className="flex gap-1 rounded-full bg-papel p-1 ring-1 ring-linha">
          {abas.map((a) => (
            <button
              key={a.valor}
              type="button"
              role="tab"
              aria-selected={aba === a.valor}
              onClick={() => setAba(a.valor)}
              className="pressiona rounded-full px-3.5 py-1.5 text-sm font-semibold text-cinza aria-selected:bg-cobalto aria-selected:text-white"
            >
              {a.rotulo} <span className="tabular-nums opacity-70">{contagem[a.valor]}</span>
            </button>
          ))}
        </div>
        <label className="w-full sm:w-72">
          <span className="sr-only">Buscar aparelho</span>
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por modelo, cor ou memória"
            className={campo}
          />
        </label>
      </div>

      {aviso && (
        <p key={aviso} role="status" className="aparece mt-4 rounded-lg bg-ok/10 px-4 py-3 text-sm font-medium text-ok">
          {aviso}
        </p>
      )}

      <ul className={`${cartao} mt-4 divide-y divide-linha overflow-hidden`}>
        {visiveis.map((i) => (
          <li
            key={i.id}
            className="grid grid-cols-[3.5rem_1fr] items-center gap-x-4 gap-y-3 p-4 md:grid-cols-[3.5rem_1fr_auto_auto]"
          >
            <div className="flex size-14 items-center justify-center overflow-hidden rounded-xl bg-gelo">
              {i.capa ? (
                // eslint-disable-next-line @next/next/no-img-element -- miniatura do storage
                <img src={i.capa} alt="" className="h-full w-full object-contain p-1" />
              ) : (
                <Celular modelo={i.modelo} corHex={i.corHex} className="w-5" />
              )}
            </div>

            <div className="min-w-0">
              <Link href={`/painel/aparelhos/${i.id}`} className="font-bold hover:underline">
                {i.modelo} {formatarArmazenamento(i.armazenamento)}
              </Link>
              <p className="text-sm text-cinza">
                {i.cor}, {i.estado}
                {i.bateria ? `, bateria ${i.bateria}%` : ""}
                {i.destaque ? ", em destaque" : ""}
              </p>
            </div>

            <div className="col-span-2 flex items-center gap-5 md:col-span-1">
              <div>
                <p className="text-xs text-cinza">Preço</p>
                <p className="font-semibold tabular-nums">{formatarPreco(i.preco)}</p>
              </div>
              <div>
                <p className="text-xs text-cinza">Em estoque</p>
                <p className={`letreiro text-xl tabular-nums ${i.quantidade === 0 ? "text-alerta" : ""}`}>
                  {i.quantidade}
                </p>
              </div>
            </div>

            <div className="col-span-2 flex flex-wrap gap-2 md:col-span-1 md:justify-end">
              {i.ativo && (
                <>
                  <button
                    type="button"
                    disabled={i.quantidade === 0}
                    onClick={() => setMovimento({ item: i, tipo: "venda" })}
                    className="pressiona rounded-full bg-cobalto px-4 py-2 text-sm font-semibold text-white hover:bg-cobalto-escuro disabled:opacity-40"
                  >
                    Vender
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovimento({ item: i, tipo: "entrada" })}
                    className="pressiona rounded-full bg-papel px-4 py-2 text-sm font-semibold ring-1 ring-linha hover:ring-marinho"
                  >
                    Entrada
                  </button>
                </>
              )}
              <Link
                href={`/painel/aparelhos/${i.id}`}
                className="pressiona rounded-full px-4 py-2 text-sm font-semibold text-cobalto hover:bg-gelo"
              >
                Editar
              </Link>
            </div>
          </li>
        ))}
        {visiveis.length === 0 && (
          <li className="p-10 text-center text-cinza">
            {busca
              ? `Nenhum aparelho encontrado com "${busca}".`
              : aba === "arquivados"
                ? "Nenhum aparelho arquivado."
                : aba === "esgotados"
                  ? "Nada esgotado. Bom sinal."
                  : "Nenhum aparelho à venda. Cadastre um ou registre uma entrada nos esgotados."}
          </li>
        )}
      </ul>

      {movimento && (
        <DialogoMovimento
          item={movimento.item}
          tipoInicial={movimento.tipo}
          aoFechar={() => setMovimento(null)}
          aoConcluir={(mensagem) => {
            setMovimento(null);
            setAviso(mensagem);
          }}
        />
      )}
    </section>
  );
}
