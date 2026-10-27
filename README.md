# Órbita Celulares

Site e sistema de estoque de uma loja fictícia de iPhone. Projeto de portfólio.

**Site:** vitrine, catálogo com filtro, página de cada aparelho (fotos reais ou desenho em 3D),
simulador de parcelas, avaliação do usado na troca e comparador de aparelhos.

**Painel (`/painel`):** estoque com busca, venda, entrada e ajuste (sempre pelo histórico),
cadastro com fotos, relatórios do mês (faturamento, lucro, formas de pagamento, mais vendidos,
aparelhos parados) e acessos da equipe (dono e funcionário).

Feito com Next.js 16, Tailwind 4 e Supabase (Postgres, Auth e Storage).

## Rodar localmente

Precisa do Node e do Docker Desktop ligado.

```bash
npm install
npx supabase start     # sobe o banco local, cria as tabelas e os dados de exemplo
npx supabase status    # mostra as chaves
cp .env.example .env.local   # e preencha com as chaves do status
npm run dev -- -p 3100
```

O banco local usa as portas 553xx para não brigar com outros projetos Supabase.
Painel do banco (Studio): http://127.0.0.1:55323

### Contas de teste do painel

Ficam em `supabase/seed.sql` (só existem no banco local): uma de dono e uma de funcionário.

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run db:reset` | Apaga o banco local e recria com os dados de exemplo |
| `npm run db:tipos` | Gera `src/lib/supabase/banco.types.ts` a partir do banco |
| `npm test` | Testes das contas dos relatórios |
| `npm run lint` | Confere o código |

## Como o estoque funciona

- A quantidade só muda pela função `registrar_movimentacao` do banco: ela trava o aparelho,
  confere se tem estoque e grava o histórico na mesma transação. Um gatilho barra qualquer
  outra tentativa de mudar a quantidade direto.
- Venda pede forma de pagamento e guarda o preço cobrado (pode ter desconto). Entrada guarda o custo.
  Ajuste pede o motivo.
- Arquivar tira o aparelho do site e do estoque sem apagar o histórico.
- As fotos são reduzidas no navegador (até 1600 px, WebP) e enviadas direto ao Storage.
- Sem as variáveis do Supabase, o site usa os aparelhos de exemplo de `src/lib/exemplo.ts`
  e o painel fica fechado. É assim que a versão publicada roda antes de ter banco na nuvem.
