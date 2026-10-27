-- Estoque da loja: aparelhos, fotos, movimentações (vendas, entradas, ajustes) e acessos ao painel.

create type estado_aparelho as enum ('novo', 'seminovo');
create type papel_acesso as enum ('dono', 'funcionario');
create type tipo_movimentacao as enum ('entrada', 'venda', 'ajuste');
create type forma_pagamento as enum ('pix', 'cartao', 'dinheiro', 'troca');

-- Quem pode entrar no painel. O dono dá e tira acesso dos funcionários.
create table acessos (
  usuario_id uuid primary key references auth.users on delete cascade,
  nome text not null check (length(trim(nome)) > 0),
  email text not null,
  papel papel_acesso not null default 'funcionario',
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create table aparelhos (
  id uuid primary key default gen_random_uuid(),
  -- Endereço da página do aparelho no site (/iphones/<slug>)
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  modelo text not null check (length(trim(modelo)) > 0),
  armazenamento integer not null check (armazenamento > 0),
  cor text not null check (length(trim(cor)) > 0),
  cor_hex text not null default '#d9d9d6' check (cor_hex ~ '^#[0-9a-fA-F]{6}$'),
  estado estado_aparelho not null,
  bateria integer check (bateria between 1 and 100),
  preco numeric(10, 2) not null check (preco > 0),
  -- Quanto a loja pagou: usado só nos relatórios, nunca aparece no site
  custo numeric(10, 2) check (custo >= 0),
  quantidade integer not null default 0 check (quantidade >= 0),
  destaque boolean not null default false,
  -- Arquivado some do site e do estoque, mas o histórico continua
  ativo boolean not null default true,
  observacao text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table fotos (
  id uuid primary key default gen_random_uuid(),
  aparelho_id uuid not null references aparelhos on delete cascade,
  caminho text not null unique,
  ordem integer not null default 0,
  criado_em timestamptz not null default now()
);
create index fotos_aparelho on fotos (aparelho_id, ordem);

create table movimentacoes (
  id uuid primary key default gen_random_uuid(),
  aparelho_id uuid references aparelhos on delete set null,
  -- Nome do aparelho no momento: o histórico não muda se o cadastro for editado
  descricao text not null,
  tipo tipo_movimentacao not null,
  -- Variação no estoque: venda é negativa, entrada é positiva, ajuste pode ser os dois
  quantidade integer not null check (quantidade <> 0),
  -- Venda: preço cobrado por unidade. Entrada: custo por unidade.
  preco_unitario numeric(10, 2) check (preco_unitario >= 0),
  forma_pagamento forma_pagamento,
  cliente text,
  observacao text,
  usuario_id uuid references auth.users on delete set null,
  usuario_nome text not null,
  criado_em timestamptz not null default now(),
  constraint sinal_por_tipo check (
    (tipo = 'venda' and quantidade < 0)
    or (tipo = 'entrada' and quantidade > 0)
    or tipo = 'ajuste'
  )
);
create index movimentacoes_data on movimentacoes (criado_em desc);
create index movimentacoes_aparelho on movimentacoes (aparelho_id, criado_em desc);

-- Quem está logado faz parte da equipe (acesso ativo)?
create function eh_equipe() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.acessos where usuario_id = auth.uid() and ativo);
$$;

create function eh_dono() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.acessos where usuario_id = auth.uid() and ativo and papel = 'dono');
$$;

create function tocar_atualizado_em() returns trigger
language plpgsql set search_path = ''
as $$
begin
  new.atualizado_em := now();
  return new;
end;
$$;
create trigger aparelhos_atualizado before update on aparelhos
  for each row execute function tocar_atualizado_em();

-- Única forma de mexer na quantidade: trava o aparelho, confere o estoque e grava o histórico
-- na mesma transação. Assim duas vendas ao mesmo tempo nunca deixam o estoque negativo.
create function registrar_movimentacao(
  p_aparelho uuid,
  p_tipo tipo_movimentacao,
  p_quantidade integer,
  p_preco_unitario numeric default null,
  p_forma_pagamento forma_pagamento default null,
  p_cliente text default null,
  p_observacao text default null
) returns integer
language plpgsql security definer set search_path = ''
as $$
declare
  v_aparelho public.aparelhos%rowtype;
  v_nome text;
  v_variacao integer;
