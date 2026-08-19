-- =========================================================
-- NourApp Platform
-- Migration: Legal Content Management
-- Date: 2026-08-19
--
-- Includes:
--   - Legal pages
--   - Legal page versions
--   - Permissions
--   - Publication functions
--   - RLS policies
--   - Initial legal pages
-- =========================================================


-- =========================================================
-- 1. LEGAL PAGES
-- =========================================================

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


-- =========================================================
-- 2. LEGAL PAGE VERSIONS
-- =========================================================

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


-- =========================================================
-- 3. INDEXES
-- =========================================================

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


-- =========================================================
-- 4. UPDATED_AT TRIGGER
-- =========================================================

drop trigger if exists legal_pages_set_updated_at
on public.legal_pages;

create trigger legal_pages_set_updated_at
before update on public.legal_pages
for each row
execute function public.set_updated_at();


-- =========================================================
-- 5. LEGAL PERMISSIONS
-- =========================================================

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
  'legal.view',
  'legal',
  'view',
  'عرض المحتوى القانوني',
  'View Legal Content',
  'السماح بعرض السياسات والشروط والمحتوى القانوني في لوحة الإدارة',
  'Allows viewing legal policies, terms and legal content in the admin dashboard',
  true,
  1
),

(
  'legal.edit',
  'legal',
  'edit',
  'تعديل المحتوى القانوني',
  'Edit Legal Content',
  'السماح بتعديل مسودات السياسات والشروط والمحتوى القانوني',
  'Allows editing drafts of legal policies, terms and legal content',
  true,
  2
),

(
  'legal.publish',
  'legal',
  'publish',
  'نشر المحتوى القانوني',
  'Publish Legal Content',
  'السماح بنشر نسخ جديدة من السياسات والشروط والمحتوى القانوني',
  'Allows publishing new versions of legal policies, terms and legal content',
  true,
  3
)

on conflict (key)
do update set
  module = excluded.module,
  action = excluded.action,
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();


-- =========================================================
-- 6. PUBLISH LEGAL PAGE
-- =========================================================

