-- =========================================================
-- NourApp Platform
-- Restore RBAC helper before countries policies
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
    join public.admin_profile_roles apr
      on apr.admin_profile_id = ap.id
    join public.roles r
      on r.id = apr.role_id
    where ap.id = $1
      and ap.status = 'active'
      and ap.deleted_at is null
      and r.key = $2
  );
$$;

revoke all
on function public.has_role(uuid, text)
from public;

grant execute
on function public.has_role(uuid, text)
to authenticated;

notify pgrst, 'reload schema';