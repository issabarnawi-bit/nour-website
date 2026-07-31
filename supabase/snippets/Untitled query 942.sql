select
  conname
from pg_constraint
where conrelid = 'public.countries'::regclass
  and contype = 'f';