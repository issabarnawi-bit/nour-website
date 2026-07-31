select
  id,
  code,
  name,
  is_active
from public.roles
where code = 'super_admin';