begin
  select nome into v_nome from public.acessos where usuario_id = auth.uid() and ativo;
  if v_nome is null then
    raise exception 'sem acesso ao painel' using errcode = '42501';
  end if;

  if p_quantidade is null or p_quantidade = 0 then
    raise exception 'quantidade inválida' using errcode = '22023';
  end if;
  if p_tipo in ('venda', 'entrada') and p_quantidade < 0 then
    raise exception 'quantidade inválida' using errcode = '22023';
  end if;
  if p_tipo = 'venda' and p_forma_pagamento is null then
    raise exception 'forma de pagamento obrigatória na venda' using errcode = '22023';
  end if;

  select * into v_aparelho from public.aparelhos where id = p_aparelho for update;
  if not found then
    raise exception 'aparelho não encontrado' using errcode = 'P0002';
  end if;

  v_variacao := case p_tipo when 'venda' then -p_quantidade else p_quantidade end;
  if v_aparelho.quantidade + v_variacao < 0 then
    raise exception 'estoque insuficiente' using errcode = '23514';
  end if;

  update public.aparelhos set quantidade = quantidade + v_variacao where id = p_aparelho;

  insert into public.movimentacoes (
    aparelho_id, descricao, tipo, quantidade, preco_unitario, forma_pagamento,
    cliente, observacao, usuario_id, usuario_nome
  ) values (
    p_aparelho,
    v_aparelho.modelo || ' ' ||
      case when v_aparelho.armazenamento >= 1024
        then (v_aparelho.armazenamento / 1024)::text || ' TB'
        else v_aparelho.armazenamento::text || ' GB' end
      || ' ' || v_aparelho.cor,
    p_tipo,
    v_variacao,
    case when p_tipo = 'venda' then coalesce(p_preco_unitario, v_aparelho.preco) else p_preco_unitario end,
    case when p_tipo = 'venda' then p_forma_pagamento end,
    nullif(trim(p_cliente), ''),
    nullif(trim(p_observacao), ''),
    auth.uid(),
    v_nome
  );

  return v_aparelho.quantidade + v_variacao;
end;
$$;

revoke execute on function registrar_movimentacao from public, anon;
grant execute on function registrar_movimentacao to authenticated;

-- Regras de acesso (RLS)
alter table acessos enable row level security;
alter table aparelhos enable row level security;
alter table fotos enable row level security;
alter table movimentacoes enable row level security;

-- Visitantes veem só aparelhos ativos; a equipe vê todos (inclusive arquivados)
create policy "site vê aparelhos ativos" on aparelhos
  for select to anon, authenticated using (ativo or eh_equipe());
create policy "equipe cadastra aparelhos" on aparelhos
  for insert to authenticated with check (eh_equipe() and quantidade = 0);
-- A quantidade só muda pela função registrar_movimentacao (trigger abaixo barra o resto)
create policy "equipe edita aparelhos" on aparelhos
  for update to authenticated using (eh_equipe()) with check (eh_equipe());

create function barrar_quantidade_direta() returns trigger
language plpgsql set search_path = ''
as $$
begin
  -- A função de movimentação roda como dona da tabela (postgres); qualquer outro usuário
  -- que tente mudar a quantidade direto recebe erro.
  if new.quantidade is distinct from old.quantidade and current_user <> 'postgres' then
    raise exception 'use registrar_movimentacao para mudar o estoque' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger aparelhos_quantidade before update on aparelhos
  for each row execute function barrar_quantidade_direta();

create policy "todos veem fotos" on fotos for select to anon, authenticated using (true);
create policy "equipe adiciona fotos" on fotos for insert to authenticated with check (eh_equipe());
create policy "equipe reordena fotos" on fotos for update to authenticated using (eh_equipe());
create policy "equipe apaga fotos" on fotos for delete to authenticated using (eh_equipe());

create policy "equipe vê histórico" on movimentacoes for select to authenticated using (eh_equipe());

-- Cada um vê o próprio acesso; o dono vê todos. Criar e mudar acessos é feito pelo
-- servidor com a chave de serviço, depois de conferir que quem pediu é o dono.
create policy "ver acessos" on acessos for select to authenticated
  using (usuario_id = auth.uid() or eh_dono());

-- Fotos no storage: qualquer um lê (bucket público), só a equipe envia e apaga
create policy "equipe envia fotos" on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos' and public.eh_equipe());
create policy "equipe apaga fotos do storage" on storage.objects for delete to authenticated
  using (bucket_id = 'fotos' and public.eh_equipe());
