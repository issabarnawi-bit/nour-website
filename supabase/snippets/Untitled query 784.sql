insert into public.user_roles (
  user_id,
  role_id
)
select
  u.id,
  r.id
from auth.users u
join public.roles r
  on r.code = 'super_admin'
where u.email = 'issa.barnawi@nourappglobal.com'
on conflict (user_id, role_id)
do nothing;