import Link from "next/link";
import {
  formatarArmazenamento,
  formatarPreco,
  type Aparelho,
} from "@/lib/aparelhos";
import { Celular } from "./Celular";

export function Etiqueta({ aparelho, grande = false }: { aparelho: Aparelho; grande?: boolean }) {
  const esgotado = aparelho.quantidade === 0;
  return (
    <span className={`etiqueta ${esgotado ? "esgotada" : ""} ${grande ? "text-lg" : ""}`}>
      {esgotado ? (
        <span className="font-bold">Esgotado</span>
      ) : (
        <span className={`letreiro ${grande ? "text-4xl" : "text-2xl"}`}>
          {formatarPreco(aparelho.preco)}
        </span>
      )}
    </span>
  );
}

export function CartaoAparelho({ aparelho }: { aparelho: Aparelho }) {
  const esgotado = aparelho.quantidade === 0;
  return (
    <Link
      href={`/iphones/${aparelho.id}`}
      className="cartao group flex flex-col rounded-2xl"
    >
      <div className="relative flex h-60 items-center justify-center rounded-2xl bg-nevoa">
        {aparelho.fotos[0] ? (
          // eslint-disable-next-line @next/next/no-img-element -- foto do storage, já redimensionada no envio
          <img
            src={aparelho.fotos[0]}
            alt=""
            loading="lazy"
            className={`foto-aparelho h-full w-full object-contain p-6 ${esgotado ? "opacity-50 grayscale" : ""}`}
          />
        ) : (
          <Celular
            modelo={aparelho.modelo}
            corHex={aparelho.corHex}
            className={`w-[30%] ${esgotado ? "opacity-50 grayscale" : ""}`}
          />
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
            aparelho.estado === "novo" ? "bg-cobalto text-white" : "bg-papel text-marinho ring-1 ring-linha"
          }`}
        >
          {aparelho.estado === "novo" ? "Novo" : "Seminovo"}
        </span>
        {/* Etiqueta pendurada na beirada, como na prateleira */}
        <div className="absolute -bottom-4 left-3">
          <Etiqueta aparelho={aparelho} />
        </div>
      </div>
      <div className="px-1 pt-8">
        <h3 className="text-lg font-bold leading-tight underline-offset-4 group-hover:underline">
          {aparelho.modelo}
        </h3>
        <p className="mt-0.5 text-sm text-cinza">
          {formatarArmazenamento(aparelho.armazenamento)}, {aparelho.cor}
          {aparelho.bateria ? `, bateria ${aparelho.bateria}%` : ""}
        </p>
      </div>
    </Link>
  );
}
