insert into public.role_permissions (
  role_id,
  permission_id
)
select
  r.id,
  p.id
from public.roles r
cross join public.permissions p
where r.code = 'super_admin'
  and p.code like 'media.%'
on conflict (role_id, permission_id)
do nothing;