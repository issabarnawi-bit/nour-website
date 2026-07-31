-- =========================================================
-- NourApp Platform
-- Seed: Super Admin Role Permissions
-- =========================================================

insert into public.role_permissions (
  role_id,
  permission_id
)
select
  role_record.id,
  permission_record.id
from public.roles as role_record
cross join public.permissions as permission_record
where role_record.code = 'super_admin'
  and role_record.deleted_at is null
  and role_record.is_active = true
  and permission_record.deleted_at is null
  and permission_record.is_active = true
on conflict (role_id, permission_id)
do nothing;