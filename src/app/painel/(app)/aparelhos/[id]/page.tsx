import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatarArmazenamento } from "@/lib/aparelhos";
import { buscarItem } from "@/lib/painel/dados";
import { listarMovimentacoes } from "@/lib/painel/movimentacoes";
import { exigirEquipe } from "@/lib/painel/sessao";
import { urlDaFoto } from "@/lib/supabase/config";
import { cartao } from "@/components/painel/estilos";
import { TabelaMovimentacoes } from "@/components/painel/TabelaMovimentacoes";
import { FormAparelho } from "../FormAparelho";
import { FotosAparelho } from "./FotosAparelho";
import { BotaoArquivar } from "./BotaoArquivar";

export const metadata: Metadata = { title: "Editar aparelho" };

export default async function EditarAparelho({ params, searchParams }: PageProps<"/painel/aparelhos/[id]">) {
  const { id } = await params;
  const { criado } = await searchParams;
  const item = await buscarItem(id);
  if (!item) notFound();

  const { sb } = await exigirEquipe();
  const [{ data: fotos }, historico] = await Promise.all([
    sb.from("fotos").select("id, caminho").eq("aparelho_id", id).order("ordem"),
    listarMovimentacoes({ aparelhoId: id, limite: 15 }),
  ]);

  return (
    <div className="grid max-w-3xl gap-6">
      <div>
        <Link href="/painel" className="text-sm font-semibold text-cobalto hover:underline">
          Voltar ao estoque
        </Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="letreiro text-3xl sm:text-4xl">
              {item.modelo} {formatarArmazenamento(item.armazenamento)}
            </h1>
            <p className="mt-1 text-cinza">
              {item.cor}, {item.quantidade} em estoque{!item.ativo && ", arquivado"}
            </p>
          </div>
          {item.ativo && (
            <Link
              href={`/iphones/${item.slug}`}
              target="_blank"
              className="text-sm font-semibold text-cobalto underline underline-offset-4"
            >
              Ver no site
            </Link>
          )}
        </div>
      </div>

      {criado === "1" && (
        <p role="status" className="rounded-lg bg-ok/10 px-4 py-3 text-sm font-medium text-ok">
          Aparelho cadastrado. Agora adicione as fotos.
        </p>
      )}

      <FotosAparelho
        aparelhoId={item.id}
        fotos={(fotos ?? []).map((f) => ({ id: f.id, url: urlDaFoto(f.caminho) }))}
      />

      <FormAparelho item={item} />

      <section className={cartao} aria-labelledby="titulo-historico">
        <div className="flex items-center justify-between gap-3 border-b border-linha px-4 py-3">
          <h2 id="titulo-historico" className="text-lg font-bold">
            Histórico deste aparelho
          </h2>
          <p className="text-sm text-cinza">Para vender ou dar entrada, use o Estoque.</p>
        </div>
        <TabelaMovimentacoes itens={historico} comAparelho={false} />
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <BotaoArquivar id={item.id} ativo={item.ativo} />
        <p className="text-sm text-cinza">
          {item.ativo
            ? "Arquivar tira o aparelho do site e do estoque, sem apagar o histórico."
            : "Este aparelho está arquivado e não aparece no site."}
        </p>
      </div>
    </div>
  );
}
