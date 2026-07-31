-- =========================================================
-- NourApp Platform
-- Fix: Countries grants and Super Admin permission bypass
-- =========================================================

grant select, insert, update, delete
on table public.countries
to authenticated;

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
  select
    public.has_role(user_id, 'super_admin')
    or exists (
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

revoke all
on function public.has_permission(uuid, text)
from public;