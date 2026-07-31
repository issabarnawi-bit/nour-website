-- 1. دالة آمنة للتحقق من دور Super Admin
create or replace function public.is_super_admin(
  target_user_id uuid default auth.uid()
)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_user_roles aur
    join public.roles r
      on r.id = aur.role_id
    where aur.user_id = target_user_id
      and aur.deleted_at is null
      and r.code = 'super_admin'
      and r.is_active = true
      and r.deleted_at is null
  );
$$;

grant execute
on function public.is_super_admin(uuid)
to authenticated;

-- 2. تفعيل RLS على admin_profiles
alter table public.admin_profiles
enable row level security;

-- 3. المستخدم يستطيع قراءة ملفه الشخصي
drop policy if exists admin_profiles_select_own
on public.admin_profiles;

create policy admin_profiles_select_own
on public.admin_profiles
for select
to authenticated
using (
  id = auth.uid()
);

-- 4. Super Admin يستطيع قراءة جميع المستخدمين
drop policy if exists admin_profiles_super_admin_select
on public.admin_profiles;

create policy admin_profiles_super_admin_select
on public.admin_profiles
for select
to authenticated
using (
  public.is_super_admin(auth.uid())
);

-- 5. السماح لـ Super Admin بقراءة جميع تعيينات الأدوار
drop policy if exists admin_user_roles_super_admin_select
on public.admin_user_roles;

create policy admin_user_roles_super_admin_select
on public.admin_user_roles
for select
to authenticated
using (
  public.is_super_admin(auth.uid())
);