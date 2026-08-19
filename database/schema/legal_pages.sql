-- =========================================================
-- Nour Platform
-- Legal Content Schema
-- =========================================================

-- ---------------------------------------------------------
-- Legal Pages
-- Stores the current editable version of each legal page.
-- ---------------------------------------------------------

create table if not exists public.legal_pages (
  id uuid primary key default gen_random_uuid(),

  key text not null unique,

  title_ar text not null,
  title_en text not null,

  content_ar text not null default '',
  content_en text not null default '',

  version text not null default '1.0',

  status text not null default 'draft'
    check (status in ('draft', 'published', 'inactive')),

  published_at timestamptz,

  is_active boolean not null default true,
  sort_order integer not null default 0
    check (sort_order >= 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  deleted_at timestamptz
);

-- ---------------------------------------------------------
-- Legal Page Versions
-- Immutable snapshots of previous/published versions.
-- ---------------------------------------------------------

create table if not exists public.legal_page_versions (
  id uuid primary key default gen_random_uuid(),

  legal_page_id uuid not null
    references public.legal_pages(id)
    on delete cascade,

  version text not null,

  title_ar text not null,
  title_en text not null,

  content_ar text not null,
  content_en text not null,

  published_at timestamptz not null default now(),

  published_by uuid
    references auth.users(id)
    on delete set null,

  created_at timestamptz not null default now(),

  constraint legal_page_versions_page_version_unique
    unique (legal_page_id, version)
);

-- ---------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------

create index if not exists idx_legal_pages_key
  on public.legal_pages(key);

create index if not exists idx_legal_pages_status
  on public.legal_pages(status);

create index if not exists idx_legal_pages_active
  on public.legal_pages(is_active)
  where deleted_at is null;

create index if not exists idx_legal_pages_sort_order
  on public.legal_pages(sort_order);

create index if not exists idx_legal_page_versions_page_id
  on public.legal_page_versions(legal_page_id);

create index if not exists idx_legal_page_versions_published_at
  on public.legal_page_versions(published_at desc);

  -- ---------------------------------------------------------
-- Updated At Trigger
-- ---------------------------------------------------------

drop trigger if exists legal_pages_set_updated_at
on public.legal_pages;

create trigger legal_pages_set_updated_at
before update on public.legal_pages
for each row
execute function public.set_updated_at();