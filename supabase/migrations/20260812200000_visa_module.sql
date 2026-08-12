-- =========================================================
-- Nour Platform
-- Migration: Visa Module Foundation
-- Date: 2026-08-12
-- =========================================================

begin;

-- ---------------------------------------------------------
-- 1) Enums
-- ---------------------------------------------------------

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'visa_type'
  ) then
    create type public.visa_type as enum (
      'umrah',
      'tourist',
      'visit',
      'transit',
      'other'
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'visa_processing_type'
  ) then
    create type public.visa_processing_type as enum (
      'standard',
      'express',
      'manual'
    );
  end if;
end
$$;

-- ---------------------------------------------------------
-- 2) Reusable visa services
-- ---------------------------------------------------------

create table if not exists public.visas (
  id uuid primary key default gen_random_uuid(),

  name_ar text not null,
  name_en text not null,

  visa_type public.visa_type not null default 'umrah',
  processing_type public.visa_processing_type not null default 'standard',

  country_id uuid
    references public.countries(id)
    on delete set null,

  description_ar text,
  description_en text,

  requirements_ar text[],
  requirements_en text[],

  processing_time_days integer
    check (
      processing_time_days is null
      or processing_time_days >= 0
    ),

  validity_days integer
    check (
      validity_days is null
      or validity_days >= 0
    ),

  max_stay_days integer
    check (
      max_stay_days is null
      or max_stay_days >= 0
    ),

  base_price numeric(12, 2)
    check (
      base_price is null
      or base_price >= 0
    ),

  currency_code text
    check (
      currency_code is null
      or (
        char_length(currency_code) = 3
        and currency_code = upper(currency_code)
      )
    ),

  cover_media_id uuid
    references public.media(id)
    on delete set null,

  is_active boolean not null default true,
  sort_order integer not null default 0
    check (sort_order >= 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_visas_active
  on public.visas (is_active)
  where deleted_at is null;

create index if not exists idx_visas_country
  on public.visas (country_id)
  where deleted_at is null;

create index if not exists idx_visas_type
  on public.visas (visa_type)
  where deleted_at is null;

create index if not exists idx_visas_sort
  on public.visas (sort_order, created_at desc)
  where deleted_at is null;

-- ---------------------------------------------------------
-- 3) Visa media gallery
-- ---------------------------------------------------------

create table if not exists public.visa_media (
  id uuid primary key default gen_random_uuid(),

  visa_id uuid not null
    references public.visas(id)
    on delete cascade,

  media_id uuid not null
    references public.media(id)
    on delete cascade,

  is_cover boolean not null default false,
  sort_order integer not null default 0
    check (sort_order >= 0),

  created_at timestamptz not null default now(),

  unique (visa_id, media_id)
);

create index if not exists idx_visa_media_visa
  on public.visa_media (visa_id, sort_order);

-- ---------------------------------------------------------
-- 4) Link visa services to programs
-- ---------------------------------------------------------

create table if not exists public.program_visas (
  id uuid primary key default gen_random_uuid(),

  program_id uuid not null
    references public.programs(id)
    on delete cascade,

  visa_id uuid not null
    references public.visas(id)
    on delete restrict,

  is_included boolean not null default true,

  notes_ar text,
  notes_en text,

  sort_order integer not null default 0
    check (sort_order >= 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (program_id, visa_id)
);

create index if not exists idx_program_visas_program
  on public.program_visas (program_id, sort_order);

create index if not exists idx_program_visas_visa
  on public.program_visas (visa_id);

-- ---------------------------------------------------------
-- 5) updated_at triggers
-- ---------------------------------------------------------

do $$
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n
      on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'set_updated_at'
  ) then
    execute '
      drop trigger if exists set_visas_updated_at
      on public.visas
    ';

    execute '
      create trigger set_visas_updated_at
      before update on public.visas
      for each row
      execute function public.set_updated_at()
    ';

    execute '
      drop trigger if exists set_program_visas_updated_at
      on public.program_visas
    ';

    execute '
      create trigger set_program_visas_updated_at
      before update on public.program_visas
      for each row
      execute function public.set_updated_at()
    ';
  elsif exists (
    select 1
    from pg_proc p
    join pg_namespace n
      on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'update_updated_at_column'
  ) then
    execute '
      drop trigger if exists set_visas_updated_at
      on public.visas
    ';

    execute '
      create trigger set_visas_updated_at
      before update on public.visas
      for each row
      execute function public.update_updated_at_column()
    ';

    execute '
      drop trigger if exists set_program_visas_updated_at
      on public.program_visas
    ';

    execute '
      create trigger set_program_visas_updated_at
      before update on public.program_visas
      for each row
      execute function public.update_updated_at_column()
    ';
  end if;
