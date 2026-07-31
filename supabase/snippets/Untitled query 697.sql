insert into public.admin_profile_roles (
  id,
  admin_profile_id,
  role_id
)
select
  gen_random_uuid(),
  ap.id,
  r.id
from public.admin_profiles ap
cross join public.roles r
where ap.email = 'issa.barnawi@nourappglobal.com'
  and r.code = 'super_admin'
on conflict (admin_profile_id, role_id)
do nothing;