"use client";

import { useEffect, useState } from "react";

const POR_LETRA = 45; // ms
const PAUSA_VIRGULA = 280; // ms extras depois de vírgula
const ESPERA_INICIAL = 350;

// O texto inteiro ocupa o espaço desde o início (as letras ainda não digitadas
// ficam invisíveis), então a quebra de linha não muda e a página não pula.
export function TituloDigitado({ texto, className = "" }: { texto: string; className?: string }) {
  const [digitadas, setDigitadas] = useState(0);
  const [terminou, setTerminou] = useState(false);

  useEffect(() => {
    let n = 0;
    let timer: ReturnType<typeof setTimeout>;

    // Com movimento reduzido, o título aparece inteiro de uma vez
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = setTimeout(() => {
        setDigitadas(texto.length);
        setTerminou(true);
      }, 0);
      return () => clearTimeout(timer);
    }

    function proxima() {
      n += 1;
      setDigitadas(n);
      if (n >= texto.length) {
        setTerminou(true);
        return;
      }
      const atraso = texto[n - 1] === "," ? POR_LETRA + PAUSA_VIRGULA : POR_LETRA;
      timer = setTimeout(proxima, atraso);
    }
    timer = setTimeout(proxima, ESPERA_INICIAL);
    return () => clearTimeout(timer);
  }, [texto]);

  return (
    <h1 className={className}>
      <span className="sr-only">{texto}</span>
      <span aria-hidden>
        {texto.slice(0, digitadas)}
        <span className={`cursor-digitacao ${terminou ? "piscando" : ""}`} />
        <span className="invisible">{texto.slice(digitadas)}</span>
      </span>
    </h1>
  );
}
