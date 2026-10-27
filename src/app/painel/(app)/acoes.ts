"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exigirDono, exigirEquipe, type Papel } from "@/lib/painel/sessao";
import { clienteServico } from "@/lib/supabase/servico";
import { formatarArmazenamento } from "@/lib/aparelhos";
import { gerarSlug } from "@/lib/painel/slug";

export type Resultado = { ok?: string; erro?: string };

const FORMAS = ["pix", "cartao", "dinheiro", "troca"] as const;
type Forma = (typeof FORMAS)[number];

function texto(form: FormData, chave: string) {
  return String(form.get(chave) ?? "").trim();
}

function numero(form: FormData, chave: string) {
  const bruto = texto(form, chave).replace(/\./g, "").replace(",", ".");
  if (bruto === "") return null;
  const n = Number(bruto);
  return Number.isFinite(n) ? n : NaN;
}

// O site e o painel leem o estoque a cada visita; isto limpa o que o navegador guardou
function atualizarTelas() {
  revalidatePath("/", "layout");
}

/* ---------- Vendas, entradas e ajustes ---------- */

export async function movimentar(_: Resultado, form: FormData): Promise<Resultado> {
  const { sb } = await exigirEquipe();
  const aparelhoId = texto(form, "aparelho_id");
  const tipo = texto(form, "tipo");
  const quantidade = numero(form, "quantidade");
  const preco = numero(form, "preco_unitario");
  const forma = texto(form, "forma_pagamento");

  if (!["venda", "entrada", "ajuste"].includes(tipo)) return { erro: "Escolha o que aconteceu." };
  if (quantidade === null || !Number.isInteger(quantidade) || quantidade === 0) {
    return { erro: "Informe uma quantidade inteira diferente de zero." };
  }
  if (tipo !== "ajuste" && quantidade < 0) return { erro: "A quantidade precisa ser positiva." };
  if (Number.isNaN(preco) || (preco !== null && preco < 0)) return { erro: "Confira o valor informado." };
  if (tipo === "venda" && !FORMAS.includes(forma as Forma)) return { erro: "Escolha a forma de pagamento." };
  if (tipo === "ajuste" && !texto(form, "observacao")) {
    return { erro: "Explique o motivo do ajuste, por exemplo: aparelho com defeito devolvido ao fornecedor." };
  }

  const { data: novaQuantidade, error } = await sb.rpc("registrar_movimentacao", {
    p_aparelho: aparelhoId,
    p_tipo: tipo as "venda" | "entrada" | "ajuste",
    p_quantidade: quantidade,
    p_preco_unitario: preco ?? undefined,
    p_forma_pagamento: tipo === "venda" ? (forma as Forma) : undefined,
    p_cliente: texto(form, "cliente") || undefined,
    p_observacao: texto(form, "observacao") || undefined,
  });

  if (error) {
    if (error.message.includes("estoque insuficiente")) {
      return { erro: "Não tem essa quantidade em estoque. Confira o número ou registre uma entrada antes." };
    }
    if (error.code === "42501") return { erro: "Sua conta não tem mais acesso ao painel." };
    console.error("movimentação falhou", error);
    return { erro: "Não deu para registrar agora. Tente de novo." };
  }

  atualizarTelas();
  const palavra = tipo === "venda" ? "Venda registrada" : tipo === "entrada" ? "Entrada registrada" : "Ajuste registrado";
  return { ok: `${palavra}. Agora tem ${novaQuantidade} em estoque.` };
}

/* ---------- Cadastro de aparelhos ---------- */

