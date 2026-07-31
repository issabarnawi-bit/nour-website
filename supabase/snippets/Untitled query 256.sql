select
  id,
  code,
  name
from public.permissions
where code like 'media.%'
order by code;