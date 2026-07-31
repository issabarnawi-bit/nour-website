insert into public.roles (
  name,
  code,
  description,
  is_active,
  sort_order
)
values (
  'Super Admin',
  'super_admin',
  'Full access to all administrative functions.',
  true,
  10
)
on conflict (lower(code)) where deleted_at is null
do update set
  name = excluded.name,
  description = excluded.description,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into public.admin_profile_roles (
  admin_profile_id,
  role_id
)
select
  '5f775fb4-caea-4418-ad3b-c3e9571e54bb',
  r.id
from public.roles r
where lower(r.code) = 'super_admin'
  and r.deleted_at is null
on conflict (admin_profile_id, role_id)
do nothing;