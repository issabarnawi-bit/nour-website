-- =========================================================
-- NourApp Platform
-- Normalize legacy RBAC schema
-- Converts the Foundation RBAC structure to the current
-- bilingual key/module/action structure.
-- =========================================================

-- =========================================================
-- 1. Normalize roles
-- =========================================================

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'roles'
      and column_name = 'code'
  )
  and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'roles'
      and column_name = 'key'
  ) then
    alter table public.roles
      rename column code to key;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'roles'
      and column_name = 'name'
  )
  and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'roles'
      and column_name = 'name_en'
  ) then
    alter table public.roles
      rename column name to name_en;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'roles'
      and column_name = 'description'
  )
  and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'roles'
      and column_name = 'description_en'
  ) then
    alter table public.roles
      rename column description to description_en;
  end if;
end;
$$;

alter table public.roles
  add column if not exists name_ar text;

alter table public.roles
  add column if not exists description_ar text;

alter table public.roles
  add column if not exists is_active boolean
  not null default true;

alter table public.roles
  add column if not exists sort_order integer
  not null default 0;

alter table public.roles
  add column if not exists deleted_at timestamptz;

update public.roles
set
  name_ar = coalesce(
    nullif(name_ar, ''),
    name_en,
    key
  ),
  description_ar = coalesce(
    description_ar,
    description_en
  );

alter table public.roles
  alter column name_ar set not null;

create unique index if not exists
  uq_roles_key
on public.roles(key);

-- =========================================================
-- 2. Normalize permissions
-- =========================================================

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'permissions'
      and column_name = 'code'
  )
  and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'permissions'
      and column_name = 'key'
  ) then
    alter table public.permissions
      rename column code to key;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'permissions'
      and column_name = 'module_key'
  )
  and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'permissions'
      and column_name = 'module'
  ) then
    alter table public.permissions
      rename column module_key to module;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'permissions'
      and column_name = 'name'
  )
  and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'permissions'
      and column_name = 'name_en'
  ) then
    alter table public.permissions
      rename column name to name_en;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'permissions'
      and column_name = 'description'
  )
  and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'permissions'
      and column_name = 'description_en'
  ) then
    alter table public.permissions
      rename column description to description_en;
  end if;
end;
$$;

alter table public.permissions
  add column if not exists action text;

alter table public.permissions
  add column if not exists name_ar text;

alter table public.permissions
  add column if not exists description_ar text;

alter table public.permissions
  add column if not exists is_active boolean
  not null default true;

alter table public.permissions
  add column if not exists sort_order integer
  not null default 0;

alter table public.permissions
  add column if not exists deleted_at timestamptz;

update public.permissions
set
  module = coalesce(
    nullif(module, ''),
    split_part(key, '.', 1)
  ),
  action = coalesce(
    nullif(action, ''),
    nullif(
      split_part(key, '.', 2),
      ''
    ),
    'access'
  ),
  name_ar = coalesce(
    nullif(name_ar, ''),
    name_en,
    key
  ),
  description_ar = coalesce(
    description_ar,
    description_en
  );

alter table public.permissions
  alter column module set not null;

alter table public.permissions
  alter column action set not null;

alter table public.permissions
  alter column name_ar set not null;

create unique index if not exists
  uq_permissions_key
on public.permissions(key);

create unique index if not exists
  uq_permissions_module_action
on public.permissions(module, action);

-- =========================================================
-- 3. Recreate RBAC helpers for normalized schema
-- Keep original parameter names to avoid PostgreSQL
-- parameter-name conflicts with existing functions.
-- =========================================================

create or replace function public.has_role(
  user_id uuid,
  role_code text
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    join public.admin_profile_roles apr
      on apr.admin_profile_id = ap.id
    join public.roles r
      on r.id = apr.role_id
    where ap.id = $1
      and ap.status = 'active'
      and ap.deleted_at is null
      and r.key = $2
      and r.is_active = true
      and r.deleted_at is null
  );
$$;

create or replace function public.has_permission(
  user_id uuid,
  permission_code text
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.has_role(
      $1,
      'super_admin'
    )
    or exists (
      select 1
      from public.admin_profiles ap
      join public.admin_profile_roles apr
        on apr.admin_profile_id = ap.id
      join public.roles r
        on r.id = apr.role_id
      join public.role_permissions rp
        on rp.role_id = r.id
      join public.permissions p
        on p.id = rp.permission_id
      where ap.id = $1
        and ap.status = 'active'
        and ap.deleted_at is null
        and r.is_active = true
        and r.deleted_at is null
        and p.key = $2
        and p.is_active = true
        and p.deleted_at is null
    );
$$;

create or replace function public.is_super_admin(
  user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(
    $1,
    'super_admin'
  );
$$;

create or replace function public.current_user_has_role(
  role_code text
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(
    auth.uid(),
    $1
  );
$$;

create or replace function public.current_user_has_permission(
  permission_code text
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_permission(
    auth.uid(),
    $1
  );
$$;

create or replace function public.current_user_is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_super_admin(
    auth.uid()
  );
$$;

-- =========================================================
-- 4. Function permissions
-- =========================================================

revoke all
on function public.has_role(uuid, text)
from public;

revoke all
on function public.has_permission(uuid, text)
from public;

revoke all
on function public.is_super_admin(uuid)
from public;

revoke all
on function public.current_user_has_role(text)
from public;

revoke all
on function public.current_user_has_permission(text)
from public;

revoke all
on function public.current_user_is_super_admin()
from public;

grant execute
on function public.has_role(uuid, text)
to authenticated;

grant execute
on function public.has_permission(uuid, text)
to authenticated;

grant execute
on function public.is_super_admin(uuid)
to authenticated;

grant execute
on function public.current_user_has_role(text)
to authenticated;

grant execute
on function public.current_user_has_permission(text)
to authenticated;

grant execute
on function public.current_user_is_super_admin()
to authenticated;

-- =========================================================
-- 5. Refresh PostgREST schema
-- =========================================================

notify pgrst, 'reload schema';