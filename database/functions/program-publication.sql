-- Nour Platform
-- Program publication authorization helpers.
--
-- programs.update controls content edits.
-- programs.publish controls publication-state changes only.

create or replace function public.enforce_program_publication_permission()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (
    new.status is distinct from old.status
    or new.is_active is distinct from old.is_active
  ) and not public.current_user_has_permission('programs.publish') then
    raise exception using
      errcode = '42501',
      message = 'Permission denied: programs.publish required to change publication state';
  end if;

  return new;
end;
$$;

revoke all
on function public.enforce_program_publication_permission()
from public;

create or replace function public.set_program_publication(
  p_program_id uuid,
  p_status public.program_status,
  p_is_active boolean
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_updated boolean := false;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception using
      errcode = '42501',
      message = 'Authentication required';
  end if;

  if not public.has_permission(v_user_id, 'programs.publish') then
    raise exception using
      errcode = '42501',
      message = 'Permission denied: programs.publish required';
  end if;

  update public.programs
  set
    status = p_status,
    is_active = p_is_active
  where id = p_program_id
    and deleted_at is null;

  v_updated := found;
  return v_updated;
end;
$$;

revoke all
on function public.set_program_publication(uuid, public.program_status, boolean)
from public;

grant execute
on function public.set_program_publication(uuid, public.program_status, boolean)
to authenticated, service_role;
