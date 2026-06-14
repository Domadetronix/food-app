-- Этап 1: начальная схема «Семейные рецепты».
--
-- Модель доступа: к БД ходит ТОЛЬКО сервер с ключом service_role, который ОБХОДИТ RLS.
-- RLS включаем на всех таблицах и НЕ добавляем политик → прямой доступ с anon-ключа
-- запрещён по умолчанию (защита на случай утечки anon-ключа).

-- ── Семьи ───────────────────────────────────────────────────────────────────
create table public.families (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  code_hash  text not null,                 -- хеш кода доступа (сырой код не хранится)
  created_at timestamptz not null default now()
);

-- ── Рецепты ─────────────────────────────────────────────────────────────────
create table public.recipes (
  id                uuid primary key default gen_random_uuid(),
  family_id         uuid not null references public.families (id) on delete cascade,
  name              text not null,           -- единственное обязательное поле блюда
  description       text,                     -- рецепт и заметки
  photo_path        text,                     -- путь в приватном бакете storage
  cook_time_minutes integer,
  meal_types        text[] not null default '{}',  -- breakfast | lunch | dinner
  tags              text[] not null default '{}',  -- свободные теги, включая «мясное»
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index recipes_family_id_idx on public.recipes (family_id);
create index recipes_tags_idx on public.recipes using gin (tags);
create index recipes_meal_types_idx on public.recipes using gin (meal_types);

-- ── Продукты блюда ────────────────────────────────────────────────────────────
create table public.ingredients (
  id         uuid primary key default gen_random_uuid(),
  recipe_id  uuid not null references public.recipes (id) on delete cascade,
  name       text not null,                  -- «сыр»
  amount     text,                           -- «200 гр», «по вкусу»
  sort_order integer not null default 0
);

create index ingredients_recipe_id_idx on public.ingredients (recipe_id);

-- ── План питания (календарь) ──────────────────────────────────────────────────
create table public.meal_plan (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references public.families (id) on delete cascade,
  date       date not null,
  recipe_id  uuid not null references public.recipes (id) on delete cascade,
  meal_slot  text,                           -- опц.: breakfast | lunch | dinner
  created_at timestamptz not null default now()
);

create index meal_plan_family_date_idx on public.meal_plan (family_id, date);

-- ── Автообновление updated_at у рецептов ──────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger recipes_set_updated_at
  before update on public.recipes
  for each row execute function public.set_updated_at();

-- ── Приватный бакет для фото блюд ─────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('recipe-photos', 'recipe-photos', false)
on conflict (id) do nothing;

-- ── RLS: включаем везде без политик → доступ только через service_role (сервер) ─
alter table public.families    enable row level security;
alter table public.recipes     enable row level security;
alter table public.ingredients enable row level security;
alter table public.meal_plan   enable row level security;
