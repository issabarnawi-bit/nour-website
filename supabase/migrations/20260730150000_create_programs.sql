-- =========================================================
-- Nour Platform
-- Programs module
-- =========================================================

create extension if not exists pgcrypto;

-- =========================================================
-- 1. Program status enum
-- =========================================================

do $$
begin
  create type public.program_status as enum (
    'draft',
    'published',
    'inactive'
  );
exception
  when duplicate_object then
    null;
end;
$$;

-- =========================================================
-- 2. Programs table
-- =========================================================

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),

  title_ar text not null,
  title_en text not null,

  slug text not null unique,

  summary_ar text not null,
  summary_en text not null,

  description_ar text not null,
  description_en text not null,

  country_id uuid
    references public.countries(id)
    on update cascade
    on delete restrict,

  duration_days integer not null default 1
    check (duration_days >= 1),

  duration_nights integer not null default 0
    check (duration_nights >= 0),

  base_price numeric(12, 2) not null default 0
    check (base_price >= 0),

  currency_code varchar(3) not null default 'SAR'
    check (
      currency_code =
      upper(currency_code)
      and length(currency_code) = 3
    ),

  cover_media_id uuid
    references public.media(id)
    on update cascade
    on delete set null,

  status public.program_status
    not null
    default 'draft',

  is_featured boolean not null default false,
  is_active boolean not null default true,

  sort_order integer not null default 0
    check (sort_order >= 0),

  created_by uuid
    references auth.users(id)
    on delete set null,

  updated_by uuid
    references auth.users(id)
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on table public.programs is
  'Stores bilingual Umrah programs managed from the administration dashboard.';

-- =========================================================
-- 3. Indexes
-- =========================================================

create index if not exists
  programs_country_id_idx
on public.programs(country_id);

create index if not exists
  programs_cover_media_id_idx
on public.programs(cover_media_id);

create index if not exists
  programs_status_idx
on public.programs(status);

create index if not exists
  programs_active_idx
on public.programs(is_active)
where deleted_at is null;

create index if not exists
  programs_featured_idx
on public.programs(is_featured)
where deleted_at is null
  and is_active = true;

create index if not exists
  programs_sort_order_idx
on public.programs(sort_order);

create index if not exists
  programs_deleted_at_idx
on public.programs(deleted_at);

-- =========================================================
-- 4. Updated-at trigger
-- =========================================================

drop trigger if exists
  programs_set_updated_at
on public.programs;

create trigger programs_set_updated_at
before update
on public.programs
for each row
execute function public.set_updated_at();

-- =========================================================
-- 5. RLS and grants
-- =========================================================

alter table public.programs
enable row level security;

grant select, insert, update, delete
on table public.programs
to authenticated;

grant select, insert, update, delete
on table public.programs
to service_role;

-- =========================================================
-- 6. RLS policies
-- =========================================================

drop policy if exists programs_select
on public.programs;

drop policy if exists programs_insert
on public.programs;

drop policy if exists programs_update
on public.programs;

drop policy if exists programs_delete
on public.programs;

create policy programs_select
on public.programs
for select
to authenticated
using (
  deleted_at is null
  and public.current_user_has_permission(
    'programs.read'
  )
);

create policy programs_insert
on public.programs
for insert
to authenticated
with check (
  public.current_user_has_permission(
    'programs.create'
  )
);

create policy programs_update
on public.programs
for update
to authenticated
using (
  deleted_at is null
  and (
    public.current_user_has_permission(
      'programs.update'
    )
    or public.current_user_has_permission(
      'programs.publish'
    )
  )
)
with check (
  public.current_user_has_permission(
    'programs.update'
  )
  or public.current_user_has_permission(
    'programs.publish'
  )
);

create policy programs_delete
on public.programs
for delete
to authenticated
using (
  public.current_user_has_permission(
    'programs.delete'
  )
);

notify pgrst, 'reload schema';