insert into public.role_permissions (
  id,
  role_id,
  permission_id
)
select
  gen_random_uuid(),
  r.id,
  p.id
from public.roles r
cross join public.permissions p
where r.code = 'super_admin'
  and not exists (
    select 1
    from public.role_permissions rp
    where rp.role_id = r.id
      and rp.permission_id = p.id
  );