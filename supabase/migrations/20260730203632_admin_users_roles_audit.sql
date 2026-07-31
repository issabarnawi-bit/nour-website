-- =========================================================
-- NourApp
-- Admin users, roles, permissions and audit log
-- =========================================================

create extension if not exists pgcrypto;

-- =========================================================
-- 1. Admin user roles
-- =========================================================

create table if not exists public.admin_user_roles (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.admin_profiles(id)
    on delete cascade,

  role_id uuid not null
    references public.roles(id)
    on delete restrict,

  assigned_by uuid
    references auth.users(id)
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
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
  admin_user_roles_active_idx
on public.admin_user_roles(user_id, role_id)
where deleted_at is null;

-- =========================================================
-- 2. Audit log
-- =========================================================

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),

  actor_user_id uuid
    references auth.users(id)
    on delete set null,

  action text not null
    check (length(trim(action)) > 0),

  entity_type text not null
    check (length(trim(entity_type)) > 0),

  entity_id uuid,

  old_values jsonb not null
    default '{}'::jsonb,

  new_values jsonb not null
    default '{}'::jsonb,

  metadata jsonb not null
    default '{}'::jsonb,

  created_at timestamptz not null
    default now()
);

create index if not exists
  admin_audit_logs_actor_idx
on public.admin_audit_logs(actor_user_id);

create index if not exists
  admin_audit_logs_entity_idx
on public.admin_audit_logs(
  entity_type,
  entity_id
);

create index if not exists
  admin_audit_logs_action_idx
on public.admin_audit_logs(action);

create index if not exists
  admin_audit_logs_created_at_idx
on public.admin_audit_logs(created_at desc);

-- =========================================================
-- 3. Updated at trigger helper
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists
  admin_user_roles_set_updated_at
on public.admin_user_roles;

create trigger admin_user_roles_set_updated_at
before update
on public.admin_user_roles
for each row
execute function public.set_updated_at();

-- =========================================================
-- 4. Super Admin checker
-- =========================================================

create or replace function public.is_super_admin(
  user_id uuid default auth.uid()
)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_user_roles aur
    join public.roles r
      on r.id = aur.role_id
    join public.admin_profiles ap
      on ap.id = aur.user_id
    where aur.user_id = $1
      and aur.deleted_at is null
      and r.key = 'super_admin'
      and ap.status = 'active'
  );
$$;

revoke all
on function public.is_super_admin(uuid)
from public;

grant execute
on function public.is_super_admin(uuid)
to authenticated;

-- =========================================================
-- 5. Update user status and role
-- =========================================================

