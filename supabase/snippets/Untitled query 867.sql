drop policy if exists countries_select
on public.countries;

drop policy if exists countries_insert
on public.countries;

drop policy if exists countries_update
on public.countries;

drop policy if exists countries_delete
on public.countries;

create policy countries_select
on public.countries
for select
to authenticated
using (
  auth.uid() is not null
);

create policy countries_insert
on public.countries
for insert
to authenticated
with check (
  auth.uid() is not null
);

create policy countries_update
on public.countries
for update
to authenticated
using (
  auth.uid() is not null
)
with check (
  auth.uid() is not null
);

create policy countries_delete
on public.countries
for delete
to authenticated
using (
  auth.uid() is not null
);