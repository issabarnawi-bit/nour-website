-- =========================================================
-- NourApp Platform
-- Migration 002: Countries
-- =========================================================

create table public.countries (
    id uuid primary key
        default gen_random_uuid(),

    name_ar text not null,
    name_en text not null,

    iso2 text not null,
    iso3 text not null,

    phone_code text not null,

    currency_code text not null,
    currency_name_ar text not null,
    currency_name_en text not null,

    timezone text not null,

    flag_media_id uuid null
        references public.media(id)
        on delete set null,

    is_active boolean not null
        default true,

    sort_order integer not null
        default 0,

    created_at timestamptz not null
        default timezone('utc', now()),

    updated_at timestamptz not null
        default timezone('utc', now()),

    deleted_at timestamptz null,

    constraint chk_countries_sort_order
        check (sort_order >= 0)
);

create unique index uq_countries_iso2
    on public.countries (lower(iso2))
    where deleted_at is null;

create unique index uq_countries_iso3
    on public.countries (lower(iso3))
    where deleted_at is null;

create index idx_countries_is_active
    on public.countries (is_active);

create index idx_countries_sort_order
    on public.countries (sort_order);

create index idx_countries_name_ar
    on public.countries (name_ar);

create index idx_countries_name_en
    on public.countries (name_en);

-- =========================================================
-- UPDATED_AT TRIGGER
-- =========================================================

create trigger set_countries_updated_at
before update on public.countries
for each row
execute function public.set_updated_at();

-- =========================================================
-- ENABLE ROW LEVEL SECURITY
-- =========================================================

alter table public.countries enable row level security;

-- =========================================================
-- RLS POLICIES
-- =========================================================

create policy countries_select
on public.countries
for select
to authenticated
using (
    public.current_user_has_permission('countries.read')
);

create policy countries_insert
on public.countries
for insert
to authenticated
with check (
    public.current_user_has_permission('countries.create')
);

create policy countries_update
on public.countries
for update
to authenticated
using (
    public.current_user_has_permission('countries.update')
)
with check (
    public.current_user_has_permission('countries.update')
);

create policy countries_delete
on public.countries
for delete
to authenticated
using (
    public.current_user_has_permission('countries.delete')
);