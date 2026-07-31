grant select
on table public.roles
to authenticated;

alter table public.roles
enable row level security;

drop policy if exists roles_authenticated_select
on public.roles;

create policy roles_authenticated_select
on public.roles
for select
to authenticated
using (
  deleted_at is null
  and is_active = true
);