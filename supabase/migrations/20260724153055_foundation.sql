-- =========================================================
-- NourApp Platform
-- Migration 001: Foundation
-- =========================================================

create extension if not exists pgcrypto;

-- =========================================================
-- ENUMS
-- =========================================================

create type public.admin_profile_status as enum (
  'invited',
  'active',
  'suspended'
);

create type public.publication_status as enum (
  'draft',
  'published',
  'archived'
);

-- =========================================================
-- ADMIN PROFILES
-- =========================================================

create table public.admin_profiles (
  id uuid primary key
    references auth.users(id)
    on delete cascade,

  full_name text not null,
  email text not null,

  status public.admin_profile_status not null
    default 'invited',

  last_login_at timestamptz null,

  created_at timestamptz not null
    default timezone('utc', now()),

  updated_at timestamptz not null
    default timezone('utc', now()),

  deleted_at timestamptz null
);

create unique index uq_admin_profiles_email
  on public.admin_profiles (lower(email))
  where deleted_at is null;

  -- =========================================================
-- ROLES
-- =========================================================

create table public.roles (
  id uuid primary key
    default gen_random_uuid(),

  name text not null,
  code text not null,

  description text null,

  is_active boolean not null
    default true,

  sort_order integer not null
    default 0,

  created_at timestamptz not null
    default timezone('utc', now()),

  updated_at timestamptz not null
    default timezone('utc', now()),

  deleted_at timestamptz null,

  constraint chk_roles_sort_order
    check (sort_order >= 0)
);

create unique index uq_roles_code
  on public.roles (lower(code))
  where deleted_at is null;

-- =========================================================
-- PERMISSIONS
-- =========================================================

create table public.permissions (
  id uuid primary key
    default gen_random_uuid(),

  name text not null,
  code text not null,

  description text null,

  module_key text not null,

  is_active boolean not null
    default true,

  sort_order integer not null
    default 0,

  created_at timestamptz not null
    default timezone('utc', now()),

  updated_at timestamptz not null
    default timezone('utc', now()),

  deleted_at timestamptz null,

  constraint chk_permissions_sort_order
    check (sort_order >= 0)
);

create unique index uq_permissions_code
  on public.permissions (lower(code))
  where deleted_at is null;

create index idx_permissions_module_key
  on public.permissions (module_key);

  -- =========================================================
-- ADMIN PROFILE ROLES
-- =========================================================

create table public.admin_profile_roles (
  id uuid primary key
    default gen_random_uuid(),

  admin_profile_id uuid not null
    references public.admin_profiles(id)
    on delete cascade,

  role_id uuid not null
    references public.roles(id)
    on delete cascade,

  created_at timestamptz not null
    default timezone('utc', now()),

  constraint uq_admin_profile_roles
    unique (admin_profile_id, role_id)
);

create index idx_admin_profile_roles_admin_profile_id
  on public.admin_profile_roles (admin_profile_id);

create index idx_admin_profile_roles_role_id
  on public.admin_profile_roles (role_id);

-- =========================================================
-- ROLE PERMISSIONS
-- =========================================================

create table public.role_permissions (
  id uuid primary key
    default gen_random_uuid(),

  role_id uuid not null
    references public.roles(id)
    on delete cascade,

  permission_id uuid not null
    references public.permissions(id)
    on delete cascade,

  created_at timestamptz not null
    default timezone('utc', now()),

  constraint uq_role_permissions
    unique (role_id, permission_id)
);

create index idx_role_permissions_role_id
  on public.role_permissions (role_id);

create index idx_role_permissions_permission_id
  on public.role_permissions (permission_id);

  -- =========================================================
-- MEDIA
-- =========================================================

create table public.media (
  id uuid primary key
    default gen_random_uuid(),

  bucket text not null,
  path text not null,

  file_name text not null,
  mime_type text not null,

  size_bytes bigint not null,

  width integer null,
  height integer null,

  alt_ar text null,
  alt_en text null,

  uploaded_by uuid null
    references public.admin_profiles(id)
    on delete set null,

  created_at timestamptz not null
    default timezone('utc', now()),

  updated_at timestamptz not null
    default timezone('utc', now()),

  deleted_at timestamptz null
);

create index idx_media_uploaded_by
  on public.media (uploaded_by);

create index idx_media_bucket
  on public.media (bucket);

  -- =========================================================
-- SITE SETTINGS
-- =========================================================

create table public.site_settings (
  id uuid primary key
    default gen_random_uuid(),

  key text not null,
  value_json jsonb not null
    default '{}'::jsonb,

  group_key text not null,

  is_public boolean not null
    default false,

  updated_by uuid null
    references public.admin_profiles(id)
    on delete set null,

  created_at timestamptz not null
    default timezone('utc', now()),

  updated_at timestamptz not null
    default timezone('utc', now()),

  constraint uq_site_settings_key
    unique (key)
);

