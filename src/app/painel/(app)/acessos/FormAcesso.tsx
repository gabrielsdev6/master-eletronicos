"use client";

import { useActionState, useState } from "react";
import { Escolha } from "@/components/Escolha";
import { botaoPrimario, campo, rotulo } from "@/components/painel/estilos";
import { criarAcesso, type Resultado } from "../acoes";

export function FormAcesso() {
  const [papel, setPapel] = useState<"funcionario" | "dono">("funcionario");
  // Limpa o formulário depois de criar, trocando a chave
  const [rodada, setRodada] = useState(0);
  const [estado, acao, criando] = useActionState<Resultado, FormData>(async (anterior, form) => {
    const r = await criarAcesso(anterior, form);
    if (r.ok) setRodada((n) => n + 1);
    return r;
  }, {});

  return (
    <form key={rodada} action={acao} className="grid gap-4">
      <input type="hidden" name="papel" value={papel} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className={rotulo}>Nome</span>
          <input name="nome" required autoComplete="off" className={campo} />
        </label>
        <label>
          <span className={rotulo}>E-mail</span>
          <input name="email" type="email" required autoComplete="off" className={campo} />
        </label>
      </div>
      <label className="sm:max-w-xs">
        <span className={rotulo}>Senha inicial (mínimo 8 caracteres)</span>
        <input name="senha" type="text" required minLength={8} autoComplete="new-password" className={campo} />
      </label>
      <Escolha<"funcionario" | "dono">
        nome="papel-visivel"
        legenda="Tipo de acesso"
        opcoes={[
          { valor: "funcionario", rotulo: "Funcionário" },
          { valor: "dono", rotulo: "Dono (também gerencia acessos)" },
        ]}
        valor={papel}
        onChange={setPapel}
      />
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
        <button type="submit" disabled={criando} className={botaoPrimario}>
          {criando ? "Criando..." : "Criar acesso"}
        </button>
      </div>
    </form>
  );
}
