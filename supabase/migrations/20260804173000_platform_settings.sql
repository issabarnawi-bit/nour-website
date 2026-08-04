begin;

-- =========================================================
-- 01. ENUMS
-- =========================================================

do $$
begin
  create type public.platform_setting_group as enum (
    'general',
    'contact',
    'booking',
    'payment',
    'social',
    'seo'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type public.platform_setting_value_type as enum (
    'text',
    'number',
    'boolean',
    'email',
    'phone',
    'url',
    'json'
  );
exception
  when duplicate_object then null;
end;
$$;


-- =========================================================
-- 02. UPDATED_AT FUNCTION
-- =========================================================

create or replace function public.set_row_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- =========================================================
-- 03. PLATFORM SETTINGS TABLE
-- =========================================================

create table if not exists public.platform_settings (
  id uuid primary key default gen_random_uuid(),

  setting_key varchar(160) not null,
  setting_group public.platform_setting_group not null,
  value_type public.platform_setting_value_type
    not null default 'text',

  value_json jsonb not null default 'null'::jsonb,

  label_ar varchar(220) not null,
  label_en varchar(220) not null,

  description_ar text,
  description_en text,

  placeholder_ar varchar(300),
  placeholder_en varchar(300),

  validation_rules jsonb
    not null default '{}'::jsonb,

  is_public boolean not null default false,
  is_required boolean not null default false,
  is_active boolean not null default true,

  sort_order integer not null default 0,

  created_by uuid references auth.users(id)
    on update cascade
    on delete set null,

  updated_by uuid references auth.users(id)
    on update cascade
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,

  constraint platform_settings_setting_key_unique
    unique (setting_key),

  constraint platform_settings_setting_key_check
    check (
      setting_key ~
      '^[a-z][a-z0-9]*(\.[a-z][a-z0-9_]*)+$'
    ),

  constraint platform_settings_label_ar_check
    check (
      char_length(trim(label_ar))
      between 2 and 220
    ),

  constraint platform_settings_label_en_check
    check (
      char_length(trim(label_en))
      between 2 and 220
    ),

  constraint platform_settings_sort_order_check
    check (sort_order >= 0),

  constraint platform_settings_validation_rules_check
    check (
      jsonb_typeof(validation_rules) = 'object'
    )
);


-- =========================================================
-- 04. INDEXES
-- =========================================================

create index if not exists
  platform_settings_group_idx
on public.platform_settings (
  setting_group,
  sort_order
)
where deleted_at is null;


create index if not exists
  platform_settings_active_idx
on public.platform_settings (
  is_active,
  is_public
)
where deleted_at is null;


create index if not exists
  platform_settings_updated_at_idx
on public.platform_settings (
  updated_at desc
);


create index if not exists
  platform_settings_deleted_at_idx
on public.platform_settings (
  deleted_at
);


-- =========================================================
-- 05. UPDATED_AT TRIGGER
-- =========================================================

drop trigger if exists
  platform_settings_set_updated_at
on public.platform_settings;


create trigger platform_settings_set_updated_at
before update
on public.platform_settings
for each row
execute function public.set_row_updated_at();


-- =========================================================
-- 06. AUTOMATIC USER TRACKING
-- =========================================================

create or replace function
public.set_platform_setting_audit_user()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    new.created_by =
      coalesce(new.created_by, auth.uid());

    new.updated_by =
      coalesce(new.updated_by, auth.uid());

    return new;
  end if;

  if tg_op = 'UPDATE' then
    new.updated_by =
      coalesce(auth.uid(), new.updated_by);

    return new;
  end if;

  return new;
end;
$$;


drop trigger if exists
  platform_settings_set_audit_user
on public.platform_settings;


create trigger platform_settings_set_audit_user
before insert or update
on public.platform_settings
for each row
execute function
  public.set_platform_setting_audit_user();


-- =========================================================
-- 07. SETTINGS AUDIT LOG
-- =========================================================

create table if not exists
public.platform_settings_audit_log (
  id uuid primary key default gen_random_uuid(),

  setting_id uuid,
  setting_key varchar(160) not null,

  operation varchar(20) not null,

  old_value jsonb,
  new_value jsonb,

  changed_by uuid references auth.users(id)
    on update cascade
    on delete set null,

  changed_at timestamptz
    not null default now(),

  constraint
    platform_settings_audit_operation_check
  check (
    operation in (
      'insert',
      'update',
      'soft_delete',
      'restore',
      'delete'
    )
  )
);


create index if not exists
  platform_settings_audit_setting_id_idx
on public.platform_settings_audit_log (
  setting_id,
  changed_at desc
);


create index if not exists
  platform_settings_audit_changed_by_idx
on public.platform_settings_audit_log (
  changed_by,
  changed_at desc
);


create index if not exists
  platform_settings_audit_changed_at_idx
on public.platform_settings_audit_log (
  changed_at desc
);


create or replace function
public.log_platform_setting_change()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_operation varchar(20);
begin
  if tg_op = 'INSERT' then
    v_operation := 'insert';

    insert into
      public.platform_settings_audit_log (
        setting_id,
        setting_key,
        operation,
        old_value,
        new_value,
        changed_by
      )
    values (
      new.id,
      new.setting_key,
      v_operation,
      null,
      to_jsonb(new),
      auth.uid()
    );

    return new;
  end if;

  if tg_op = 'UPDATE' then
    if old.deleted_at is null
       and new.deleted_at is not null then
      v_operation := 'soft_delete';

    elsif old.deleted_at is not null
       and new.deleted_at is null then
      v_operation := 'restore';

    else
      v_operation := 'update';
    end if;

    insert into
      public.platform_settings_audit_log (
        setting_id,
        setting_key,
        operation,
        old_value,
        new_value,
        changed_by
      )
    values (
      new.id,
      new.setting_key,
      v_operation,
      to_jsonb(old),
      to_jsonb(new),
      auth.uid()
    );

    return new;
  end if;

  if tg_op = 'DELETE' then
    v_operation := 'delete';

    insert into
      public.platform_settings_audit_log (
        setting_id,
        setting_key,
        operation,
        old_value,
        new_value,
        changed_by
      )
    values (
      old.id,
      old.setting_key,
      v_operation,
      to_jsonb(old),
      null,
      auth.uid()
    );

    return old;
  end if;

  return null;
end;
$$;


drop trigger if exists
  platform_settings_audit_trigger
on public.platform_settings;


create trigger platform_settings_audit_trigger
after insert or update or delete
on public.platform_settings
for each row
execute function
  public.log_platform_setting_change();


-- =========================================================
-- 08. PERMISSIONS
-- =========================================================

insert into public.permissions (
  key,
  module,
  action,
  name_ar,
  name_en,
  description_ar,
  description_en,
  is_active,
  sort_order
)
select
  'settings.read',
  'settings',
  'read',
  'عرض الإعدادات',
  'View settings',
  'عرض إعدادات المنصة وقيمها',
  'View platform settings and values',
  true,
  800
where not exists (
  select 1
  from public.permissions
  where key = 'settings.read'
);


insert into public.permissions (
  key,
  module,
  action,
  name_ar,
  name_en,
  description_ar,
  description_en,
  is_active,
  sort_order
)
select
  'settings.manage',
  'settings',
  'manage',
  'إدارة الإعدادات',
  'Manage settings',
  'إضافة وتحديث وحذف واستعادة إعدادات المنصة',
  'Create, update, delete, and restore platform settings',
  true,
  810
where not exists (
  select 1
  from public.permissions
  where key = 'settings.manage'
);


-- =========================================================
-- 09. ASSIGN PERMISSIONS TO SUPER ADMIN
-- =========================================================

insert into public.role_permissions (
  role_id,
  permission_id
)
select
  r.id,
  p.id
from public.roles r
cross join public.permissions p
where coalesce(
  to_jsonb(r) ->> 'key',
  to_jsonb(r) ->> 'code',
  to_jsonb(r) ->> 'slug',
  to_jsonb(r) ->> 'name'
) = 'super_admin'
and p.key in (
  'settings.read',
  'settings.manage'
)
and not exists (
  select 1
  from public.role_permissions rp
  where rp.role_id = r.id
    and rp.permission_id = p.id
);


-- =========================================================
-- 10. PUBLIC SETTINGS FUNCTION
-- =========================================================

create or replace function
public.get_public_platform_settings()
returns table (
  setting_key varchar,
  setting_group
    public.platform_setting_group,
  value_type
    public.platform_setting_value_type,
  value_json jsonb,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    ps.setting_key,
    ps.setting_group,
    ps.value_type,
    ps.value_json,
    ps.updated_at
  from public.platform_settings ps
  where ps.is_public = true
    and ps.is_active = true
    and ps.deleted_at is null
  order by
    ps.setting_group,
    ps.sort_order,
    ps.setting_key;
$$;


revoke all
on function
  public.get_public_platform_settings()
from public;


grant execute
on function
  public.get_public_platform_settings()
to anon, authenticated;


-- =========================================================
-- 11. UPDATE SETTING RPC
-- =========================================================

create or replace function
public.update_platform_setting(
  p_setting_key text,
  p_value_json jsonb
)
returns public.platform_settings
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_setting public.platform_settings;
begin
  if not public.current_user_has_permission(
    'settings.manage'
  ) then
    raise exception
      'You do not have permission to manage settings'
      using errcode = '42501';
  end if;

  if p_setting_key is null
     or trim(p_setting_key) = '' then
    raise exception
      'Setting key is required'
      using errcode = '22023';
  end if;

  update public.platform_settings
  set
    value_json = p_value_json,
    updated_by = auth.uid(),
    updated_at = now()
  where setting_key = trim(p_setting_key)
    and deleted_at is null
  returning *
  into v_setting;

  if v_setting.id is null then
    raise exception
      'Setting not found'
      using errcode = 'P0002';
  end if;

  return v_setting;
end;
$$;


revoke all
on function
  public.update_platform_setting(
    text,
    jsonb
  )
from public;


grant execute
on function
  public.update_platform_setting(
    text,
    jsonb
  )
to authenticated;


-- =========================================================
-- 12. RLS
-- =========================================================

alter table public.platform_settings
enable row level security;


alter table
  public.platform_settings_audit_log
enable row level security;


-- =========================================================
-- 13. SETTINGS POLICIES
-- =========================================================

drop policy if exists
  platform_settings_admin_select
on public.platform_settings;


create policy platform_settings_admin_select
on public.platform_settings
for select
to authenticated
using (
  public.current_user_has_permission(
    'settings.read'
  )
);


drop policy if exists
  platform_settings_admin_insert
on public.platform_settings;


create policy platform_settings_admin_insert
on public.platform_settings
for insert
to authenticated
with check (
  public.current_user_has_permission(
    'settings.manage'
  )
);


drop policy if exists
  platform_settings_admin_update
on public.platform_settings;


create policy platform_settings_admin_update
on public.platform_settings
for update
to authenticated
using (
  public.current_user_has_permission(
    'settings.manage'
  )
)
with check (
  public.current_user_has_permission(
    'settings.manage'
  )
);


drop policy if exists
  platform_settings_admin_delete
on public.platform_settings;


create policy platform_settings_admin_delete
on public.platform_settings
for delete
to authenticated
using (
  public.current_user_has_permission(
    'settings.manage'
  )
);


-- =========================================================
-- 14. AUDIT LOG POLICY
-- =========================================================

drop policy if exists
  platform_settings_audit_admin_select
on public.platform_settings_audit_log;


create policy
  platform_settings_audit_admin_select
on public.platform_settings_audit_log
for select
to authenticated
using (
  public.current_user_has_permission(
    'settings.read'
  )
);


-- =========================================================
-- 15. TABLE GRANTS
-- =========================================================

revoke all
on public.platform_settings
from anon;


revoke all
on public.platform_settings_audit_log
from anon;


grant select
on public.platform_settings
to authenticated;


grant insert, update, delete
on public.platform_settings
to authenticated;


grant select
on public.platform_settings_audit_log
to authenticated;


commit;

notify pgrst, 'reload schema';