end
$$;

-- ---------------------------------------------------------
-- 6) Permissions
-- ---------------------------------------------------------

insert into public.permissions (
  key,
  module,
  action,
  name_ar,
  name_en,
  description_ar,
  description_en,
  is_active,
  sort_order
)
values
  (
    'visas.read',
    'visas',
    'read',
    'عرض التأشيرات',
    'View visas',
    'عرض خدمات التأشيرات وربطها بالبرامج.',
    'View visa services and program assignments.',
    true,
    0
  ),
  (
    'visas.manage',
    'visas',
    'manage',
    'إدارة التأشيرات',
    'Manage visas',
    'إنشاء وتعديل وحذف واستعادة خدمات التأشيرات وربطها بالبرامج.',
    'Create, update, delete, restore, and assign visa services.',
    true,
    10
  )
on conflict (key) do update
set
  module = excluded.module,
  action = excluded.action,
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();

-- ---------------------------------------------------------
-- 7) RLS
-- ---------------------------------------------------------

alter table public.visas enable row level security;
alter table public.visa_media enable row level security;
alter table public.program_visas enable row level security;

drop policy if exists "Public can read active visas"
  on public.visas;

create policy "Public can read active visas"
on public.visas
for select
using (
  deleted_at is null
  and is_active = true
);

drop policy if exists "Admins can read visas"
  on public.visas;

create policy "Admins can read visas"
on public.visas
for select
to authenticated
using (
  public.current_user_has_permission('visas.read')
  or public.current_user_has_permission('visas.manage')
);

drop policy if exists "Admins can insert visas"
  on public.visas;

create policy "Admins can insert visas"
on public.visas
for insert
to authenticated
with check (
  public.current_user_has_permission('visas.manage')
);

drop policy if exists "Admins can update visas"
  on public.visas;

create policy "Admins can update visas"
on public.visas
for update
to authenticated
using (
  public.current_user_has_permission('visas.manage')
)
with check (
  public.current_user_has_permission('visas.manage')
);

drop policy if exists "Admins can delete visas"
  on public.visas;

create policy "Admins can delete visas"
on public.visas
for delete
to authenticated
using (
  public.current_user_has_permission('visas.manage')
);

drop policy if exists "Public can read active visa media"
  on public.visa_media;

create policy "Public can read active visa media"
on public.visa_media
for select
using (
  exists (
    select 1
    from public.visas v
    where v.id = visa_media.visa_id
      and v.deleted_at is null
      and v.is_active = true
  )
);

drop policy if exists "Admins can manage visa media"
  on public.visa_media;

create policy "Admins can manage visa media"
on public.visa_media
for all
to authenticated
using (
  public.current_user_has_permission('visas.manage')
)
with check (
  public.current_user_has_permission('visas.manage')
);

drop policy if exists "Public can read published program visas"
  on public.program_visas;

create policy "Public can read published program visas"
on public.program_visas
for select
using (
  exists (
    select 1
    from public.programs p
    where p.id = program_visas.program_id
      and p.deleted_at is null
      and p.is_active = true
      and p.status = 'published'
  )
);

drop policy if exists "Admins can read program visas"
  on public.program_visas;

create policy "Admins can read program visas"
on public.program_visas
for select
to authenticated
using (
  public.current_user_has_permission('visas.read')
  or public.current_user_has_permission('visas.manage')
);

drop policy if exists "Admins can insert program visas"
  on public.program_visas;

create policy "Admins can insert program visas"
on public.program_visas
for insert
to authenticated
with check (
  public.current_user_has_permission('visas.manage')
);

drop policy if exists "Admins can update program visas"
  on public.program_visas;

create policy "Admins can update program visas"
on public.program_visas
for update
to authenticated
using (
  public.current_user_has_permission('visas.manage')
)
with check (
  public.current_user_has_permission('visas.manage')
);

drop policy if exists "Admins can delete program visas"
  on public.program_visas;

create policy "Admins can delete program visas"
on public.program_visas
for delete
to authenticated
using (
  public.current_user_has_permission('visas.manage')
);

commit;