do $$
declare
  target_email text :=
    'issa.barnawi@norappglobal.com';

  target_full_name text :=
    'Issa Barnawi';

  target_user_id uuid;
  super_admin_role_id uuid;
begin
  select id
  into target_user_id
  from auth.users
  where lower(email) = lower(target_email)
  limit 1;

  if target_user_id is null then
    raise exception
      'Create the user in Authentication first: %',
      target_email;
  end if;

  select id
  into super_admin_role_id
  from public.roles
  where key = 'super_admin'
  limit 1;

  if super_admin_role_id is null then
    raise exception
      'Super Admin role was not found';
  end if;

  insert into public.admin_profiles (
    id,
    full_name,
    email,
    status,
    created_at,
    updated_at
  )
  values (
    target_user_id,
    target_full_name,
    target_email,
    'active',
    now(),
    now()
  )
  on conflict (id)
  do update set
    full_name = excluded.full_name,
    email = excluded.email,
    status = 'active',
    updated_at = now();

  insert into public.admin_user_roles (
    user_id,
    role_id,
    assigned_by,
    created_at,
    updated_at,
    deleted_at
  )
  values (
    target_user_id,
    super_admin_role_id,
    target_user_id,
    now(),
    now(),
    null
  )
  on conflict (user_id, role_id)
  do update set
    assigned_by = excluded.assigned_by,
    deleted_at = null,
    updated_at = now();

  raise notice
    'Super Admin configured successfully: %',
    target_email;
end;
$$;