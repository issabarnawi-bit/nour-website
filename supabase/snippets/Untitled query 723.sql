select
  r.code as role_code,
  p.code as permission_code
from public.role_permissions rp
join public.roles r
  on r.id = rp.role_id
join public.permissions p
  on p.id = rp.permission_id
where r.code = 'super_admin'
order by p.code;