select id, name, code
from public.permissions
where code like 'programs.%'
order by code;