insert into public.roles (
  id,
  code,
  name,
  description,
  is_active
)
select
  gen_random_uuid(),
  'super_admin',
  'Super Admin',
  'Full system access',
  true
where not exists (
  select 1
  from public.roles
  where code = 'super_admin'
);