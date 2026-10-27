-- Visitantes do site não podem ler o custo nem a observação interna dos aparelhos.
-- O RLS escolhe quais linhas aparecem; aqui limitamos quais colunas o visitante (anon) lê.
revoke select on aparelhos from anon;
grant select (
  id, slug, modelo, armazenamento, cor, cor_hex, estado, bateria, preco,
  quantidade, destaque, ativo, criado_em, atualizado_em
) on aparelhos to anon;
