"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { clienteNavegador } from "@/lib/supabase/navegador";
import { cartao } from "@/components/painel/estilos";
import { apagarFoto, registrarFoto, tornarCapa } from "../../acoes";

type Foto = { id: string; url: string };

const LADO_MAXIMO = 1600;

// Reduz a foto no navegador antes de enviar: foto de celular (5 MB+) vira ~200 KB em WebP
async function reduzir(arquivo: File): Promise<Blob> {
  const imagem = await createImageBitmap(arquivo);
  const escala = Math.min(1, LADO_MAXIMO / Math.max(imagem.width, imagem.height));
  const tela = document.createElement("canvas");
  tela.width = Math.round(imagem.width * escala);
  tela.height = Math.round(imagem.height * escala);
  tela.getContext("2d")!.drawImage(imagem, 0, 0, tela.width, tela.height);
  imagem.close();
  return new Promise((resolve, reject) =>
    tela.toBlob((b) => (b ? resolve(b) : reject(new Error("falha ao converter"))), "image/webp", 0.85),
  );
}

export function FotosAparelho({ aparelhoId, fotos }: { aparelhoId: string; fotos: Foto[] }) {
  const router = useRouter();
  const entrada = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState("");
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const [pendente, iniciar] = useTransition();

  async function enviar(lista: FileList) {
    setMensagem(null);
    const sb = clienteNavegador();
    let enviadas = 0;
    for (const [n, arquivo] of [...lista].entries()) {
      setEnviando(`Enviando foto ${n + 1} de ${lista.length}...`);
      try {
        const blob = await reduzir(arquivo);
        const caminho = `${aparelhoId}/${crypto.randomUUID()}.webp`;
        const { error } = await sb.storage.from("fotos").upload(caminho, blob, { contentType: "image/webp" });
        if (error) throw error;
        const r = await registrarFoto(aparelhoId, caminho);
        if (r.erro) throw new Error(r.erro);
        enviadas++;
      } catch (e) {
        console.error("envio de foto falhou", e);
        setMensagem({ tipo: "erro", texto: `A foto "${arquivo.name}" não foi enviada. Confira se é JPG, PNG ou WebP.` });
      }
    }
    setEnviando("");
    if (entrada.current) entrada.current.value = "";
    if (enviadas > 0) {
      setMensagem((m) => m ?? { tipo: "ok", texto: enviadas === 1 ? "Foto adicionada." : `${enviadas} fotos adicionadas.` });
      router.refresh();
    }
  }

  function executar(acao: () => Promise<{ ok?: string; erro?: string }>) {
    iniciar(async () => {
      const r = await acao();
      setMensagem(r.erro ? { tipo: "erro", texto: r.erro } : { tipo: "ok", texto: r.ok ?? "" });
      router.refresh();
    });
  }

  return (
    <section className={`${cartao} p-5 sm:p-6`} aria-labelledby="titulo-fotos">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="titulo-fotos" className="text-lg font-bold">
            Fotos
          </h2>
          <p className="text-sm text-cinza">A primeira é a capa no catálogo. Sem fotos, o site mostra o desenho.</p>
        </div>
        <label className="pressiona inline-flex cursor-pointer items-center rounded-full bg-cobalto px-5 py-2.5 font-semibold text-white focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-marinho hover:bg-cobalto-escuro">
          Adicionar fotos
          <input
            ref={entrada}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={!!enviando}
            onChange={(e) => e.target.files?.length && enviar(e.target.files)}
            className="sr-only"
          />
        </label>
      </div>

      <div aria-live="polite">
        {enviando && <p className="mt-4 text-sm font-medium">{enviando}</p>}
        {mensagem && (
          <p className={`mt-4 text-sm font-medium ${mensagem.tipo === "erro" ? "text-alerta" : "text-ok"}`}>
            {mensagem.texto}
          </p>
        )}
      </div>

      {fotos.length > 0 ? (
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {fotos.map((f, i) => (
            <li key={f.id} className="overflow-hidden rounded-xl ring-1 ring-linha">
              <div className="relative aspect-square bg-gelo">
                {/* eslint-disable-next-line @next/next/no-img-element -- foto do storage */}
                <img src={f.url} alt={`Foto ${i + 1}`} className="h-full w-full object-contain p-2" />
                {i === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-cobalto px-2 py-0.5 text-xs font-semibold text-white">
                    Capa
                  </span>
                )}
              </div>
              <div className="flex divide-x divide-linha border-t border-linha text-sm font-semibold">
                {i > 0 && (
                  <button
                    type="button"
                    disabled={pendente}
                    onClick={() => executar(() => tornarCapa(aparelhoId, f.id))}
                    className="flex-1 py-2 text-cobalto hover:bg-gelo disabled:opacity-50"
                  >
                    Usar como capa
                  </button>
                )}
                <button
                  type="button"
                  disabled={pendente}
                  onClick={() => {
                    if (confirm("Apagar esta foto?")) executar(() => apagarFoto(f.id));
                  }}
                  className="flex-1 py-2 text-alerta hover:bg-alerta/5 disabled:opacity-50"
                >
                  Apagar
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 rounded-xl border-2 border-dashed border-linha p-8 text-center text-cinza">
          Nenhuma foto ainda. Fotos reais passam mais confiança, principalmente em seminovos.
        </p>
      )}
    </section>
  );
}
