-- =========================================================
-- Nour Platform
-- Legal Content Functions
-- =========================================================


-- =========================================================
-- Publish Legal Page
--
-- Creates an immutable snapshot of the current working copy.
-- Only users with legal.publish can execute publication.
-- =========================================================

create or replace function public.publish_legal_page(
  p_legal_page_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_page public.legal_pages%rowtype;
  v_version_id uuid;
begin

  -- -------------------------------------------------------
  -- Authentication
  -- -------------------------------------------------------

  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Authentication required';
  end if;


  -- -------------------------------------------------------
  -- Permission
  -- -------------------------------------------------------

  if not public.has_permission(v_user_id, 'legal.publish') then
    raise exception 'Permission denied: legal.publish required';
  end if;


  -- -------------------------------------------------------
  -- Load page
  -- -------------------------------------------------------

  select *
  into v_page
  from public.legal_pages
  where id = p_legal_page_id
    and deleted_at is null
    and is_active = true;

  if not found then
    raise exception 'Legal page not found or inactive';
  end if;


  -- -------------------------------------------------------
  -- Validation
  -- -------------------------------------------------------

  if nullif(trim(v_page.key), '') is null then
    raise exception 'Legal page key is required';
  end if;

  if nullif(trim(v_page.title_ar), '') is null then
    raise exception 'Arabic title is required';
  end if;

  if nullif(trim(v_page.title_en), '') is null then
    raise exception 'English title is required';
  end if;

  if nullif(trim(v_page.content_ar), '') is null then
    raise exception 'Arabic content is required';
  end if;

  if nullif(trim(v_page.content_en), '') is null then
    raise exception 'English content is required';
  end if;

  if nullif(trim(v_page.version), '') is null then
    raise exception 'Version is required';
  end if;


  -- -------------------------------------------------------
  -- Prevent publishing the same version twice
  -- -------------------------------------------------------

  if exists (
    select 1
    from public.legal_page_versions
    where legal_page_id = v_page.id
      and version = v_page.version
  ) then
    raise exception
      'Version % has already been published',
      v_page.version;
  end if;


  -- -------------------------------------------------------
  -- Create immutable snapshot
  -- -------------------------------------------------------

  insert into public.legal_page_versions (
    legal_page_id,
    version,
    title_ar,
    title_en,
    content_ar,
    content_en,
    published_at,
    published_by
  )
  values (
    v_page.id,
    v_page.version,
    v_page.title_ar,
    v_page.title_en,
    v_page.content_ar,
    v_page.content_en,
    now(),
    v_user_id
  )
  returning id
  into v_version_id;


  -- -------------------------------------------------------
  -- Update working-page publication metadata
  -- -------------------------------------------------------

  update public.legal_pages
  set
    status = 'published',
    published_at = now()
  where id = v_page.id;


  return v_version_id;

end;
$$;

revoke all
on function public.publish_legal_page(uuid)
from public;

grant execute
on function public.publish_legal_page(uuid)
to authenticated;

-- =========================================================
-- Get Published Legal Page
--
-- Public website uses this function instead of reading
-- legal_pages / legal_page_versions directly.
-- =========================================================

create or replace function public.get_published_legal_page(
  p_key text
)
returns table (
  legal_page_id uuid,
  page_key text,
  title_ar text,
  title_en text,
  content_ar text,
  content_en text,
  version text,
  published_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    lp.id as legal_page_id,
    lp.key as page_key,
    lpv.title_ar,
    lpv.title_en,
    lpv.content_ar,
    lpv.content_en,
    lpv.version,
    lpv.published_at

  from public.legal_pages lp

  join public.legal_page_versions lpv
    on lpv.legal_page_id = lp.id

  where lp.key = p_key
    and lp.is_active = true
    and lp.deleted_at is null

  order by lpv.published_at desc
  limit 1;
$$;
revoke all
on function public.get_published_legal_page(text)
from public;

grant execute
on function public.get_published_legal_page(text)
to anon, authenticated;