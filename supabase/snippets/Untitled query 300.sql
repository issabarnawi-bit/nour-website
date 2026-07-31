drop policy if exists media_insert
on public.media;

create policy media_insert
on public.media
for insert
to authenticated
with check (
  auth.uid() is not null
);