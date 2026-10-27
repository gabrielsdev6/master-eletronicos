"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { botaoPerigo, botaoSecundario } from "@/components/painel/estilos";
import { arquivarAparelho } from "../../acoes";

export function BotaoArquivar({ id, ativo }: { id: string; ativo: boolean }) {
  const router = useRouter();
  const [pendente, iniciar] = useTransition();
  const [erro, setErro] = useState("");

  return (
    <div>
      <button
        type="button"
        disabled={pendente}
        onClick={() => {
          if (ativo && !confirm("Arquivar este aparelho? Ele sai do site e do estoque, mas o histórico continua.")) return;
          iniciar(async () => {
            const r = await arquivarAparelho(id, !ativo);
            if (r.erro) setErro(r.erro);
            else router.refresh();
          });
        }}
        className={ativo ? botaoPerigo : botaoSecundario}
      >
        {ativo ? "Arquivar aparelho" : "Voltar a vender"}
      </button>
      {erro && (
        <p role="alert" className="mt-2 text-sm text-alerta">
          {erro}
        </p>
      )}
    </div>
  );
}
