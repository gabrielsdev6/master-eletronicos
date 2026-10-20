"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { formatarPreco, type Aparelho } from "@/lib/aparelhos";
import { Celular } from "./Celular";

// Quanto cada celular se desloca com o mouse: o do meio está mais "perto"
const PROFUNDIDADE = [14, 24, 14];

export function VitrineHero({ vitrine }: { vitrine: Aparelho[] }) {
  const area = useRef<HTMLDivElement>(null);
  const camadas = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const secao = area.current?.closest("section");
    const mouseFino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!secao || !mouseFino || reduzir) return;
    // Fundo de bolinhas: camada mais distante, anda pouco e no sentido do mouse
    const bolinhas = secao.querySelector<HTMLElement>(".bolinhas");

    function mover(e: PointerEvent) {
      const caixa = secao!.getBoundingClientRect();
      const x = (e.clientX - caixa.left) / caixa.width - 0.5;
      const y = (e.clientY - caixa.top) / caixa.height - 0.5;
      camadas.current.forEach((el, i) => {
        if (!el) return;
        const d = PROFUNDIDADE[i] ?? 14;
        // Transform direto no elemento, sem variável CSS herdada
        el.style.transform = `translate3d(${(-x * d).toFixed(1)}px, ${(-y * d * 0.6).toFixed(1)}px, 0)`;
      });
      if (bolinhas) {
        bolinhas.style.transform = `translate3d(${(x * 10).toFixed(1)}px, ${(y * 8).toFixed(1)}px, 0)`;
      }
    }
    function voltar() {
      camadas.current.forEach((el) => el && (el.style.transform = ""));
      if (bolinhas) bolinhas.style.transform = "";
    }

    secao.addEventListener("pointermove", mover);
    secao.addEventListener("pointerleave", voltar);
    return () => {
      secao.removeEventListener("pointermove", mover);
      secao.removeEventListener("pointerleave", voltar);
    };
  }, []);

  return (
    <div
      ref={area}
      className="relative -mt-4 flex h-60 items-end justify-center gap-[4%] sm:h-[26rem] md:mt-0 md:h-[34rem]"
    >
      {vitrine.map((a, i) => (
        <div
          key={a.id}
          className={`entrada-celular relative ${i === 1 ? "z-10 w-[33%] -mb-[6%]" : "w-[27%] -mb-[14%]"}`}
          style={{ "--giro": `${(i - 1) * 6}deg` } as React.CSSProperties}
        >
          <div
            ref={(el) => {
              camadas.current[i] = el;
            }}
            className="paralaxe relative"
          >
            <Celular modelo={a.modelo} corHex={a.corHex} className="w-full" />
            {i === 1 && (
              <Link
                href={`/iphones/${a.id}`}
                className="etiqueta-pendurada absolute -left-[62%] top-[30%] drop-shadow-[0_10px_14px_rgb(0_0_0/0.18)]"
              >
                <span className="etiqueta clara flex-col !items-start !gap-0">
                  <span className="text-xs font-semibold">{a.modelo}</span>
                  <span className="letreiro text-2xl sm:text-3xl">{formatarPreco(a.preco)}</span>
                </span>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
