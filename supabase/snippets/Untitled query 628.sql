select
  trigger_name,
  event_object_schema,
  event_object_table,
  action_statement
from information_schema.triggers
where event_object_schema = 'auth'
  and event_object_table = 'users';