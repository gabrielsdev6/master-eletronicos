"use client";

import { useState } from "react";
import {
  formatarArmazenamento,
  formatarPreco,
  nomeCompleto,
  type Aparelho,
} from "@/lib/aparelhos";
import {
  ARMAZENAMENTOS_TROCA,
  MODELOS_TROCA,
  PERGUNTAS,
  estimarTroca,
  rotuloDe,
  type Respostas,
} from "@/lib/troca";
import { linkWhatsApp } from "@/lib/loja";
import { Escolha } from "@/components/Escolha";
import { IconeConversa } from "@/components/Icones";

type Chave = keyof typeof PERGUNTAS;

const TITULOS: Record<Chave, string> = {
  tela: "Como está a tela?",
  traseira: "E a traseira?",
  bateria: "Saúde da bateria",
  faceId: "Face ID ou Touch ID",
  reparo: "Já foi aberto ou consertado?",
};

// Como cada resposta aparece na mensagem do WhatsApp
const NA_MENSAGEM: Record<Chave, string> = {
  tela: "Tela",
  traseira: "Traseira",
  bateria: "Bateria",
  faceId: "Face ID / Touch ID",
  reparo: "Reparo",
};

const ORDEM: Chave[] = ["tela", "traseira", "bateria", "faceId", "reparo"];

export function AvaliacaoTroca({
  disponiveis,
  porInicial,
}: {
  disponiveis: Aparelho[];
  porInicial: string;
}) {
  const [modelo, setModelo] = useState("");
  const [gb, setGb] = useState("128");
  const [respostas, setRespostas] = useState<Record<Chave, string>>({
    tela: "",
    traseira: "",
    bateria: "",
    faceId: "",
    reparo: "",
  });
  const [por, setPor] = useState(disponiveis.some((a) => a.id === porInicial) ? porInicial : "");

  const faltam = (modelo ? 0 : 1) + ORDEM.filter((c) => !respostas[c]).length;
  const completo = faltam === 0;
  const estimativa = completo
    ? estimarTroca({ modelo, gb: Number(gb), ...respostas } as Respostas)
    : null;
  const desejado = disponiveis.find((a) => a.id === por);

  const diferenca =
    estimativa && desejado
      ? {
          minima: Math.max(0, desejado.preco - estimativa.maximo),
          maxima: Math.max(0, desejado.preco - estimativa.minimo),
        }
      : null;

  const mensagem = estimativa
    ? [
        "Olá! Quero avaliar meu iPhone na troca.",
        `Meu aparelho: ${modelo} ${formatarArmazenamento(Number(gb))}`,
        ...ORDEM.map((c) => `${NA_MENSAGEM[c]}: ${rotuloDe(c, respostas[c])}`),
        `Estimativa do site: ${formatarPreco(estimativa.minimo)} a ${formatarPreco(estimativa.maximo)}`,
        desejado ? `Quero trocar por: ${nomeCompleto(desejado)} (${formatarPreco(desejado.preco)})` : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return (
    <div className="mt-10 grid gap-8 md:grid-cols-[1fr_17rem] md:items-start">
      <div className="space-y-7">
        <label className="block">
          <span className="mb-2 block font-semibold">Qual é o seu iPhone?</span>
          <select
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            className="w-full rounded-lg border border-linha bg-papel px-3 py-3 focus:border-preto focus:outline-none"
          >
            <option value="">Escolha o modelo</option>
            {MODELOS_TROCA.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <Escolha
          nome="gb"
          legenda="Armazenamento"
          opcoes={ARMAZENAMENTOS_TROCA.map((a) => ({
            valor: String(a.gb),
            rotulo: formatarArmazenamento(a.gb),
          }))}
          valor={gb}
          onChange={setGb}
        />

        {ORDEM.map((chave) => (
          <Escolha
            key={chave}
            nome={chave}
            legenda={TITULOS[chave]}
            opcoes={PERGUNTAS[chave]}
            valor={respostas[chave]}
            onChange={(v) => setRespostas((r) => ({ ...r, [chave]: v }))}
          />
        ))}

        <label className="block">
          <span className="mb-2 block font-semibold">Quer trocar por qual? (opcional)</span>
          <select
            value={por}
            onChange={(e) => setPor(e.target.value)}
            className="w-full rounded-lg border border-linha bg-papel px-3 py-3 focus:border-preto focus:outline-none"
          >
            <option value="">Ainda não sei</option>
            {disponiveis.map((a) => (
              <option key={a.id} value={a.id}>
                {nomeCompleto(a)}, {a.estado}, {formatarPreco(a.preco)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <aside className="md:sticky md:top-6" aria-live="polite">
        {estimativa ? (
          <div key="pronto" className="aparece rounded-2xl bg-amarelo p-5">
            <p className="text-sm font-semibold">Seu {modelo} vale em torno de</p>
            <p className="letreiro mt-2 text-3xl leading-tight">
              {formatarPreco(estimativa.minimo)}
              <span className="block text-lg">a {formatarPreco(estimativa.maximo)}</span>
            </p>

            {diferenca && desejado && (
              <div className="mt-4 border-t border-preto/20 pt-4">
                <p className="text-sm">Pelo {desejado.modelo}, você paga a diferença de</p>
                <p className="mt-1 text-xl font-bold">
                  {formatarPreco(diferenca.minima)} a {formatarPreco(diferenca.maxima)}
                </p>
              </div>
            )}

            <a
              href={linkWhatsApp(mensagem)}
              target="_blank"
              rel="noopener noreferrer"
              className="pressiona mt-5 flex items-center justify-center gap-2 rounded-full bg-preto px-5 py-3.5 font-semibold text-amarelo hover:bg-preto/85"
            >
              <IconeConversa />
              Enviar avaliação
            </a>
            <p className="mt-3 text-xs">
              É uma estimativa. O valor final sai depois que a loja olhar o aparelho.
            </p>
          </div>
        ) : (
          <div key="faltando" className="rounded-2xl border-2 border-dashed border-linha p-5">
            <p className="font-semibold">
              {faltam === 1 ? "Falta 1 resposta" : `Faltam ${faltam} respostas`}
            </p>
            <p className="mt-1 text-sm text-cinza">Quando terminar, a estimativa aparece aqui.</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-nevoa">
              <div
                className="barra-progresso h-full rounded-full bg-preto"
                style={{ transform: `scaleX(${(6 - faltam) / 6})` }}
              />
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
