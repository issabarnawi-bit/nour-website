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
  and not exists (
    select 1
    from public.admin_profile_roles apr
    where apr.admin_profile_id = ap.id
      and apr.role_id = r.id
  );