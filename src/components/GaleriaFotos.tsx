"use client";

import { useState } from "react";

// Fotos reais do aparelho: uma grande e as miniaturas embaixo para trocar
export function GaleriaFotos({ fotos, nome, esgotado }: { fotos: string[]; nome: string; esgotado: boolean }) {
  const [atual, setAtual] = useState(0);

  return (
    <div>
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-nevoa">
        {/* eslint-disable-next-line @next/next/no-img-element -- foto do storage, já redimensionada no envio */}
        <img
          key={fotos[atual]}
          src={fotos[atual]}
          alt={`${nome}, foto ${atual + 1} de ${fotos.length}`}
          className={`aparece h-full w-full object-contain p-6 ${esgotado ? "opacity-50 grayscale" : ""}`}
        />
      </div>
      {fotos.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto" role="group" aria-label="Fotos do aparelho">
          {fotos.map((f, i) => (
            <button
              key={f}
              type="button"
              onClick={() => setAtual(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-pressed={i === atual}
              className={`pressiona size-20 shrink-0 overflow-hidden rounded-xl bg-nevoa ring-2 ${
                i === atual ? "ring-cobalto" : "ring-transparent hover:ring-linha"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- miniatura da mesma foto */}
              <img src={f} alt="" className="h-full w-full object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
