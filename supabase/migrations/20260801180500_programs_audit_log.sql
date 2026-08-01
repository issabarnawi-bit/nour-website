begin;

-- =========================================================
-- Programs audit helper
-- =========================================================

create or replace function public.get_current_audit_actor()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select case
    when exists (
      select 1
      from public.admin_profiles
      where id = auth.uid()
    )
    then auth.uid()
    else null
  end;
$$;

revoke all
on function public.get_current_audit_actor()
from public;

grant execute
on function public.get_current_audit_actor()
to authenticated;


-- =========================================================
-- Programs audit trigger function
-- =========================================================

create or replace function public.audit_program_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text;
begin
  -- إنشاء برنامج
  if tg_op = 'INSERT' then
    v_action := 'create';

    insert into public.audit_logs (
      actor_id,
      action,
      entity_type,
      entity_id,
      old_data,
      new_data
    )
    values (
      public.get_current_audit_actor(),
      v_action,
      'program',
      new.id,
      null,
      to_jsonb(new)
    );

    return new;
  end if;

  -- حذف نهائي
  if tg_op = 'DELETE' then
    v_action := 'permanent_delete';

    insert into public.audit_logs (
      actor_id,
      action,
      entity_type,
      entity_id,
      old_data,
      new_data
    )
    values (
      public.get_current_audit_actor(),
      v_action,
      'program',
      old.id,
      to_jsonb(old),
      null
    );

    return old;
  end if;

  -- الاستعادة من سلة المحذوفات
  if old.deleted_at is not null
     and new.deleted_at is null then
    v_action := 'restore';

  -- الحذف المنطقي
  elsif old.deleted_at is null
        and new.deleted_at is not null then
    v_action := 'delete';

  -- نشر البرنامج
  elsif old.status is distinct from new.status
        and new.status = 'published' then
    v_action := 'publish';

  -- إلغاء النشر
  elsif old.status = 'published'
        and new.status is distinct from old.status then
    v_action := 'unpublish';

  -- تعديل عادي
  else
    v_action := 'update';
  end if;

  insert into public.audit_logs (
    actor_id,
    action,
    entity_type,
    entity_id,
    old_data,
    new_data
  )
  values (
    public.get_current_audit_actor(),
    v_action,
    'program',
    new.id,
    to_jsonb(old),
    to_jsonb(new)
  );

  return new;
end;
$$;

revoke all
on function public.audit_program_changes()
from public;


-- =========================================================
-- Programs audit trigger
-- =========================================================

drop trigger if exists programs_audit_trigger
on public.programs;

create trigger programs_audit_trigger
after insert or update or delete
on public.programs
for each row
execute function public.audit_program_changes();


-- =========================================================
-- Protect audit logs from normal modification
-- =========================================================

alter table public.audit_logs
enable row level security;

drop policy if exists audit_logs_select_policy
on public.audit_logs;

create policy audit_logs_select_policy
on public.audit_logs
for select
to authenticated
using (
  public.current_user_has_permission(
    'audit_logs.read'
  )
);

commit;

notify pgrst, 'reload schema';