export async function salvarAparelho(_: Resultado, form: FormData): Promise<Resultado> {
  const { sb } = await exigirEquipe();
  const id = texto(form, "id");

  const modelo = texto(form, "modelo");
  const armazenamento = numero(form, "armazenamento");
  const cor = texto(form, "cor");
  const corHex = texto(form, "cor_hex") || "#d9d9d6";
  const estado = texto(form, "estado");
  const bateria = numero(form, "bateria");
  const preco = numero(form, "preco");
  const custo = numero(form, "custo");
  const quantidadeInicial = numero(form, "quantidade_inicial") ?? 0;

  if (!modelo) return { erro: "Informe o modelo, por exemplo: iPhone 15 Pro." };
  if (!armazenamento || !Number.isInteger(armazenamento) || armazenamento <= 0) return { erro: "Escolha o armazenamento." };
  if (!cor) return { erro: "Informe a cor." };
  if (!/^#[0-9a-fA-F]{6}$/.test(corHex)) return { erro: "Escolha a cor do desenho." };
  if (estado !== "novo" && estado !== "seminovo") return { erro: "Escolha se é novo ou seminovo." };
  if (estado === "seminovo" && (bateria === null || Number.isNaN(bateria) || bateria < 1 || bateria > 100)) {
    return { erro: "Informe a saúde da bateria do seminovo (de 1 a 100%)." };
  }
  if (!preco || Number.isNaN(preco) || preco <= 0) return { erro: "Informe o preço de venda." };
  if (Number.isNaN(custo) || (custo !== null && custo < 0)) return { erro: "Confira o custo." };
  if (Number.isNaN(quantidadeInicial) || !Number.isInteger(quantidadeInicial) || quantidadeInicial < 0) {
    return { erro: "A quantidade inicial precisa ser um número inteiro." };
  }

  const dados = {
    modelo,
    armazenamento,
    cor,
    cor_hex: corHex.toLowerCase(),
    estado: estado as "novo" | "seminovo",
    bateria: estado === "seminovo" ? bateria : null,
    preco,
    custo,
    destaque: form.get("destaque") === "on",
    observacao: texto(form, "observacao") || null,
  };

  if (id) {
    const { error } = await sb.from("aparelhos").update(dados).eq("id", id);
    if (error) {
      console.error("editar aparelho falhou", error);
      return { erro: "Não deu para salvar. Tente de novo." };
    }
    atualizarTelas();
    return { ok: "Alterações salvas." };
  }

  // Endereço da página: modelo, memória e cor; se já existir, ganha um número no fim
  const base = gerarSlug(`${modelo} ${formatarArmazenamento(armazenamento)} ${cor}`);
  const { data: parecidos } = await sb.from("aparelhos").select("slug").like("slug", `${base}%`);
  const usados = new Set((parecidos ?? []).map((p) => p.slug));
  let slug = base;
  for (let n = 2; usados.has(slug); n++) slug = `${base}-${n}`;

  const { data: novo, error } = await sb
    .from("aparelhos")
    .insert({ ...dados, slug })
    .select("id")
    .single();
  if (error || !novo) {
    console.error("cadastrar aparelho falhou", error);
    return { erro: "Não deu para cadastrar. Tente de novo." };
  }

  // A quantidade inicial entra pelo histórico, como uma entrada de mercadoria
  if (quantidadeInicial > 0) {
    const { error: erroEntrada } = await sb.rpc("registrar_movimentacao", {
      p_aparelho: novo.id,
      p_tipo: "entrada",
      p_quantidade: quantidadeInicial,
      p_preco_unitario: custo ?? undefined,
      p_observacao: "Cadastro do aparelho",
    });
    if (erroEntrada) console.error("entrada inicial falhou", erroEntrada);
  }

  atualizarTelas();
  redirect(`/painel/aparelhos/${novo.id}?criado=1`);
}

export async function arquivarAparelho(id: string, ativo: boolean): Promise<Resultado> {
  const { sb } = await exigirEquipe();
  const { error } = await sb.from("aparelhos").update({ ativo }).eq("id", id);
  if (error) {
    console.error("arquivar falhou", error);
    return { erro: "Não deu para mudar agora. Tente de novo." };
  }
  atualizarTelas();
  return { ok: ativo ? "Aparelho de volta ao site e ao estoque." : "Aparelho arquivado. Ele saiu do site." };
}

/* ---------- Fotos ---------- */

// A foto já foi enviada ao storage pelo navegador; aqui ela entra no cadastro
export async function registrarFoto(aparelhoId: string, caminho: string): Promise<Resultado> {
  const { sb } = await exigirEquipe();
  if (!caminho.startsWith(`${aparelhoId}/`)) return { erro: "Foto inválida." };

  const { data: ultimas } = await sb
    .from("fotos")
    .select("ordem")
    .eq("aparelho_id", aparelhoId)
    .order("ordem", { ascending: false })
    .limit(1);
  const ordem = (ultimas?.[0]?.ordem ?? -1) + 1;

  const { error } = await sb.from("fotos").insert({ aparelho_id: aparelhoId, caminho, ordem });
  if (error) {
    console.error("registrar foto falhou", error);
    await sb.storage.from("fotos").remove([caminho]);
    return { erro: "Não deu para salvar a foto. Tente de novo." };
  }
  atualizarTelas();
  return { ok: "Foto adicionada." };
}

export async function apagarFoto(fotoId: string): Promise<Resultado> {
  const { sb } = await exigirEquipe();
  const { data: foto } = await sb.from("fotos").select("caminho").eq("id", fotoId).maybeSingle();
  if (!foto) return { erro: "Essa foto já foi apagada." };

  const { error } = await sb.from("fotos").delete().eq("id", fotoId);
  if (error) {
    console.error("apagar foto falhou", error);
    return { erro: "Não deu para apagar. Tente de novo." };
  }
  await sb.storage.from("fotos").remove([foto.caminho]);
  atualizarTelas();
  return { ok: "Foto apagada." };
}

// A capa é a primeira foto: aparece no catálogo e abre a galeria
export async function tornarCapa(aparelhoId: string, fotoId: string): Promise<Resultado> {
  const { sb } = await exigirEquipe();
  const { data: fotos } = await sb.from("fotos").select("id").eq("aparelho_id", aparelhoId).order("ordem");
  if (!fotos?.some((f) => f.id === fotoId)) return { erro: "Foto não encontrada." };

  const nova = [fotoId, ...fotos.map((f) => f.id).filter((f) => f !== fotoId)];
  for (const [ordem, id] of nova.entries()) {
    const { error } = await sb.from("fotos").update({ ordem }).eq("id", id);
    if (error) {
      console.error("reordenar fotos falhou", error);
      return { erro: "Não deu para mudar a capa. Tente de novo." };
    }
  }
  atualizarTelas();
  return { ok: "Capa alterada." };
}

/* ---------- Acessos (só o dono) ---------- */

export async function criarAcesso(_: Resultado, form: FormData): Promise<Resultado> {
  await exigirDono();
  const nome = texto(form, "nome");
  const email = texto(form, "email").toLowerCase();
  const senha = String(form.get("senha") ?? "");
  const papel = texto(form, "papel") as Papel;

  if (!nome) return { erro: "Informe o nome da pessoa." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { erro: "Informe um e-mail válido." };
  if (senha.length < 8) return { erro: "A senha precisa ter pelo menos 8 caracteres." };
  if (papel !== "dono" && papel !== "funcionario") return { erro: "Escolha o tipo de acesso." };

  const adm = clienteServico();
  const { data: ja } = await adm.from("acessos").select("usuario_id").eq("email", email).maybeSingle();
  if (ja) return { erro: "Esse e-mail já tem acesso ao painel." };

  const { data: conta, error } = await adm.auth.admin.createUser({ email, password: senha, email_confirm: true });
  if (error || !conta.user) {
    if (error?.code === "email_exists") return { erro: "Esse e-mail já tem uma conta. Use outro e-mail." };
    console.error("criar conta falhou", error);
    return { erro: "Não deu para criar o acesso. Tente de novo." };
  }

  const { error: erroAcesso } = await adm.from("acessos").insert({ usuario_id: conta.user.id, nome, email, papel });
  if (erroAcesso) {
    console.error("gravar acesso falhou", erroAcesso);
    await adm.auth.admin.deleteUser(conta.user.id);
    return { erro: "Não deu para criar o acesso. Tente de novo." };
  }

  revalidatePath("/painel/acessos");
  return { ok: `${nome} já pode entrar com ${email} e a senha que você definiu.` };
}

export async function alterarAcesso(
  usuarioId: string,
  mudanca: { ativo?: boolean; papel?: Papel },
): Promise<Resultado> {
  const { usuarioId: eu } = await exigirDono();
  if (usuarioId === eu) return { erro: "Você não pode mudar o seu próprio acesso." };

  const { error } = await clienteServico().from("acessos").update(mudanca).eq("usuario_id", usuarioId);
  if (error) {
    console.error("alterar acesso falhou", error);
    return { erro: "Não deu para salvar. Tente de novo." };
  }
  revalidatePath("/painel/acessos");
  return { ok: "Acesso atualizado." };
}

/* ---------- Minha conta ---------- */

export async function trocarSenha(_: Resultado, form: FormData): Promise<Resultado> {
  const { sb, email } = await exigirEquipe();
  const atual = String(form.get("atual") ?? "");
  const nova = String(form.get("nova") ?? "");
  const repetida = String(form.get("repetida") ?? "");

  if (nova.length < 8) return { erro: "A nova senha precisa ter pelo menos 8 caracteres." };
  if (nova !== repetida) return { erro: "As duas senhas novas não são iguais." };

  // Confere a senha atual antes de trocar
  const { error: erroAtual } = await sb.auth.signInWithPassword({ email, password: atual });
  if (erroAtual) return { erro: "A senha atual está errada." };

  const { error } = await sb.auth.updateUser({ password: nova });
  if (error) {
    if (error.code === "same_password") return { erro: "A nova senha precisa ser diferente da atual." };
    console.error("trocar senha falhou", error);
    return { erro: "Não deu para trocar a senha. Tente de novo." };
  }
  return { ok: "Senha trocada." };
}
