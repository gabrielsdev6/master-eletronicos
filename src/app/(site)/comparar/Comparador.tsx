"use client";

import { useState } from "react";
import Link from "next/link";
import {
  formatarArmazenamento,
  formatarPreco,
  nomeCompleto,
  type Aparelho,
} from "@/lib/aparelhos";
import { ESPECIFICACOES } from "@/lib/especificacoes";
import { resumoComparacao } from "@/lib/comparar";
import { Celular } from "@/components/Celular";
import { Etiqueta } from "@/components/CartaoAparelho";

type Linha = {
  rotulo: string;
  mostrar: (a: Aparelho) => string;
  // Número usado para saber quem leva vantagem nessa linha
  medir?: (a: Aparelho) => number | undefined;
  melhor?: "maior" | "menor";
};

const saudeBateria = (a: Aparelho) => (a.estado === "novo" ? 100 : a.bateria);
const esp = (a: Aparelho) => ESPECIFICACOES[a.modelo];

const LINHAS: Linha[] = [
  { rotulo: "Preço no Pix", mostrar: (a) => formatarPreco(a.preco), medir: (a) => a.preco, melhor: "menor" },
  { rotulo: "Estado", mostrar: (a) => (a.estado === "novo" ? "Novo, lacrado" : "Seminovo") },
  {
    rotulo: "Saúde da bateria",
    mostrar: (a) => (a.estado === "novo" ? "100%, nova" : a.bateria ? `${a.bateria}%` : "Consultar"),
    medir: saudeBateria,
    melhor: "maior",
  },
  { rotulo: "Armazenamento", mostrar: (a) => formatarArmazenamento(a.armazenamento), medir: (a) => a.armazenamento, melhor: "maior" },
  { rotulo: "Cor", mostrar: (a) => a.cor },
  { rotulo: "Lançamento", mostrar: (a) => String(esp(a)?.ano ?? "-"), medir: (a) => esp(a)?.ano, melhor: "maior" },
  {
    rotulo: "Tela",
    mostrar: (a) => (esp(a) ? `${esp(a).tela.toLocaleString("pt-BR")}" ${esp(a).telaTipo}` : "-"),
    medir: (a) => esp(a)?.tela,
    melhor: "maior",
  },
  {
    rotulo: "Tela fluida (120 Hz)",
    mostrar: (a) => (esp(a) ? (esp(a).hz120 ? "Sim" : "Não") : "-"),
    medir: (a) => (esp(a) ? Number(esp(a).hz120) : undefined),
    melhor: "maior",
  },
  { rotulo: "Chip", mostrar: (a) => esp(a)?.chip ?? "-" },
  { rotulo: "Câmeras traseiras", mostrar: (a) => esp(a)?.cameras ?? "-" },
  { rotulo: "Zoom óptico", mostrar: (a) => esp(a)?.zoomOptico ?? "-" },
  {
    rotulo: "Bateria (vídeo)",
    mostrar: (a) => (esp(a) ? `Até ${esp(a).videoHoras}h` : "-"),
    medir: (a) => esp(a)?.videoHoras,
    melhor: "maior",
  },
  { rotulo: "Conector", mostrar: (a) => esp(a)?.conector ?? "-" },
  { rotulo: "Peso", mostrar: (a) => (esp(a) ? `${esp(a).peso} g` : "-"), medir: (a) => esp(a)?.peso, melhor: "menor" },
];

// Qual lado leva vantagem na linha: 0, 1 ou nenhum
function vencedor(linha: Linha, a: Aparelho, b: Aparelho) {
  if (!linha.medir || !linha.melhor) return null;
  const va = linha.medir(a);
  const vb = linha.medir(b);
  if (va === undefined || vb === undefined || va === vb) return null;
  const aGanha = linha.melhor === "maior" ? va > vb : va < vb;
  return aGanha ? 0 : 1;
}

export function Comparador({ opcoes, inicial }: { opcoes: Aparelho[]; inicial: [string, string] }) {
  const [ids, setIds] = useState(inicial);
  const escolhidos = ids.map((id) => opcoes.find((o) => o.id === id)!) as [Aparelho, Aparelho];

  function trocar(lado: 0 | 1, id: string) {
    const novos: [string, string] = lado === 0 ? [id, ids[1]] : [ids[0], id];
    setIds(novos);
    history.replaceState(null, "", `/comparar?a=${novos[0]}&b=${novos[1]}`);
  }

  return (
    <>
      <p className="mt-4 max-w-xl text-lg" aria-live="polite">
        {resumoComparacao(escolhidos[0], escolhidos[1])}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6">
        {escolhidos.map((a, lado) => (
          <div key={lado}>
            <label className="block">
              <span className="sr-only">Aparelho {lado + 1}</span>
              <select
                value={a.id}
                onChange={(e) => trocar(lado as 0 | 1, e.target.value)}
                className="w-full truncate rounded-lg border border-linha bg-papel px-2 py-3 text-sm font-semibold focus:border-preto focus:outline-none sm:px-3 sm:text-base"
              >
                {opcoes
                  .filter((o) => o.id === a.id || o.id !== ids[lado === 0 ? 1 : 0])
                  .map((o) => (
                    <option key={o.id} value={o.id}>
                      {nomeCompleto(o)}
                    </option>
                  ))}
              </select>
            </label>
            <div className="relative mt-3 flex h-56 items-center justify-center rounded-2xl bg-nevoa sm:h-72">
              <Celular key={a.id} modelo={a.modelo} corHex={a.corHex} className="aparece w-[34%] sm:w-[26%]" />
              <div className="absolute -bottom-4 left-3 hidden sm:block">
                <Etiqueta aparelho={a} />
              </div>
            </div>
            <Link
              href={`/iphones/${a.id}`}
              className="mt-3 inline-block text-sm font-semibold sm:mt-7 underline underline-offset-4 hover:no-underline"
            >
              Ver este aparelho
            </Link>
          </div>
        ))}
      </div>

      <dl className="mt-10 border-t border-linha">
        {LINHAS.map((linha) => {
          const ganha = vencedor(linha, escolhidos[0], escolhidos[1]);
          return (
            <div key={linha.rotulo} className="border-b border-linha py-3">
              <dt className="mb-1.5 text-sm text-cinza">{linha.rotulo}</dt>
              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                {escolhidos.map((a, lado) => (
                  <dd key={lado} className="font-semibold">
                    <span className={ganha === lado ? "vantagem" : undefined}>{linha.mostrar(a)}</span>
                    {ganha === lado && <span className="sr-only"> (vantagem)</span>}
                  </dd>
                ))}
              </div>
            </div>
          );
        })}
      </dl>
      <p className="mt-4 text-sm text-cinza">
        Em amarelo, quem leva vantagem em cada item. Ficha técnica de referência da Apple.
      </p>
    </>
  );
}
