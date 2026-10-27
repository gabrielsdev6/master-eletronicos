-- Dados de exemplo para rodar localmente (npx supabase db reset).
--
-- Contas de teste do painel (só existem no banco local):
--   dono:        dono@orbita.test         senha: orbita-dono-123
--   funcionário: funcionario@orbita.test  senha: orbita-func-123

-- Contas de login
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '0b1e0000-0000-4000-a000-000000000001', 'authenticated', 'authenticated',
   'dono@orbita.test', extensions.crypt('orbita-dono-123', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '0b1e0000-0000-4000-a000-000000000002', 'authenticated', 'authenticated',
   'funcionario@orbita.test', extensions.crypt('orbita-func-123', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');

insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
select gen_random_uuid(), id, id::text, jsonb_build_object('sub', id::text, 'email', email), 'email', now(), now(), now()
from auth.users where email in ('dono@orbita.test', 'funcionario@orbita.test');

insert into acessos (usuario_id, nome, email, papel) values
  ('0b1e0000-0000-4000-a000-000000000001', 'Gabriel', 'dono@orbita.test', 'dono'),
  ('0b1e0000-0000-4000-a000-000000000002', 'Ana', 'funcionario@orbita.test', 'funcionario');

-- Aparelhos (quantidade final; o histórico abaixo bate com ela)
insert into aparelhos (slug, modelo, armazenamento, cor, cor_hex, estado, bateria, preco, custo, quantidade, destaque, criado_em) values
  ('17-pro-max-256-laranja', 'iPhone 17 Pro Max', 256, 'Laranja-cósmico', '#e46a2a', 'novo', null, 11499, 9800, 2, true, now() - interval '62 days'),
  ('17-pro-256-azul', 'iPhone 17 Pro', 256, 'Azul-intenso', '#2c3a55', 'novo', null, 9999, 8500, 3, true, now() - interval '62 days'),
  ('17-256-lavanda', 'iPhone 17', 256, 'Lavanda', '#c9bfe0', 'novo', null, 7299, 6200, 4, false, now() - interval '60 days'),
  ('16-pro-128-deserto', 'iPhone 16 Pro', 128, 'Titânio-deserto', '#c8b39c', 'seminovo', 94, 6299, 5100, 1, false, now() - interval '58 days'),
  ('16-128-preto', 'iPhone 16', 128, 'Preto', '#2b2b2d', 'novo', null, 5499, 4600, 5, true, now() - interval '60 days'),
  ('16-128-verde', 'iPhone 16', 128, 'Verde-acinzentado', '#a9c2b4', 'novo', null, 5499, 4600, 2, false, now() - interval '55 days'),
  ('15-pro-max-256-natural', 'iPhone 15 Pro Max', 256, 'Titânio natural', '#a8a297', 'seminovo', 89, 5799, 4700, 1, false, now() - interval '50 days'),
  ('15-128-azul', 'iPhone 15', 128, 'Azul', '#d3e1e8', 'seminovo', 91, 3899, 3000, 3, true, now() - interval '50 days'),
  ('14-128-roxo', 'iPhone 14', 128, 'Roxo', '#c7bcd6', 'seminovo', 87, 3199, 2400, 2, false, now() - interval '48 days'),
  ('13-128-meia-noite', 'iPhone 13', 128, 'Meia-noite', '#262a33', 'seminovo', 85, 2499, 1800, 4, false, now() - interval '61 days'),
  ('13-256-estelar', 'iPhone 13', 256, 'Estelar', '#ece6dc', 'seminovo', 88, 2799, 2100, 0, false, now() - interval '45 days'),
  ('12-64-branco', 'iPhone 12', 64, 'Branco', '#f1f1ef', 'seminovo', 84, 1799, 1250, 2, false, now() - interval '62 days'),
  ('11-64-vermelho', 'iPhone 11', 64, 'Vermelho', '#b1222f', 'seminovo', 82, 1399, 900, 1, false, now() - interval '62 days');

-- Histórico dos últimos dois meses: uma entrada inicial por aparelho e vendas espalhadas.
-- O iPhone 12 e o 11 ficam sem vendas recentes, para aparecerem como "parados" no relatório.
do $$
declare
  a record;
  vendas integer;
  i integer;
  formas forma_pagamento[] := array['pix', 'cartao', 'pix', 'dinheiro', 'cartao', 'troca']::forma_pagamento[];
  equipe text[] := array['Gabriel', 'Ana'];
  descricao text;
begin
  for a in select * from aparelhos order by preco desc loop
    vendas := case a.slug
      when '16-128-preto' then 6
      when '15-128-azul' then 4
      when '13-128-meia-noite' then 5
      when '13-256-estelar' then 2
      when '17-pro-256-azul' then 3
      when '12-64-branco' then 0
      when '11-64-vermelho' then 0
      else 1 + (length(a.slug) % 3)
    end;
    descricao := a.modelo || ' ' || a.armazenamento || ' GB ' || a.cor;

    insert into movimentacoes (aparelho_id, descricao, tipo, quantidade, preco_unitario, usuario_id, usuario_nome, criado_em)
    values (a.id, descricao, 'entrada', a.quantidade + vendas, a.custo, '0b1e0000-0000-4000-a000-000000000001', 'Gabriel', a.criado_em);

    for i in 1..vendas loop
      insert into movimentacoes (
        aparelho_id, descricao, tipo, quantidade, preco_unitario, forma_pagamento, usuario_id, usuario_nome, criado_em
      ) values (
        a.id, descricao, 'venda', -1,
        -- de vez em quando sai com um desconto
        case when i % 3 = 0 then a.preco - 100 else a.preco end,
        formas[1 + ((i + length(a.slug)) % array_length(formas, 1))],
        case when i % 2 = 1 then '0b1e0000-0000-4000-a000-000000000002'::uuid else '0b1e0000-0000-4000-a000-000000000001'::uuid end,
        equipe[1 + (i % 2)],
        -- sempre depois da entrada (o aparelho mais novo chegou há 45 dias)
        now() - make_interval(days => (i * 9 + length(a.slug)) % 44, hours => 10 + i)
      );
    end loop;
  end loop;
end;
$$;
