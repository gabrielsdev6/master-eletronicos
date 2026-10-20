import Link from "next/link";
import { aparelhos } from "@/lib/aparelhos";
import { enderecoCompleto, linkWhatsApp, loja, mapaEmbed, mapaLink } from "@/lib/loja";
import { CartaoAparelho } from "@/components/CartaoAparelho";
import { Celular } from "@/components/Celular";
import { Letreiro } from "@/components/Letreiro";
import { TituloDigitado } from "@/components/TituloDigitado";
import { VitrineHero } from "@/components/VitrineHero";
import { IconeConversa, IconeLocal } from "@/components/Icones";

const passos = [
  {
    titulo: "Escolha o iPhone",
    texto: "Veja os modelos, cores e preços aqui no site. O que aparece é o que tem na loja.",
  },
  {
    titulo: "Chame no WhatsApp",
    texto: "Cada aparelho tem um botão que já manda pra gente qual modelo você quer.",
  },
  {
    titulo: "Retire na loja",
    texto: "Separamos o aparelho pra você ver de perto, testar e levar.",
  },
];

export default function Inicio() {
  const destaques = aparelhos.filter((a) => a.destaque && a.quantidade > 0);
  const vitrine = destaques.slice(0, 3);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-amarelo">
        <div className="bolinhas" aria-hidden />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-12 md:grid-cols-[1.05fr_1fr] md:pt-16">
          <div className="self-center md:pb-16">
            <TituloDigitado
              texto="iPhone novo e seminovo, aqui em Pimenta."
              className="letreiro text-5xl sm:text-6xl lg:text-7xl"
            />
            <p className="mt-6 max-w-md text-lg">
              Veja o que tem na loja, com preço e cor, e fale com a gente no WhatsApp pra separar o
              seu.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/iphones"
                className="pressiona rounded-full bg-preto px-6 py-3.5 font-semibold text-amarelo hover:bg-preto/85"
              >
                Ver iPhones
              </Link>
              <a
                href={linkWhatsApp("Olá! Vim pelo site e queria saber dos iPhones.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 pressiona rounded-full border-2 border-preto px-6 py-3 font-semibold hover:bg-preto hover:text-amarelo"
              >
                <IconeConversa />
                Chamar no WhatsApp
              </a>
            </div>
          </div>

          {/* Vitrine: os aparelhos saem pela base da faixa amarela, como numa prateleira */}
          <VitrineHero vitrine={vitrine} />
        </div>
      </section>

      <Letreiro />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="letreiro text-3xl sm:text-4xl">Em destaque</h2>
          <Link href="/iphones" className="font-semibold underline underline-offset-4 hover:no-underline">
            Ver todos os {aparelhos.length} aparelhos
          </Link>
        </div>
        <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {destaques.map((a) => (
            <CartaoAparelho key={a.id} aparelho={a} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-preto px-6 py-10 text-white sm:px-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="letreiro text-3xl text-amarelo sm:text-4xl">Seu iPhone usado vale desconto</h2>
            <p className="mt-4 max-w-md text-white/80">
              Responda umas perguntas sobre o seu aparelho e veja na hora quanto ele vale na troca por
              um iPhone da loja.
            </p>
            <Link
              href="/troca"
              className="pressiona mt-6 inline-flex rounded-full bg-amarelo px-6 py-3.5 font-semibold text-preto hover:bg-amarelo-escuro"
            >
              Avaliar meu iPhone
            </Link>
          </div>
          <div className="flex items-end justify-center gap-6" aria-hidden>
            <Celular modelo="iPhone 12" corHex="#3a3d44" className="w-[22%] opacity-70 -rotate-6" />
            <Celular modelo="iPhone 17 Pro" corHex="#e46a2a" className="w-[30%] rotate-3" />
          </div>
        </div>
      </section>

      <section className="border-y border-linha bg-nevoa">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="letreiro mb-10 text-3xl sm:text-4xl">Como comprar</h2>
          <ol className="grid gap-8 sm:grid-cols-3">
            {passos.map((p, i) => (
              <li key={p.titulo} className="flex gap-4">
                <span className="letreiro flex size-12 shrink-0 items-center justify-center rounded-full bg-amarelo text-2xl">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold">{p.titulo}</h3>
                  <p className="mt-1 text-cinza">{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="endereco" className="mx-auto grid max-w-6xl scroll-mt-4 gap-8 px-4 py-16 md:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="letreiro text-3xl sm:text-4xl">Venha na loja</h2>
          <p className="mt-6 flex gap-2 text-lg">
            <IconeLocal className="mt-1 size-5 shrink-0" />
            <span>
              {loja.endereco}
              <br />
              {loja.cidade}, {loja.cep}
            </span>
          </p>
          <dl className="mt-6 space-y-1">
            {loja.horario.map((h) => (
              <div key={h.dias} className="flex justify-between gap-4 border-b border-linha py-2">
                <dt className="text-cinza">{h.dias}</dt>
                <dd className="font-semibold">{h.horas}</dd>
              </div>
            ))}
          </dl>
          <a
            href={mapaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex pressiona rounded-full bg-preto px-6 py-3.5 font-semibold text-amarelo hover:bg-preto/85"
          >
            Abrir no Google Maps
          </a>
        </div>
        <iframe
          title={`Mapa: ${enderecoCompleto}`}
          src={mapaEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-80 w-full rounded-xl border border-linha md:h-full md:min-h-96"
        />
      </section>
    </>
  );
}
