"use client";

import { useState } from "react";
import Link from "next/link";
import { nomeCompleto, formatarPreco, type Aparelho } from "@/lib/aparelhos";
import { MAX_PARCELAS, formatarCentavos, simularCartao } from "@/lib/pagamento";
import { linkWhatsApp } from "@/lib/loja";
import { Escolha } from "./Escolha";
import { IconeConversa } from "./Icones";

type Forma = "pix" | "cartao";

// Simulador de parcelas + botão de interesse que já leva a forma de pagamento
export function Compra({ aparelho }: { aparelho: Aparelho }) {
  const [forma, setForma] = useState<Forma>("pix");
  const [parcelas, setParcelas] = useState(10);
  const nome = nomeCompleto(aparelho);

  if (aparelho.quantidade === 0) {
    return (
      <BotaoWhatsApp
        texto="Perguntar quando chega"
        mensagem={`Olá! Vi no site que o ${nome} está esgotado. Vai chegar de novo?`}
      />
    );
  }

  const cartao = simularCartao(aparelho.preco, parcelas);
  const pagamento =
    forma === "pix"
      ? `no Pix (${formatarPreco(aparelho.preco)})`
      : `no cartão em ${parcelas}x de ${formatarCentavos(cartao.parcela)}`;

  return (
    <div className="mt-8">
      <div className="rounded-2xl bg-nevoa p-5">
        <Escolha<Forma>
          nome="forma"
          legenda="Como você quer pagar?"
          opcoes={[
            { valor: "pix", rotulo: "Pix" },
            { valor: "cartao", rotulo: "Cartão de crédito" },
          ]}
          valor={forma}
          onChange={setForma}
        />

        {forma === "pix" ? (
          <p className="mt-5" aria-live="polite">
            <span className="letreiro block text-3xl">{formatarPreco(aparelho.preco)}</span>
            <span className="text-sm text-cinza">à vista no Pix, o menor preço</span>
          </p>
        ) : (
          <div className="mt-5">
            <label htmlFor="parcelas" className="flex items-baseline justify-between gap-4">
              <span className="text-sm font-semibold">Parcelas</span>
              <span className="text-sm text-cinza">
                Total {formatarCentavos(cartao.total)}
              </span>
            </label>
            <p className="mt-1 tabular-nums" aria-live="polite">
              <span className="letreiro text-3xl">{parcelas}x</span>{" "}
              <span className="text-xl font-bold">de {formatarCentavos(cartao.parcela)}</span>
            </p>
            <input
              id="parcelas"
              type="range"
              min={1}
              max={MAX_PARCELAS}
              value={parcelas}
              onChange={(e) => setParcelas(Number(e.target.value))}
              aria-valuetext={`${parcelas} vezes de ${formatarCentavos(cartao.parcela)}`}
              className="regua mt-3 w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-cinza" aria-hidden>
              <span>1x</span>
              <span>{MAX_PARCELAS}x</span>
            </div>
          </div>
        )}
      </div>

      <BotaoWhatsApp
        texto="Tenho interesse"
        mensagem={`Olá! Tenho interesse no ${nome} (${aparelho.estado}) que vi no site, pagando ${pagamento}.`}
      />
      <p className="mt-3 text-sm text-cinza">
        Abre o WhatsApp da loja com o aparelho e a forma de pagamento já escritos.
      </p>

      <Link
        href={`/troca?por=${aparelho.id}`}
        className="pressiona mt-6 flex items-center justify-between gap-4 rounded-2xl border-2 border-preto px-5 py-4 hover:bg-amarelo"
      >
        <span>
          <span className="block font-bold">Tem um iPhone pra dar na troca?</span>
          <span className="text-sm">Veja quanto ele vale e quanto fica a diferença.</span>
        </span>
        <span className="shrink-0 font-semibold underline underline-offset-4">Avaliar</span>
      </Link>
    </div>
  );
}

function BotaoWhatsApp({ texto, mensagem }: { texto: string; mensagem: string }) {
  return (
    <a
      href={linkWhatsApp(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      className="pressiona mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-preto px-6 py-4 text-lg font-semibold text-amarelo hover:bg-preto/85"
    >
      <IconeConversa />
      {texto}
    </a>
  );
}
