-- =========================================================
-- Nour Platform
-- Recoverable media deletion flow.
--
-- The database becomes the source of truth for deletion state first.
-- Storage cleanup is tracked explicitly so a partial Storage failure
-- cannot leave an active media row pointing to a missing object.
-- =========================================================

begin;

alter table public.media
  add column if not exists storage_cleanup_pending boolean not null default false;

create or replace function public.soft_delete_media_for_cleanup(
  p_media_id uuid
)
returns table (
  bucket text,
  path text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_bucket text;
  v_path text;
  v_deleted_at timestamptz;
  v_cleanup_pending boolean;
begin
  if coalesce(auth.role(), '') <> 'service_role'
     and not public.current_user_has_permission('media.delete') then
    raise exception 'permission denied: media.delete required';
  end if;

  select m.bucket, m.path, m.deleted_at, m.storage_cleanup_pending
    into v_bucket, v_path, v_deleted_at, v_cleanup_pending
  from public.media m
  where m.id = p_media_id
  for update;

  if not found then
    raise exception 'media not found';
  end if;

  if v_deleted_at is null then
    if exists (
      select 1
      from public.programs p
      where p.cover_media_id = p_media_id
        and p.deleted_at is null
    ) then
      raise exception 'media is used by an active program';
    end if;

    if exists (
      select 1
      from public.countries c
      where c.flag_media_id = p_media_id
        and c.deleted_at is null
    ) then
      raise exception 'media is used by an active country';
    end if;

    update public.media
    set
      deleted_at = now(),
      storage_cleanup_pending = true
    where id = p_media_id;
  elsif not v_cleanup_pending then
    raise exception 'media already deleted and storage cleanup completed';
  end if;

  return query
  select v_bucket, v_path;
end;
$$;

create or replace function public.confirm_media_storage_cleanup(
  p_media_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if coalesce(auth.role(), '') <> 'service_role'
     and not public.current_user_has_permission('media.delete') then
    raise exception 'permission denied: media.delete required';
  end if;

  update public.media
  set storage_cleanup_pending = false
  where id = p_media_id
    and deleted_at is not null
    and storage_cleanup_pending = true;

  if not found then
    raise exception 'no pending media cleanup found';
  end if;
end;
$$;

revoke all on function public.soft_delete_media_for_cleanup(uuid) from public, anon;
revoke all on function public.confirm_media_storage_cleanup(uuid) from public, anon;

grant execute on function public.soft_delete_media_for_cleanup(uuid) to authenticated, service_role;
grant execute on function public.confirm_media_storage_cleanup(uuid) to authenticated, service_role;

commit;
