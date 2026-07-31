-- =========================================================
-- NourApp Platform
-- Seed: Role permissions
-- Grants all current permissions to Super Admin
-- =========================================================

insert into public.role_permissions (
  id,
  role_id,
  permission_id
)
select
  gen_random_uuid(),
  role_record.id,
  permission_record.id
from public.roles role_record
cross join public.permissions permission_record
where role_record.key = 'super_admin'
on conflict (role_id, permission_id)
do nothing;
