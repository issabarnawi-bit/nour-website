-- =========================================================
-- NourApp Platform
-- Media access policies
-- =========================================================

-- ---------------------------------------------------------
-- Public media table grants
-- ---------------------------------------------------------

grant select, insert, update, delete
on table public.media
to authenticated;

-- ---------------------------------------------------------
-- Media table RLS policies
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
-- Storage object policies for the media bucket
-- ---------------------------------------------------------

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