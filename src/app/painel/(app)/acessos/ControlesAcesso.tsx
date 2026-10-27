"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Papel } from "@/lib/painel/sessao";
import { alterarAcesso } from "../acoes";

export function ControlesAcesso({
  usuarioId,
  nome,
  papel,
  ativo,
}: {
  usuarioId: string;
  nome: string;
  papel: Papel;
  ativo: boolean;
}) {
  const router = useRouter();
  const [pendente, iniciar] = useTransition();
  const [erro, setErro] = useState("");

  function mudar(mudanca: { ativo?: boolean; papel?: Papel }) {
    iniciar(async () => {
      const r = await alterarAcesso(usuarioId, mudanca);
      if (r.erro) setErro(r.erro);
      else {
        setErro("");
        router.refresh();
      }
    });
  }

  const botao =
    "pressiona rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 ring-linha hover:ring-marinho disabled:opacity-50";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {ativo && (
        <button
          type="button"
          disabled={pendente}
          onClick={() => mudar({ papel: papel === "dono" ? "funcionario" : "dono" })}
          className={botao}
        >
          {papel === "dono" ? "Tornar funcionário" : "Tornar dono"}
        </button>
      )}
      <button
        type="button"
        disabled={pendente}
        onClick={() => {
          if (ativo && !confirm(`Tirar o acesso de ${nome}? A pessoa não consegue mais entrar no painel.`)) return;
          mudar({ ativo: !ativo });
        }}
        className={ativo ? `${botao} text-alerta ring-alerta/30` : `${botao} text-ok`}
      >
        {ativo ? "Tirar acesso" : "Devolver acesso"}
      </button>
      {erro && (
        <p role="alert" className="w-full text-sm text-alerta">
          {erro}
        </p>
      )}
    </div>
  );
}
