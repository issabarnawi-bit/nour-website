create or replace function public.update_admin_user_access(
  target_user_id uuid,
  new_status text,
  new_role_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_super_admin(auth.uid()) then
    raise exception 'Only Super Admin can manage users';
  end if;

  if target_user_id = auth.uid() then
    raise exception 'You cannot modify your own role or status';
  end if;

  if new_status not in ('active', 'suspended', 'invited') then
    raise exception 'Invalid user status';
  end if;

  if not exists (
    select 1
    from public.admin_profiles
    where id = target_user_id
  ) then
    raise exception 'Admin user not found';
  end if;

  if not exists (
    select 1
    from public.roles
    where id = new_role_id
      and is_active = true
      and deleted_at is null
  ) then
    raise exception 'Role not found or inactive';
  end if;

  update public.admin_profiles
  set
    status = new_status::public.admin_profile_status,
    updated_at = now()
  where id = target_user_id;

  update public.admin_user_roles
  set
    deleted_at = now(),
    updated_at = now()
  where user_id = target_user_id
    and deleted_at is null;

  insert into public.admin_user_roles (
    user_id,
    role_id,
    assigned_by
  )
  values (
    target_user_id,
    new_role_id,
    auth.uid()
  )
  on conflict (user_id, role_id)
  do update set
    deleted_at = null,
    assigned_by = auth.uid(),
    updated_at = now();

end;
$$;

revoke all
on function public.update_admin_user_access(uuid, text, uuid)
from public;

grant execute
on function public.update_admin_user_access(uuid, text, uuid)
to authenticated;