create index idx_site_settings_group_key
  on public.site_settings (group_key);

  -- =========================================================
-- FEATURE FLAGS
-- =========================================================

create table public.feature_flags (
  id uuid primary key
    default gen_random_uuid(),

  key text not null,
  name text not null,
  description text null,

  is_enabled boolean not null
    default false,

  config_json jsonb not null
    default '{}'::jsonb,

  sort_order integer not null
    default 0,

  updated_by uuid null
    references public.admin_profiles(id)
    on delete set null,

  created_at timestamptz not null
    default timezone('utc', now()),

  updated_at timestamptz not null
    default timezone('utc', now()),

  constraint uq_feature_flags_key
    unique (key),

  constraint chk_feature_flags_sort_order
    check (sort_order >= 0)
);

create index idx_feature_flags_is_enabled
  on public.feature_flags (is_enabled);

  -- =========================================================
-- AUDIT LOGS
-- =========================================================

create table public.audit_logs (
  id uuid primary key
    default gen_random_uuid(),

  actor_id uuid null
    references public.admin_profiles(id)
    on delete set null,

  action text not null,

  entity_type text not null,
  entity_id uuid null,

  old_data jsonb null,
  new_data jsonb null,

  ip_address inet null,
  user_agent text null,

  created_at timestamptz not null
    default timezone('utc', now())
);

create index idx_audit_logs_actor_id
  on public.audit_logs (actor_id);

create index idx_audit_logs_entity
  on public.audit_logs (entity_type, entity_id);

create index idx_audit_logs_created_at
  on public.audit_logs (created_at desc);

  -- =========================================================
-- UPDATED_AT FUNCTION
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- =========================================================
-- UPDATED_AT TRIGGERS
-- =========================================================

create trigger set_admin_profiles_updated_at
before update on public.admin_profiles
for each row
execute function public.set_updated_at();

create trigger set_roles_updated_at
before update on public.roles
for each row
execute function public.set_updated_at();

create trigger set_permissions_updated_at
before update on public.permissions
for each row
execute function public.set_updated_at();

create trigger set_media_updated_at
before update on public.media
for each row
execute function public.set_updated_at();

create trigger set_site_settings_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();

create trigger set_feature_flags_updated_at
before update on public.feature_flags
for each row
execute function public.set_updated_at();

-- =========================================================
-- ENABLE ROW LEVEL SECURITY
-- =========================================================

alter table public.admin_profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.admin_profile_roles enable row level security;
alter table public.role_permissions enable row level security;
alter table public.media enable row level security;
alter table public.site_settings enable row level security;
alter table public.feature_flags enable row level security;
alter table public.audit_logs enable row level security;

-- =========================================================
-- NourApp Platform
-- RBAC Permission Functions
-- =========================================================

create or replace function public.has_role(
  user_id uuid,
  role_code text
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    inner join public.admin_profile_roles apr
      on apr.admin_profile_id = ap.id
    inner join public.roles r
      on r.id = apr.role_id
    where ap.id = user_id
      and ap.status = 'active'
      and ap.deleted_at is null
      and r.code = role_code
      and r.is_active = true
      and r.deleted_at is null
  );
$$;

create or replace function public.has_permission(
  user_id uuid,
  permission_code text
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    inner join public.admin_profile_roles apr
      on apr.admin_profile_id = ap.id
    inner join public.roles r
      on r.id = apr.role_id
    inner join public.role_permissions rp
      on rp.role_id = r.id
    inner join public.permissions p
      on p.id = rp.permission_id
    where ap.id = user_id
      and ap.status = 'active'
      and ap.deleted_at is null
      and r.is_active = true
      and r.deleted_at is null
      and p.code = permission_code
      and p.is_active = true
      and p.deleted_at is null
  );
$$;

create or replace function public.is_super_admin(
  user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(user_id, 'super_admin');
$$;

-- =========================================================
-- CURRENT USER RBAC HELPERS
-- =========================================================

create or replace function public.current_user_has_role(
  role_code text
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(auth.uid(), role_code);
$$;

create or replace function public.current_user_has_permission(
  permission_code text
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_permission(auth.uid(), permission_code);
$$;

create or replace function public.current_user_is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_super_admin(auth.uid());
$$;

revoke all on function public.has_role(uuid, text) from public;
revoke all on function public.has_permission(uuid, text) from public;
revoke all on function public.is_super_admin(uuid) from public;
revoke all on function public.current_user_has_role(text) from public;
revoke all on function public.current_user_has_permission(text) from public;
revoke all on function public.current_user_is_super_admin() from public;

grant execute on function public.current_user_has_role(text) to authenticated;
grant execute on function public.current_user_has_permission(text) to authenticated;
grant execute on function public.current_user_is_super_admin() to authenticated;

