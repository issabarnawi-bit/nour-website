-- =========================================================
-- Nour Platform
-- Pending Media Storage Cleanup Reconciliation
--
-- Exposes only logically deleted media rows whose Storage cleanup
-- is still pending. The application can retry Storage deletion and
-- then call confirm_media_storage_cleanup(uuid).
-- =========================================================

begin;

create or replace function public.list_pending_media_storage_cleanup()
returns table (
  id uuid,
  bucket text,
  path text,
  deleted_at timestamptz
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if coalesce(auth.role(), '') <> 'service_role'
     and not public.current_user_has_permission('media.delete') then
    raise exception 'permission denied: media.delete required';
  end if;

  return query
  select
    m.id,
    m.bucket,
    m.path,
    m.deleted_at
  from public.media m
  where m.deleted_at is not null
    and m.storage_cleanup_pending = true
  order by m.deleted_at asc, m.id asc;
end;
$$;

revoke all on function public.list_pending_media_storage_cleanup()
from public, anon;

grant execute on function public.list_pending_media_storage_cleanup()
to authenticated, service_role;

commit;
