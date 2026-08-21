-- Nour Platform
-- RBAC Production State Reconciliation
-- Purpose: record the already-verified Production RBAC helper state in migration history.
-- This migration intentionally does not change roles, assignments, permissions, or RLS policies.

create or replace function public.has_role(
  user_id uuid,
  role_code text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    join public.admin_user_roles aur
      on aur.user_id = ap.id
     and aur.deleted_at is null
    join public.roles r
      on r.id = aur.role_id
     and r.is_active = true
     and r.deleted_at is null
    where ap.id = $1
      and ap.status = 'active'
      and ap.deleted_at is null
      and r.key = $2
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
set search_path = ''
as $$
  select
    public.has_role($1, 'super_admin')
    or exists (
      select 1
      from public.admin_profiles ap
      join public.admin_user_roles aur
        on aur.user_id = ap.id
       and aur.deleted_at is null
      join public.roles r
        on r.id = aur.role_id
       and r.is_active = true
       and r.deleted_at is null
      join public.role_permissions rp
        on rp.role_id = r.id
      join public.permissions p
        on p.id = rp.permission_id
       and p.is_active = true
       and p.deleted_at is null
      where ap.id = $1
        and ap.status = 'active'
        and ap.deleted_at is null
        and p.key = $2
    );
$$;

create or replace function public.current_user_has_permission(
  permission_code text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    public.has_permission(auth.uid(), $1),
    false
  );
$$;

create or replace function public.is_super_admin(
  user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = ''
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
      and r.is_active = true
      and r.deleted_at is null
      and ap.status = 'active'
      and ap.deleted_at is null
  );
$$;

-- Match the verified Production execution privileges explicitly.
revoke all on function public.has_role(uuid, text) from public;
revoke all on function public.has_permission(uuid, text) from public;
revoke all on function public.current_user_has_permission(text) from public;
revoke all on function public.is_super_admin(uuid) from public;

grant execute on function public.has_role(uuid, text)
to service_role;

grant execute on function public.has_permission(uuid, text)
to authenticated, service_role;

grant execute on function public.current_user_has_permission(text)
to authenticated, service_role;

grant execute on function public.is_super_admin(uuid)
to authenticated, service_role;
