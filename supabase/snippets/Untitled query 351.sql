-- التأكد من وجود الملف الإداري وتفعيله
insert into public.admin_profiles (
  id,
  full_name,
  email,
  status
)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', 'ISSA'),
  u.email,
  'active'::public.admin_profile_status
from auth.users u
where lower(u.email) = lower('issabarnawi@nourappglobal.com')
on conflict (id)
do update set
  email = excluded.email,
  status = 'active'::public.admin_profile_status,
  deleted_at = null,
  updated_at = timezone('utc', now());

-- التأكد من وجود دور Super Admin
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
  is_active = true,
  deleted_at = null,
  updated_at = timezone('utc', now());

-- ربط المستخدم بدور Super Admin
insert into public.admin_profile_roles (
  admin_profile_id,
  role_id
)
select
  u.id,
  r.id
from auth.users u
cross join public.roles r
where lower(u.email) = lower('issabarnawi@nourappglobal.com')
  and lower(r.code) = 'super_admin'
  and r.deleted_at is null
on conflict (admin_profile_id, role_id)
do nothing;

-- السماح للمستخدمين الموثقين باستدعاء دالة التحقق
grant execute
on function public.current_user_has_permission(text)
to authenticated;

grant execute
on function public.has_permission(uuid, text)
to authenticated;