create or replace function public.update_admin_user_access(
  target_user_id uuid,
  new_status text,
  new_role_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  old_status text;
  old_role_id uuid;
  old_role_key text;
  new_role_key text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_super_admin(auth.uid()) then
    raise exception 'Only Super Admin can manage users';
  end if;

  if target_user_id = auth.uid() then
    raise exception 'You cannot modify your own role or status';
  end if;

  if new_status not in (
    'active',
    'suspended',
    'invited'
  ) then
    raise exception 'Invalid user status';
  end if;

  select ap.status::text
  into old_status
  from public.admin_profiles ap
  where ap.id = target_user_id;

  if old_status is null then
    raise exception 'Admin user not found';
  end if;

  select
    aur.role_id,
    r.key
  into
    old_role_id,
    old_role_key
  from public.admin_user_roles aur
  join public.roles r
    on r.id = aur.role_id
  where aur.user_id = target_user_id
    and aur.deleted_at is null
  order by aur.created_at desc
  limit 1;

  select r.key
  into new_role_key
  from public.roles r
  where r.id = new_role_id;

  if new_role_key is null then
    raise exception 'Role not found';
  end if;

  update public.admin_profiles
  set
    status =
      new_status::public.admin_profile_status,
    updated_at = now()
  where id = target_user_id;

  update public.admin_user_roles
  set
    deleted_at = now(),
    updated_at = now()
  where user_id = target_user_id
    and deleted_at is null;

  insert into public.admin_user_roles (
    user_id,
    role_id,
    assigned_by,
    created_at,
    updated_at,
    deleted_at
  )
  values (
    target_user_id,
    new_role_id,
    auth.uid(),
    now(),
    now(),
    null
  )
  on conflict (user_id, role_id)
  do update set
    deleted_at = null,
    assigned_by = auth.uid(),
    updated_at = now();

  insert into public.admin_audit_logs (
    actor_user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values,
    metadata
  )
  values (
    auth.uid(),
    'admin_user_access_updated',
    'admin_user',
    target_user_id,

    jsonb_build_object(
      'status', old_status,
      'role_id', old_role_id,
      'role_key', old_role_key
    ),

    jsonb_build_object(
      'status', new_status,
      'role_id', new_role_id,
      'role_key', new_role_key
    ),

    jsonb_build_object(
      'source', 'admin_dashboard'
    )
  );
end;
$$;

revoke all
on function public.update_admin_user_access(
  uuid,
  text,
  uuid
)
from public;

grant execute
on function public.update_admin_user_access(
  uuid,
  text,
  uuid
)
to authenticated;

-- =========================================================
-- 6. Base table privileges
-- =========================================================

grant usage on schema public
to authenticated, service_role;

grant select
on table public.roles
to authenticated, service_role;

grant select
on table public.admin_profiles
to authenticated;

grant select, insert, update, delete
on table public.admin_profiles
to service_role;

grant select
on table public.admin_user_roles
to authenticated;

grant select, insert, update, delete
on table public.admin_user_roles
to service_role;

grant select
on table public.admin_audit_logs
to authenticated;

grant select, insert
on table public.admin_audit_logs
to service_role;

-- Supabase Auth needs these privileges so ON DELETE CASCADE
-- can remove related admin records when an Auth user is deleted.

grant usage on schema public
to supabase_auth_admin;

grant select, delete
on table public.admin_profiles
to supabase_auth_admin;

grant select, delete
on table public.admin_user_roles
to supabase_auth_admin;

-- =========================================================
-- 7. Enable RLS
-- =========================================================

alter table public.admin_profiles
enable row level security;

alter table public.admin_user_roles
enable row level security;

alter table public.admin_audit_logs
enable row level security;

alter table public.roles
enable row level security;

-- =========================================================
-- 8. Roles policies
-- =========================================================

drop policy if exists
  roles_authenticated_select
on public.roles;

create policy roles_authenticated_select
on public.roles
for select
to authenticated
using (true);

-- =========================================================
-- 9. Admin profiles policies
-- =========================================================

drop policy if exists
  admin_profiles_select_own
on public.admin_profiles;

create policy admin_profiles_select_own
on public.admin_profiles
for select
to authenticated
using (
  id = auth.uid()
);

drop policy if exists
  admin_profiles_super_admin_select
on public.admin_profiles;

create policy admin_profiles_super_admin_select
on public.admin_profiles
for select
to authenticated
using (
  public.is_super_admin(auth.uid())
);

-- =========================================================
-- 10. Admin user roles policies
-- =========================================================

drop policy if exists
  admin_user_roles_select_own
on public.admin_user_roles;

create policy admin_user_roles_select_own
on public.admin_user_roles
for select
to authenticated
using (
  user_id = auth.uid()
  and deleted_at is null
);

drop policy if exists
  admin_user_roles_super_admin_select
on public.admin_user_roles;

create policy admin_user_roles_super_admin_select
on public.admin_user_roles
for select
to authenticated
using (
  public.is_super_admin(auth.uid())
);

-- =========================================================
-- 11. Audit log policies
-- =========================================================

drop policy if exists
  admin_audit_logs_super_admin_select
on public.admin_audit_logs;

create policy admin_audit_logs_super_admin_select
on public.admin_audit_logs
for select
to authenticated
using (
  public.is_super_admin(auth.uid())
);

-- =========================================================
-- 12. Refresh PostgREST schema
-- =========================================================

notify pgrst, 'reload schema';