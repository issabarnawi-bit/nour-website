-- Nour Platform
-- Canonical Programs authorization policies.
--
-- Content edits require programs.update.
-- Publication state changes require programs.publish.

alter table public.programs enable row level security;

drop policy if exists programs_insert on public.programs;
create policy programs_insert
on public.programs
for insert
to authenticated
with check (
  public.current_user_has_permission('programs.create')
  and (
    status <> 'published'::public.program_status
    or public.current_user_has_permission('programs.publish')
  )
);

drop policy if exists programs_update on public.programs;
create policy programs_update
on public.programs
for update
to authenticated
using (
  deleted_at is null
  and public.current_user_has_permission('programs.update')
)
with check (
  public.current_user_has_permission('programs.update')
);

drop trigger if exists enforce_program_publication_permission
on public.programs;

create trigger enforce_program_publication_permission
before update of status, is_active
on public.programs
for each row
execute function public.enforce_program_publication_permission();
