select
  ap.email,
  r.code as role_code
from public.admin_profile_roles apr
join public.admin_profiles ap
  on ap.id = apr.admin_profile_id
join public.roles r
  on r.id = apr.role_id
where ap.email = 'issa.barnawi@nourappglobal.com';