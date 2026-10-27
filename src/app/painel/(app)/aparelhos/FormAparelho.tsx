"use client";

import { useActionState, useState } from "react";
import { MODELOS_TROCA } from "@/lib/troca";
import type { ItemEstoque } from "@/lib/painel/tipos";
import { Escolha } from "@/components/Escolha";
import { Celular } from "@/components/Celular";
import { botaoPrimario, campo, cartao, rotulo } from "@/components/painel/estilos";
import { salvarAparelho, type Resultado } from "../acoes";

const MEMORIAS = [64, 128, 256, 512, 1024];

export function FormAparelho({ item }: { item?: ItemEstoque }) {
  const [estado, acao, salvando] = useActionState<Resultado, FormData>(salvarAparelho, {});
  const [tipo, setTipo] = useState<"novo" | "seminovo">(item?.estado ?? "novo");
  const [memoria, setMemoria] = useState(String(item?.armazenamento ?? 128));
  const [modelo, setModelo] = useState(item?.modelo ?? "");
  const [corHex, setCorHex] = useState(item?.corHex ?? "#2b2b2d");

  return (
    <form action={acao} className={`${cartao} grid gap-6 p-5 sm:p-6`}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <input type="hidden" name="estado" value={tipo} />
      <input type="hidden" name="armazenamento" value={memoria} />

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <label>
          <span className={rotulo}>Modelo</span>
          <input
            name="modelo"
            required
            list="modelos-iphone"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            placeholder="iPhone 15 Pro"
            className={campo}
          />
          <datalist id="modelos-iphone">
            {MODELOS_TROCA.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </label>
        <div className="hidden items-end justify-center sm:flex" aria-hidden>
          <Celular modelo={modelo} corHex={corHex} className="w-9" />
        </div>
      </div>

      <Escolha
        nome="memoria-visivel"
        legenda="Armazenamento"
        opcoes={MEMORIAS.map((gb) => ({ valor: String(gb), rotulo: gb >= 1024 ? "1 TB" : `${gb} GB` }))}
        valor={memoria}
        onChange={setMemoria}
      />

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <label>
          <span className={rotulo}>Cor</span>
          <input name="cor" required defaultValue={item?.cor} placeholder="Titânio natural" className={campo} />
        </label>
        <label>
          <span className={rotulo}>Cor do desenho</span>
          <input
            name="cor_hex"
            type="color"
            value={corHex}
            onChange={(e) => setCorHex(e.target.value)}
            className="h-[46px] w-20 cursor-pointer rounded-lg border border-linha bg-papel p-1"
          />
        </label>
      </div>

      <Escolha<"novo" | "seminovo">
        nome="estado-visivel"
        legenda="Estado"
        opcoes={[
          { valor: "novo", rotulo: "Novo, lacrado" },
          { valor: "seminovo", rotulo: "Seminovo" },
        ]}
        valor={tipo}
        onChange={setTipo}
      />

      {tipo === "seminovo" && (
        <label className="aparece max-w-48">
          <span className={rotulo}>Saúde da bateria (%)</span>
          <input
            name="bateria"
            type="number"
            min={1}
            max={100}
            required
            defaultValue={item?.bateria ?? ""}
            inputMode="numeric"
            className={campo}
          />
        </label>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <label>
          <span className={rotulo}>Preço de venda (R$)</span>
          <input
            name="preco"
            type="number"
            min={1}
            step="0.01"
            required
            defaultValue={item?.preco}
            inputMode="decimal"
            className={campo}
          />
        </label>
        <label>
          <span className={rotulo}>Custo (R$, opcional)</span>
          <input
            name="custo"
            type="number"
            min={0}
            step="0.01"
            defaultValue={item?.custo ?? ""}
            inputMode="decimal"
            aria-describedby="ajuda-custo"
            className={campo}
          />
          <span id="ajuda-custo" className="mt-1 block text-xs text-cinza">
            Não aparece no site. Usado no lucro dos relatórios.
          </span>
        </label>
        {!item && (
          <label>
            <span className={rotulo}>Quantidade que chegou</span>
            <input
              name="quantidade_inicial"
              type="number"
              min={0}
              step={1}
              defaultValue={1}
              inputMode="numeric"
              className={campo}
            />
          </label>
        )}
      </div>

      <label>
        <span className={rotulo}>Observação interna (opcional)</span>
        <textarea
          name="observacao"
          rows={2}
          defaultValue={item?.observacao ?? ""}
          placeholder="Ex.: veio com caixa e cabo, pequeno risco na lateral"
          className={campo}
        />
      </label>

      <label className="flex items-center gap-3">
        <input name="destaque" type="checkbox" defaultChecked={item?.destaque} className="size-5 accent-[#2B4BF2]" />
        <span>
          <span className="font-semibold">Mostrar em destaque na página inicial</span>
          <span className="block text-sm text-cinza">Os três primeiros em destaque também aparecem na vitrine do topo.</span>
        </span>
      </label>

      {estado.erro && (
        <p role="alert" className="rounded-lg bg-alerta/10 px-3 py-2 text-sm font-medium text-alerta">
          {estado.erro}
        </p>
      )}
      {estado.ok && (
        <p key={estado.ok} role="status" className="aparece rounded-lg bg-ok/10 px-3 py-2 text-sm font-medium text-ok">
          {estado.ok}
        </p>
      )}

      <div>
        <button type="submit" disabled={salvando} className={botaoPrimario}>
          {salvando ? "Salvando..." : item ? "Salvar alterações" : "Cadastrar aparelho"}
        </button>
      </div>
    </form>
  );
}
