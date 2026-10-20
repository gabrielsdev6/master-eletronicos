"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  formatarArmazenamento,
  formatarPreco,
  type Aparelho,
  type Estado,
} from "@/lib/aparelhos";
import { Celular } from "@/components/Celular";
import { Marca } from "@/components/Cabecalho";

const novoVazio = {
  modelo: "",
  armazenamento: "128",
  cor: "",
  estado: "novo" as Estado,
  preco: "",
  quantidade: "1",
};

export function PainelEstoque({ iniciais }: { iniciais: Aparelho[] }) {
  const [lista, setLista] = useState(iniciais);
  const [busca, setBusca] = useState("");
  const [cadastrando, setCadastrando] = useState(false);
  const [novo, setNovo] = useState(novoVazio);
  const [aviso, setAviso] = useState("");

  const filtrada = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return lista;
    return lista.filter((a) => `${a.modelo} ${a.cor} ${a.armazenamento}`.toLowerCase().includes(termo));
  }, [lista, busca]);

  const totalUnidades = lista.reduce((s, a) => s + a.quantidade, 0);
  const esgotados = lista.filter((a) => a.quantidade === 0).length;

  function alterar(id: string, mudanca: Partial<Aparelho>) {
    setLista((atual) => atual.map((a) => (a.id === id ? { ...a, ...mudanca } : a)));
  }

  function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    const aparelho: Aparelho = {
      id: `novo-${Date.now()}`,
      modelo: novo.modelo.trim(),
      armazenamento: Number(novo.armazenamento),
      cor: novo.cor.trim(),
      corHex: "#d9d9d6",
      estado: novo.estado,
      preco: Number(novo.preco),
      quantidade: Number(novo.quantidade),
      destaque: false,
    };
    setLista((atual) => [aparelho, ...atual]);
    setNovo(novoVazio);
    setCadastrando(false);
    setAviso(`${aparelho.modelo} cadastrado.`);
  }

  const campo = "w-full rounded-lg border border-linha bg-papel px-3 py-2.5 focus:border-preto focus:outline-none";

  return (
    <div className="min-h-full bg-nevoa">
      <header className="bg-preto text-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Marca />
            <span className="rounded bg-white/10 px-2 py-0.5 text-xs">Painel</span>
          </div>
          <Link href="/" className="text-sm font-semibold hover:text-amarelo">
            Ver o site
          </Link>
        </div>
      </header>

      <div className="bg-amarelo">
        <p className="mx-auto max-w-6xl px-4 py-2.5 text-sm font-medium">
          Isto é uma demonstração: as mudanças ficam só nesta tela. No site final, o que vocês mudarem
          aqui aparece na hora para os clientes.
        </p>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="letreiro text-3xl sm:text-4xl">Estoque</h1>
            <p className="mt-2 text-cinza">
              {lista.length} aparelhos cadastrados, {totalUnidades} unidades na loja
              {esgotados > 0 && `, ${esgotados} esgotado${esgotados > 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCadastrando((v) => !v)}
            aria-expanded={cadastrando}
            className="pressiona rounded-full bg-preto px-5 py-3 font-semibold text-amarelo hover:bg-preto/85"
          >
            {cadastrando ? "Fechar cadastro" : "Cadastrar aparelho"}
          </button>
        </div>

        {aviso && (
          <p key={aviso} role="status" className="aparece mt-4 rounded-lg bg-papel px-4 py-3 text-sm font-medium text-ok ring-1 ring-linha">
            {aviso}
          </p>
        )}

        {cadastrando && (
          <form onSubmit={cadastrar} className="aparece mt-6 grid gap-4 rounded-xl bg-papel p-5 ring-1 ring-linha sm:grid-cols-3">
            <label className="space-y-1 text-sm font-semibold sm:col-span-2">
              <span>Modelo</span>
              <input required className={campo} placeholder="iPhone 15 Pro" value={novo.modelo}
                onChange={(e) => setNovo({ ...novo, modelo: e.target.value })} />
            </label>
            <label className="space-y-1 text-sm font-semibold">
              <span>Cor</span>
              <input required className={campo} placeholder="Preto" value={novo.cor}
                onChange={(e) => setNovo({ ...novo, cor: e.target.value })} />
            </label>
            <label className="space-y-1 text-sm font-semibold">
              <span>Armazenamento</span>
              <select className={campo} value={novo.armazenamento}
                onChange={(e) => setNovo({ ...novo, armazenamento: e.target.value })}>
                {[64, 128, 256, 512, 1024].map((gb) => (
                  <option key={gb} value={gb}>{formatarArmazenamento(gb)}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm font-semibold">
              <span>Estado</span>
              <select className={campo} value={novo.estado}
                onChange={(e) => setNovo({ ...novo, estado: e.target.value as Estado })}>
                <option value="novo">Novo</option>
                <option value="seminovo">Seminovo</option>
              </select>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="space-y-1 text-sm font-semibold">
                <span>Preço (R$)</span>
                <input required type="number" min={1} inputMode="numeric" className={campo} value={novo.preco}
                  onChange={(e) => setNovo({ ...novo, preco: e.target.value })} />
              </label>
              <label className="space-y-1 text-sm font-semibold">
                <span>Quantidade</span>
                <input required type="number" min={0} inputMode="numeric" className={campo} value={novo.quantidade}
                  onChange={(e) => setNovo({ ...novo, quantidade: e.target.value })} />
              </label>
            </div>
            <div className="sm:col-span-3">
              <button type="submit" className="pressiona rounded-full bg-amarelo px-5 py-3 font-semibold hover:bg-amarelo-escuro">
                Salvar aparelho
              </button>
            </div>
          </form>
        )}

        <label className="mt-8 block">
          <span className="sr-only">Buscar aparelho</span>
          <input
            type="search"
            placeholder="Buscar por modelo, cor ou memória"
            className={`${campo} max-w-md`}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </label>

        <ul className="mt-4 divide-y divide-linha overflow-hidden rounded-xl bg-papel ring-1 ring-linha">
          {filtrada.map((a) => (
            <li key={a.id} className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 p-4 md:grid-cols-[auto_1fr_auto_auto_auto]">
              <Celular modelo={a.modelo} corHex={a.corHex} className="w-7" />
              <div className="min-w-0">
                <p className="font-bold">{a.modelo}</p>
                <p className="text-sm text-cinza">
                  {formatarArmazenamento(a.armazenamento)}, {a.cor}, {a.estado}
                </p>
              </div>

              <label className="col-span-2 flex items-center gap-2 text-sm md:col-span-1">
                <span className="w-20 text-cinza md:sr-only">Preço</span>
                <span className="text-cinza">R$</span>
                <input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={a.preco}
                  onChange={(e) => alterar(a.id, { preco: Number(e.target.value) })}
                  aria-label={`Preço do ${a.modelo} ${a.cor}`}
                  className="w-28 rounded-lg border border-linha px-3 py-2 font-semibold tabular-nums focus:border-preto focus:outline-none"
                />
              </label>

              <div className="col-span-2 flex items-center gap-2 text-sm md:col-span-1">
                <span className="w-20 text-cinza md:sr-only">Quantidade</span>
                <button
                  type="button"
                  onClick={() => alterar(a.id, { quantidade: Math.max(0, a.quantidade - 1) })}
                  disabled={a.quantidade === 0}
                  aria-label={`Tirar uma unidade do ${a.modelo} ${a.cor}`}
                  className="pressiona size-10 rounded-lg border border-linha text-xl font-bold hover:border-preto disabled:opacity-30"
                >
                  −
                </button>
                <span className="w-8 text-center text-lg font-bold tabular-nums" aria-live="polite">
                  {a.quantidade}
                </span>
                <button
                  type="button"
                  onClick={() => alterar(a.id, { quantidade: a.quantidade + 1 })}
                  aria-label={`Adicionar uma unidade do ${a.modelo} ${a.cor}`}
                  className="pressiona size-10 rounded-lg border border-linha text-xl font-bold hover:border-preto"
                >
                  +
                </button>
              </div>

              <div className="col-span-2 flex items-center justify-between gap-3 md:col-span-1 md:justify-end">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    a.quantidade === 0 ? "bg-alerta/10 text-alerta" : "bg-ok/10 text-ok"
                  }`}
                >
                  {a.quantidade === 0 ? "Esgotado no site" : `No site por ${formatarPreco(a.preco)}`}
                </span>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={a.destaque}
                    onChange={(e) => alterar(a.id, { destaque: e.target.checked })}
                    className="size-4 accent-black"
                  />
                  Destaque
                </label>
              </div>
            </li>
          ))}
          {filtrada.length === 0 && (
            <li className="p-8 text-center text-cinza">Nenhum aparelho encontrado com “{busca}”.</li>
          )}
        </ul>
      </main>
    </div>
  );
}
