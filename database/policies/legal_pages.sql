-- =========================================================
-- Nour Platform
-- Legal Content RLS Policies
-- =========================================================

-- ---------------------------------------------------------
-- Enable RLS
-- ---------------------------------------------------------

alter table public.legal_pages
  enable row level security;

alter table public.legal_page_versions
  enable row level security;


-- =========================================================
-- LEGAL PAGES
-- =========================================================



-- ---------------------------------------------------------
-- Admin:
-- Users with legal.view can read all legal pages,
-- including drafts and inactive pages.
-- ---------------------------------------------------------

create policy "Admins with legal.view can read legal pages"
on public.legal_pages
for select
to authenticated
using (
  public.has_permission(auth.uid(), 'legal.view')
);


-- ---------------------------------------------------------
-- Admin:
-- Users with legal.edit can create legal pages.
-- ---------------------------------------------------------

create policy "Admins with legal.edit can create legal pages"
on public.legal_pages
for insert
to authenticated
with check (
  public.has_permission(auth.uid(), 'legal.edit')
);


-- ---------------------------------------------------------
-- Admin:
-- Users with legal.edit can update legal pages.
-- Publishing will also be protected at application/service
-- level using legal.publish.
-- ---------------------------------------------------------

create policy "Admins with legal.edit can update legal pages"
on public.legal_pages
for update
to authenticated
using (
  public.has_permission(auth.uid(), 'legal.edit')
)
with check (
  public.has_permission(auth.uid(), 'legal.edit')
);


-- ---------------------------------------------------------
-- Admin:
-- Soft deletion only.
-- Direct DELETE is intentionally not allowed.
-- ---------------------------------------------------------


-- =========================================================
-- LEGAL PAGE VERSIONS
-- =========================================================

-- ---------------------------------------------------------
-- Public:
-- Do NOT expose version history publicly.
-- ---------------------------------------------------------


-- ---------------------------------------------------------
-- Admin:
-- legal.view can view legal version history.
-- ---------------------------------------------------------

create policy "Admins with legal.view can read legal page versions"
on public.legal_page_versions
for select
to authenticated
using (
  public.has_permission(auth.uid(), 'legal.view')
);


