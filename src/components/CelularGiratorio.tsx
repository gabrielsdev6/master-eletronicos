"use client";

import { useEffect, useRef, useState } from "react";
import { Celular } from "./Celular";

// Celular em 3D: inclina seguindo o mouse e vira para mostrar a frente
export function CelularGiratorio({
  modelo,
  corHex,
  esgotado,
}: {
  modelo: string;
  corHex: string;
  esgotado: boolean;
}) {
  const palco = useRef<HTMLDivElement>(null);
  const corpo = useRef<HTMLDivElement>(null);
  const inclinacao = useRef({ x: 0, y: 0 });
  const [frente, setFrente] = useState(false);
  const frenteRef = useRef(frente);

  function aplicar(transicao: string) {
    const el = corpo.current;
    if (!el) return;
    const { x, y } = inclinacao.current;
    el.style.transition = transicao;
    el.style.transform = `rotateY(${(frenteRef.current ? 180 : 0) + x}deg) rotateX(${y}deg)`;
  }

  useEffect(() => {
    frenteRef.current = frente;
    aplicar("transform 800ms var(--ease-in-out)");
  }, [frente]);

  useEffect(() => {
    const area = palco.current;
    const mouseFino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!area || !mouseFino || reduzir) return;

    function mover(e: PointerEvent) {
      const caixa = area!.getBoundingClientRect();
      const x = (e.clientX - caixa.left) / caixa.width - 0.5;
      const y = (e.clientY - caixa.top) / caixa.height - 0.5;
      inclinacao.current = { x: x * 28, y: -y * 18 };
      aplicar("transform 400ms var(--ease-out)");
    }
    function voltar() {
      inclinacao.current = { x: 0, y: 0 };
      aplicar("transform 700ms var(--ease-out)");
    }

    area.addEventListener("pointermove", mover);
    area.addEventListener("pointerleave", voltar);
    return () => {
      area.removeEventListener("pointermove", mover);
      area.removeEventListener("pointerleave", voltar);
    };
  }, []);

  return (
    <div className="relative flex aspect-square flex-col items-center justify-center rounded-2xl bg-nevoa">
      <div ref={palco} className="palco-3d flex h-full w-full items-center justify-center">
        <div
          ref={corpo}
          className={`corpo-3d relative w-[34%] ${esgotado ? "opacity-50 grayscale" : ""}`}
        >
          <div className="face-3d">
            <Celular modelo={modelo} corHex={corHex} className="w-full" />
          </div>
          <div className="face-3d face-frente absolute inset-0" aria-hidden>
            <div className="tela-frente" style={{ "--corpo": corHex } as React.CSSProperties}>
              <span className="ilha" />
              <span className="hora">10:00</span>
              <span className="letreiro marca-tela">Master</span>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setFrente((v) => !v)}
        className="pressiona absolute bottom-4 rounded-full bg-papel px-4 py-2 text-sm font-semibold ring-1 ring-linha hover:ring-preto"
      >
        {frente ? "Ver a traseira" : "Ver a frente"}
      </button>
    </div>
  );
}
