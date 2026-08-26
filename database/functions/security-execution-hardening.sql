-- Nour Platform — Phase 1 security execution hardening source
-- REVIEW SOURCE ONLY. Do not execute directly in Production.
-- Assemble into an official supabase/migrations file only after migration ledger reconciliation.

-- Public-facing RPCs intentionally callable by anon/authenticated:
--   get_maintenance_mode()
--   get_public_platform_settings()
--   get_published_legal_page(text)
--   record_page_visit(...)
--   subscribe_to_updates(...)
--   unsubscribe_from_updates(uuid)
-- These functions must retain strict input validation and minimal return data.

-- Booking creation requires an authenticated pilgrim internally. Anonymous EXECUTE is unnecessary.
revoke execute on function public.create_program_booking(
  uuid, uuid, uuid, integer, text, text, text, text, text, jsonb
) from anon;

grant execute on function public.create_program_booking(
  uuid, uuid, uuid, integer, text, text, text, text, text, jsonb
) to authenticated, service_role;

-- Parameterized RBAC helpers are internal authorization primitives.
-- Browser clients should call current-user wrappers, not probe arbitrary user UUIDs.
revoke execute on function public.has_permission(uuid, text) from authenticated;
revoke execute on function public.is_super_admin(uuid) from authenticated;

grant execute on function public.has_permission(uuid, text) to service_role;
grant execute on function public.is_super_admin(uuid) to service_role;

grant execute on function public.current_user_has_permission(text) to authenticated, service_role;

-- Trigger helper: match the canonical source and remove mutable search_path warning.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

revoke all on function public.set_updated_at() from public;
grant execute on function public.set_updated_at() to service_role;
