"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { formatarArmazenamento, formatarPreco } from "@/lib/aparelhos";
import type { ItemEstoque } from "@/lib/painel/tipos";
import { Escolha } from "@/components/Escolha";
import { botaoPrimario, botaoSecundario, campo, rotulo } from "@/components/painel/estilos";
import { movimentar, type Resultado } from "./acoes";

export type TipoMovimento = "venda" | "entrada" | "ajuste";

const TITULOS: Record<TipoMovimento, string> = {
  venda: "Registrar venda",
  entrada: "Registrar entrada",
  ajuste: "Ajustar estoque",
};

/**
 * Janela para vender, dar entrada ou ajustar a quantidade de um aparelho.
 * Usa o <dialog> nativo: prende o foco, fecha com Esc e o leitor de tela anuncia como janela.
 */
export function DialogoMovimento({
  item,
  tipoInicial,
  aoFechar,
  aoConcluir,
}: {
  item: ItemEstoque;
  tipoInicial: TipoMovimento;
  aoFechar: () => void;
  aoConcluir: (mensagem: string) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [tipo, setTipo] = useState<TipoMovimento>(tipoInicial);
  const [forma, setForma] = useState("pix");
  const [estado, acao, enviando] = useActionState<Resultado, FormData>(async (anterior, form) => {
    const r = await movimentar(anterior, form);
    if (r.ok) aoConcluir(r.ok);
    return r;
  }, {});

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  const nome = `${item.modelo} ${formatarArmazenamento(item.armazenamento)} ${item.cor}`;

  return (
    <dialog
      ref={ref}
      onClose={aoFechar}
      aria-labelledby="titulo-movimento"
      className="dialogo m-auto w-[min(32rem,calc(100%-2rem))] rounded-2xl bg-papel p-0 text-marinho shadow-2xl backdrop:bg-marinho/50"
    >
      <form action={acao} className="flex flex-col gap-5 p-6">
        <input type="hidden" name="aparelho_id" value={item.id} />
        <input type="hidden" name="tipo" value={tipo} />
        <input type="hidden" name="forma_pagamento" value={forma} />

        <div>
          <h2 id="titulo-movimento" className="letreiro text-2xl">
            {TITULOS[tipo]}
          </h2>
          <p className="mt-1 text-cinza">
            {nome}, {item.quantidade} em estoque
          </p>
        </div>

        <Escolha<TipoMovimento>
          nome="tipo-visivel"
          legenda="O que aconteceu?"
          opcoes={[
            { valor: "venda", rotulo: "Venda" },
            { valor: "entrada", rotulo: "Entrada" },
            { valor: "ajuste", rotulo: "Ajuste" },
          ]}
          valor={tipo}
          onChange={setTipo}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className={rotulo}>{tipo === "ajuste" ? "Quanto muda (use - para tirar)" : "Quantidade"}</span>
            <input
              name="quantidade"
              type="number"
              required
              defaultValue={1}
              min={tipo === "ajuste" ? undefined : 1}
              max={tipo === "venda" ? item.quantidade : undefined}
              step={1}
              inputMode="numeric"
              className={campo}
            />
          </label>
          {tipo !== "ajuste" && (
            <label>
              <span className={rotulo}>{tipo === "venda" ? "Preço por unidade (R$)" : "Custo por unidade (R$)"}</span>
              <input
                key={tipo}
                name="preco_unitario"
                type="number"
                min={0}
                step="0.01"
                inputMode="decimal"
                defaultValue={tipo === "venda" ? item.preco : (item.custo ?? "")}
                className={campo}
              />
            </label>
          )}
        </div>

        {tipo === "venda" && (
          <>
            <Escolha
              nome="forma-visivel"
              legenda="Forma de pagamento"
              opcoes={[
                { valor: "pix", rotulo: "Pix" },
                { valor: "cartao", rotulo: "Cartão" },
                { valor: "dinheiro", rotulo: "Dinheiro" },
                { valor: "troca", rotulo: "Troca + diferença" },
              ]}
              valor={forma}
              onChange={setForma}
            />
            <label>
              <span className={rotulo}>Cliente (opcional)</span>
              <input name="cliente" autoComplete="off" className={campo} />
            </label>
          </>
        )}

        <label>
          <span className={rotulo}>{tipo === "ajuste" ? "Motivo do ajuste" : "Observação (opcional)"}</span>
          <input
            name="observacao"
            required={tipo === "ajuste"}
            placeholder={
              tipo === "entrada" ? "Ex.: fornecedor, nota fiscal" : tipo === "ajuste" ? "Ex.: aparelho com defeito" : ""
            }
            className={campo}
          />
        </label>

        {tipo === "venda" && (
          <p className="text-sm text-cinza">Preço de tabela: {formatarPreco(item.preco)}. Mude o valor se deu desconto.</p>
        )}

        {estado.erro && (
          <p role="alert" className="rounded-lg bg-alerta/10 px-3 py-2 text-sm font-medium text-alerta">
            {estado.erro}
          </p>
        )}

        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" onClick={() => ref.current?.close()} className={botaoSecundario}>
            Cancelar
          </button>
          <button type="submit" disabled={enviando} className={botaoPrimario}>
            {enviando ? "Salvando..." : TITULOS[tipo]}
          </button>
        </div>
      </form>
    </dialog>
  );
}
