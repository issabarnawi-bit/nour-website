insert into public.roles (
  id,
  code,
  name,
  description,
  is_active
)
values (
  gen_random_uuid(),
  'super_admin',
  'Super Admin',
  'Full system access',
  true
)
on conflict (code) do update
set
  name = excluded.name,
  description = excluded.description,
  is_active = true,
  deleted_at = null;