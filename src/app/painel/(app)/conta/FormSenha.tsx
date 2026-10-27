"use client";

import { useActionState, useState } from "react";
import { botaoPrimario, campo, rotulo } from "@/components/painel/estilos";
import { trocarSenha, type Resultado } from "../acoes";

export function FormSenha() {
  const [rodada, setRodada] = useState(0);
  const [estado, acao, salvando] = useActionState<Resultado, FormData>(async (anterior, form) => {
    const r = await trocarSenha(anterior, form);
    if (r.ok) setRodada((n) => n + 1);
    return r;
  }, {});

  return (
    <form key={rodada} action={acao} className="grid gap-4">
      <label>
        <span className={rotulo}>Senha atual</span>
        <input name="atual" type="password" required autoComplete="current-password" className={campo} />
      </label>
      <label>
        <span className={rotulo}>Nova senha (mínimo 8 caracteres)</span>
        <input name="nova" type="password" required minLength={8} autoComplete="new-password" className={campo} />
      </label>
      <label>
        <span className={rotulo}>Repita a nova senha</span>
        <input name="repetida" type="password" required minLength={8} autoComplete="new-password" className={campo} />
      </label>
      {estado.erro && (
        <p role="alert" className="rounded-lg bg-alerta/10 px-3 py-2 text-sm font-medium text-alerta">
          {estado.erro}
        </p>
      )}
      {estado.ok && (
        <p role="status" className="rounded-lg bg-ok/10 px-3 py-2 text-sm font-medium text-ok">
          {estado.ok}
        </p>
      )}
      <div>
        <button type="submit" disabled={salvando} className={botaoPrimario}>
          {salvando ? "Trocando..." : "Trocar senha"}
        </button>
      </div>
    </form>
  );
}
