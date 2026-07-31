create policy "media insert for authenticated"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'media'
);

create policy "media read for authenticated"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'media'
);

create policy "media update for authenticated"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'media'
)
with check (
  bucket_id = 'media'
);

create policy "media delete for authenticated"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'media'
);