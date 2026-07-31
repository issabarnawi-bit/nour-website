insert into public.admin_profiles (
  id,
  full_name,
  email,
  status
)
select
  id,
  'Issa Barnawi',
  email,
  'active'
from auth.users
where email = 'issa.barnawi@nourappglobal.com'
on conflict (id) do update
set
  full_name = excluded.full_name,
  email = excluded.email,
  status = 'active';