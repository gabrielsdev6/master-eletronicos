"use client";

import { useActionState } from "react";
import { entrar, type EstadoEntrada } from "./acoes";
import { campo } from "@/components/painel/estilos";

export function FormEntrada() {
  const [estado, acao, entrando] = useActionState<EstadoEntrada, FormData>(entrar, {});

  return (
    <form action={acao} className="flex flex-col gap-2">
      <label htmlFor="email" className="text-sm font-semibold">
        E-mail
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="username"
        defaultValue={estado.email}
        className={campo}
      />
      <label htmlFor="senha" className="mt-3 text-sm font-semibold">
        Senha
      </label>
      <input
        id="senha"
        name="senha"
        type="password"
        required
        autoComplete="current-password"
        aria-invalid={!!estado.erro}
        aria-describedby="erro-entrada"
        className={campo}
      />

      {estado.erro && (
        <p id="erro-entrada" role="alert" className="mt-2 text-sm font-medium text-alerta">
          {estado.erro}
        </p>
      )}
      <button
        type="submit"
        disabled={entrando}
        className="pressiona mt-4 rounded-full bg-cobalto px-6 py-3.5 font-semibold text-white hover:bg-cobalto-escuro disabled:opacity-60"
      >
        {entrando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
