-- =========================================================
-- Nour Platform
-- Permanent media, countries, storage and RBAC repair
-- Corrected for current schema:
-- roles.key
-- permissions.key
-- permissions bilingual columns
-- =========================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------
-- 1. Ensure the media storage bucket always exists
-- ---------------------------------------------------------

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'media',
  'media',
  true,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml'
  ]
)
on conflict (id)
do update set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------
-- 2. Ensure required permissions exist
-- ---------------------------------------------------------

insert into public.permissions (
  key,
  module,
  action,
  name_ar,
  name_en,
  description_ar,
  description_en
)
values
  ('media.read','media','read','عرض الوسائط','Media Read','عرض سجلات الوسائط.','View media records.'),
  ('media.upload','media','upload','رفع الوسائط','Media Upload','رفع وإنشاء ملفات الوسائط.','Upload and create media records.'),
  ('media.update','media','update','تعديل الوسائط','Media Update','تعديل سجلات الوسائط.','Update media records.'),
  ('media.delete','media','delete','حذف الوسائط','Media Delete','حذف سجلات الوسائط.','Delete media records.'),
  ('countries.read','countries','read','عرض الدول','Countries Read','عرض الدول.','View countries.'),
  ('countries.create','countries','create','إضافة الدول','Countries Create','إضافة دول جديدة.','Create countries.'),
  ('countries.update','countries','update','تعديل الدول','Countries Update','تعديل بيانات الدول.','Update countries.'),
  ('countries.delete','countries','delete','حذف الدول','Countries Delete','حذف الدول.','Delete countries.')
    ,
  (
    'programs.read',
    'programs',
    'read',
    'عرض البرامج',
    'Programs Read',
    'عرض البرامج.',
    'View programs.'
  ),
  (
    'programs.create',
    'programs',
    'create',
    'إضافة البرامج',
    'Programs Create',
    'إضافة برامج جديدة.',
    'Create programs.'
  ),
  (
    'programs.update',
    'programs',
    'update',
    'تعديل البرامج',
    'Programs Update',
    'تعديل بيانات البرامج.',
    'Update programs.'
  ),
  (
    'programs.publish',
    'programs',
    'publish',
    'نشر البرامج',
    'Programs Publish',
    'نشر البرامج وإلغاء نشرها.',
    'Publish and unpublish programs.'
  ),
  (
    'programs.delete',
    'programs',
    'delete',
    'حذف البرامج',
    'Programs Delete',
    'حذف البرامج.',
    'Delete programs.'
  )
on conflict (key)
do update set
  module = excluded.module,
  action = excluded.action,
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  updated_at = now();

-- ---------------------------------------------------------
-- 3. Permission checker
-- Keep the existing parameter name: permission_code
-- ---------------------------------------------------------

create or replace function public.current_user_has_permission(
  permission_code text
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
    join public.role_permissions rp
      on rp.role_id = aur.role_id
    join public.permissions p
      on p.id = rp.permission_id
    join public.admin_profiles ap
      on ap.id = aur.user_id
    where aur.user_id = auth.uid()
      and aur.deleted_at is null
      and p.key = $1
      and ap.status = 'active'
  );
$$;

revoke all
on function public.current_user_has_permission(text)
from public;

grant execute
on function public.current_user_has_permission(text)
to authenticated;
-- ---------------------------------------------------------
-- 4. Link permissions to Super Admin
-- ---------------------------------------------------------

insert into public.role_permissions (
  id,
  role_id,
  permission_id
)
select
  gen_random_uuid(),
  role_record.id,
  permission_record.id
from public.roles role_record
cross join public.permissions permission_record
where role_record.key = 'super_admin'
  and permission_record.key in (
    'media.read',
    'media.upload',
    'media.update',
    'media.delete',
    'countries.read',
    'countries.create',
    'countries.update',
    'countries.delete',
    'programs.read',
    'programs.create',
    'programs.update',
    'programs.publish',
    'programs.delete'
  )
on conflict (role_id, permission_id)
do nothing;

-- ---------------------------------------------------------
-- 5. Ensure RLS is enabled
-- ---------------------------------------------------------

alter table public.media enable row level security;
alter table public.countries enable row level security;

-- ---------------------------------------------------------
-- 6. Remove temporary public.media policies
-- ---------------------------------------------------------

drop policy if exists media_insert on public.media;
drop policy if exists media_select on public.media;
drop policy if exists media_update on public.media;
drop policy if exists media_delete on public.media;

-- ---------------------------------------------------------
-- 7. Restore secure media policies
-- ---------------------------------------------------------

create policy media_select
on public.media
for select
to authenticated
using (
  public.current_user_has_permission('media.read')
  or public.current_user_has_permission('media.upload')
  or public.current_user_has_permission('media.update')
  or public.current_user_has_permission('media.delete')
);

create policy media_insert
on public.media
for insert
to authenticated
with check (
  public.current_user_has_permission('media.upload')
);

create policy media_update
on public.media
for update
to authenticated
using (
  public.current_user_has_permission('media.update')
)
with check (
  public.current_user_has_permission('media.update')
);

create policy media_delete
on public.media
for delete
to authenticated
using (
  public.current_user_has_permission('media.delete')
);

-- ---------------------------------------------------------
-- 8. Restore secure countries policies
-- ---------------------------------------------------------

drop policy if exists countries_select on public.countries;
drop policy if exists countries_insert on public.countries;
drop policy if exists countries_update on public.countries;
drop policy if exists countries_delete on public.countries;

create policy countries_select
on public.countries
for select
to authenticated
using (
  public.current_user_has_permission('countries.read')
);

create policy countries_insert
on public.countries
for insert
to authenticated
with check (
  public.current_user_has_permission('countries.create')
);

create policy countries_update
on public.countries
for update
to authenticated
using (
  public.current_user_has_permission('countries.update')
)
with check (
  public.current_user_has_permission('countries.update')
);

create policy countries_delete
on public.countries
for delete
to authenticated
using (
  public.current_user_has_permission('countries.delete')
);

-- ---------------------------------------------------------
-- 9. Restore storage policies
-- ---------------------------------------------------------

drop policy if exists "media insert for authenticated" on storage.objects;
drop policy if exists "media read for authenticated" on storage.objects;
drop policy if exists "media update for authenticated" on storage.objects;
drop policy if exists "media delete for authenticated" on storage.objects;
drop policy if exists media_bucket_insert on storage.objects;
drop policy if exists media_bucket_select on storage.objects;
drop policy if exists media_bucket_update on storage.objects;
drop policy if exists media_bucket_delete on storage.objects;

create policy media_bucket_select
on storage.objects
for select
to authenticated
using (
  bucket_id = 'media'
);

create policy media_bucket_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'media'
  and public.current_user_has_permission('media.upload')
);

create policy media_bucket_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'media'
  and public.current_user_has_permission('media.update')
)
with check (
  bucket_id = 'media'
  and public.current_user_has_permission('media.update')
);

create policy media_bucket_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'media'
  and public.current_user_has_permission('media.delete')
);

-- ---------------------------------------------------------
-- 10. Refresh PostgREST schema cache
-- ---------------------------------------------------------

notify pgrst, 'reload schema';