select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_functiondef(p.oid) as function_definition
from pg_proc p
join pg_namespace n
  on n.oid = p.pronamespace
where p.prokind = 'f'
  and n.nspname not in (
    'pg_catalog',
    'information_schema'
  )
  and pg_get_functiondef(p.oid)
    ilike '%admin_profiles%';