create or replace function public.publish_legal_page(
  p_legal_page_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_page public.legal_pages%rowtype;
  v_version_id uuid;
  v_published_at timestamptz;
begin

  -- Authentication
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Authentication required';
  end if;


  -- Permission
  if not public.has_permission(v_user_id, 'legal.publish') then
    raise exception 'Permission denied: legal.publish required';
  end if;


  -- Lock and load working copy
  select *
  into v_page
  from public.legal_pages
  where id = p_legal_page_id
    and deleted_at is null
    and is_active = true
  for update;

  if not found then
    raise exception 'Legal page not found or inactive';
  end if;


  -- Validation
  if nullif(trim(v_page.key), '') is null then
    raise exception 'Legal page key is required';
  end if;

  if nullif(trim(v_page.title_ar), '') is null then
    raise exception 'Arabic title is required';
  end if;

  if nullif(trim(v_page.title_en), '') is null then
    raise exception 'English title is required';
  end if;

  if nullif(trim(v_page.content_ar), '') is null then
    raise exception 'Arabic content is required';
  end if;

  if nullif(trim(v_page.content_en), '') is null then
    raise exception 'English content is required';
  end if;

  if nullif(trim(v_page.version), '') is null then
    raise exception 'Version is required';
  end if;


  -- Prevent duplicate version
  if exists (
    select 1
    from public.legal_page_versions
    where legal_page_id = v_page.id
      and version = v_page.version
  ) then
    raise exception
      'Version % has already been published',
      v_page.version;
  end if;


  v_published_at := now();


  -- Immutable published snapshot
  insert into public.legal_page_versions (
    legal_page_id,
    version,
    title_ar,
    title_en,
    content_ar,
    content_en,
    published_at,
    published_by
  )
  values (
    v_page.id,
    v_page.version,
    v_page.title_ar,
    v_page.title_en,
    v_page.content_ar,
    v_page.content_en,
    v_published_at,
    v_user_id
  )
  returning id
  into v_version_id;


  -- Publication metadata on working copy
  update public.legal_pages
  set
    status = 'published',
    published_at = v_published_at
  where id = v_page.id;


  return v_version_id;

end;
$$;


revoke all
on function public.publish_legal_page(uuid)
from public;

grant execute
on function public.publish_legal_page(uuid)
to authenticated;


-- =========================================================
-- 7. GET CURRENT PUBLISHED LEGAL PAGE
-- =========================================================

create or replace function public.get_published_legal_page(
  p_key text
)
returns table (
  legal_page_id uuid,
  page_key text,
  title_ar text,
  title_en text,
  content_ar text,
  content_en text,
  version text,
  published_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    lp.id as legal_page_id,
    lp.key as page_key,
    lpv.title_ar,
    lpv.title_en,
    lpv.content_ar,
    lpv.content_en,
    lpv.version,
    lpv.published_at
  from public.legal_pages lp
  join public.legal_page_versions lpv
    on lpv.legal_page_id = lp.id
  where lp.key = p_key
    and lp.is_active = true
    and lp.deleted_at is null
  order by lpv.published_at desc
  limit 1;
$$;


revoke all
on function public.get_published_legal_page(text)
from public;

grant execute
on function public.get_published_legal_page(text)
to anon, authenticated;


-- =========================================================
-- 8. ENABLE RLS
-- =========================================================

alter table public.legal_pages
  enable row level security;

alter table public.legal_page_versions
  enable row level security;


-- =========================================================
-- 9. LEGAL PAGES RLS POLICIES
-- =========================================================

drop policy if exists
  "Admins with legal.view can read legal pages"
on public.legal_pages;

create policy "Admins with legal.view can read legal pages"
on public.legal_pages
for select
to authenticated
using (
  public.has_permission(auth.uid(), 'legal.view')
);


drop policy if exists
  "Admins with legal.edit can create legal pages"
on public.legal_pages;

create policy "Admins with legal.edit can create legal pages"
on public.legal_pages
for insert
to authenticated
with check (
  public.has_permission(auth.uid(), 'legal.edit')
);


drop policy if exists
  "Admins with legal.edit can update legal pages"
on public.legal_pages;

create policy "Admins with legal.edit can update legal pages"
on public.legal_pages
for update
to authenticated
using (
  public.has_permission(auth.uid(), 'legal.edit')
)
with check (
  public.has_permission(auth.uid(), 'legal.edit')
);


-- No DELETE policy.
-- Legal pages use soft deletion.


-- =========================================================
-- 10. LEGAL PAGE VERSIONS RLS
-- =========================================================

drop policy if exists
  "Admins with legal.view can read legal page versions"
on public.legal_page_versions;

create policy "Admins with legal.view can read legal page versions"
on public.legal_page_versions
for select
to authenticated
using (
  public.has_permission(auth.uid(), 'legal.view')
);


-- Intentionally:
-- No INSERT policy
-- No UPDATE policy
-- No DELETE policy
--
-- Published snapshots can only be created using:
-- public.publish_legal_page()


-- =========================================================
-- 11. INITIAL LEGAL PAGES
-- =========================================================

insert into public.legal_pages (
  key,
  title_ar,
  title_en,
  content_ar,
  content_en,
  version,
  status,
  is_active,
  sort_order
)
values

(
  'privacy-policy',
  'سياسة الخصوصية',
  'Privacy Policy',
  '',
  '',
  '1.0',
  'draft',
  true,
  1
),

(
  'terms-and-conditions',
  'الشروط والأحكام',
  'Terms and Conditions',
  '',
  '',
  '1.0',
  'draft',
  true,
  2
)

on conflict (key)
do update set
  title_ar = excluded.title_ar,
  title_en = excluded.title_en,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();

  grant select, insert, update
on table public.legal_pages
to authenticated;

grant select
on table public.legal_page_versions
to authenticated;

grant execute
on function public.has_permission(uuid, text)
to authenticated;