-- =========================================================
-- Nour Platform
-- Create admin_user_roles junction table
-- Base structure only
-- Security policies and functions are defined in a later migration.
-- =========================================================

create extension if not exists pgcrypto;

create table if not exists public.admin_user_roles (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.admin_profiles(id)
    on update cascade
    on delete cascade,

  role_id uuid not null
    references public.roles(id)
    on update cascade
    on delete restrict,

  assigned_by uuid
    references auth.users(id)
    on update cascade
    on delete set null,

  created_at timestamptz not null
    default now(),

  updated_at timestamptz not null
    default now(),

  deleted_at timestamptz,

  constraint admin_user_roles_user_role_unique
    unique (user_id, role_id)
);

create index if not exists
  admin_user_roles_user_id_idx
on public.admin_user_roles(user_id);

create index if not exists
  admin_user_roles_role_id_idx
on public.admin_user_roles(role_id);

create index if not exists
  admin_user_roles_assigned_by_idx
on public.admin_user_roles(assigned_by);

create index if not exists
  admin_user_roles_active_idx
on public.admin_user_roles(user_id, role_id)
where deleted_at is null;

comment on table public.admin_user_roles is
  'Assigns administrative roles to admin users.';