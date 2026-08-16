-- =========================================================
-- NOUR PLATFORM
-- Public application file uploads
-- =========================================================

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'application-files',
  'application-files',
  false,
  5242880,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id)
do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public_upload_application_files" on storage.objects;

create policy "public_upload_application_files"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'application-files'
  and (storage.foldername(name))[1] in (
    'job-applications',
    'partner-applications'
  )
);

drop policy if exists "admin_read_application_files" on storage.objects;

create policy "admin_read_application_files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'application-files'
  and (
    public.current_user_has_permission('applications.view')
    or public.current_user_has_permission('applications.manage')
    or public.current_user_has_permission('partners.view')
    or public.current_user_has_permission('partners.manage')
  )
);

drop policy if exists "admin_delete_application_files" on storage.objects;

create policy "admin_delete_application_files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'application-files'
  and (
    public.current_user_has_permission('applications.manage')
    or public.current_user_has_permission('partners.manage')
  )
);