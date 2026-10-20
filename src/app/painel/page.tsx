import type { Metadata } from "next";
import { aparelhos } from "@/lib/aparelhos";
import { PainelEstoque } from "./PainelEstoque";

export const metadata: Metadata = { title: "Painel da loja" };

export default function Painel() {
  return <PainelEstoque iniciais={aparelhos} />;
}
