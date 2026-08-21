-- =========================================================
-- Nour Platform
-- Harden public table grants (defense in depth)
--
-- RLS remains the primary row-level authorization boundary.
-- This migration removes unnecessary PostgreSQL table privileges
-- from anon/authenticated for the audited service/application tables,
-- then grants only the operations required by the application.
-- =========================================================

begin;

-- Remove broad/default privileges first.
revoke all privileges on table
  public.hotels,
  public.hotel_media,
  public.program_hotels,
  public.transports,
  public.transport_media,
  public.program_transports,
  public.visas,
  public.visa_media,
  public.program_visas,
  public.job_applications,
  public.partner_applications
from anon, authenticated;

-- Public catalog content: anonymous visitors only need to read rows
-- that are exposed by the existing public SELECT RLS policies.
grant select on table
  public.hotels,
  public.hotel_media,
  public.program_hotels,
  public.transports,
  public.transport_media,
  public.program_transports,
  public.visas,
  public.visa_media,
  public.program_visas
to anon;

-- Authenticated users need table-level DML capability so the existing
-- RBAC-backed RLS policies can authorize read/manage operations.
grant select, insert, update, delete on table
  public.hotels,
  public.hotel_media,
  public.program_hotels,
  public.transports,
  public.transport_media,
  public.program_transports,
  public.visas,
  public.visa_media,
  public.program_visas
to authenticated;

-- Public application forms are create-only for anonymous visitors.
-- Existing INSERT RLS policies enforce consent, status=new and
-- deleted_at IS NULL.
grant insert on table
  public.job_applications,
  public.partner_applications
to anon;

-- Signed-in visitors may also submit forms, while admin reads/updates
-- remain constrained by applications/partners RBAC RLS policies.
grant insert, select, update on table
  public.job_applications,
  public.partner_applications
to authenticated;

commit;
