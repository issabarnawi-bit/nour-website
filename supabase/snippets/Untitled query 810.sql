select
  column_name,
  data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'admin_profile_roles'
order by ordinal_position;