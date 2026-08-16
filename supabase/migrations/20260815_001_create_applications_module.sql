-- =========================================================
-- NOUR PLATFORM
-- Applications Module
-- Job Applications + Partner Applications
-- =========================================================

begin;

-- =========================================================
-- 01. ENUMS
-- =========================================================

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'application_status'
  ) then
    create type public.application_status as enum (
      'new',
      'under_review',
      'contacted',
      'approved',
      'rejected',
      'archived'
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'employment_type'
  ) then
    create type public.employment_type as enum (
      'full_time',
      'part_time',
      'remote',
      'internship',
      'other'
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'partner_type'
  ) then
    create type public.partner_type as enum (
      'hotel',
      'transport',
      'visa',
      'umrah_company',
      'guide',
      'airline',
      'service_provider',
      'technology',
      'other'
    );
  end if;
end
$$;

-- =========================================================
-- 02. UPDATED_AT FUNCTION
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- 03. JOB APPLICATIONS
-- =========================================================

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),

  full_name text not null,
  email text not null,
  phone text not null,

  country text,
  city text,

  specialization text,
  current_job_title text,

  years_of_experience integer
    check (
      years_of_experience is null
      or years_of_experience >= 0
    ),

  employment_type public.employment_type
    not null
    default 'full_time',

  linkedin_url text,

  cv_path text,

  message text,

  status public.application_status
    not null
    default 'new',

  assigned_to uuid
    references auth.users(id)
    on delete set null,

  internal_notes text,

  last_contacted_at timestamptz,

  privacy_accepted boolean
    not null
    default false,

  source text
    default 'website',

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  deleted_at timestamptz
);

-- =========================================================
-- 04. PARTNER APPLICATIONS
-- =========================================================

create table if not exists public.partner_applications (
  id uuid primary key default gen_random_uuid(),

  company_name text not null,

  contact_name text not null,

  email text not null,

  phone text not null,

  country text,
  city text,

  partner_type public.partner_type
    not null,

  registration_number text,
  license_number text,

  website_url text,

  company_description text,

  services_description text,

  served_countries text[],

  attachment_path text,

  notes text,

  status public.application_status
    not null
    default 'new',

  assigned_to uuid
    references auth.users(id)
    on delete set null,

  internal_notes text,

  last_contacted_at timestamptz,

  terms_accepted boolean
    not null
    default false,

  source text
    default 'website',

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  deleted_at timestamptz
);

-- =========================================================
-- 05. INDEXES
-- =========================================================

create index if not exists
  idx_job_applications_status
on public.job_applications(status);

create index if not exists
  idx_job_applications_created_at
on public.job_applications(created_at desc);

create index if not exists
  idx_job_applications_email
on public.job_applications(lower(email));

create index if not exists
  idx_job_applications_assigned_to
on public.job_applications(assigned_to);

create index if not exists
  idx_job_applications_deleted_at
on public.job_applications(deleted_at);


create index if not exists
  idx_partner_applications_status
on public.partner_applications(status);

create index if not exists
  idx_partner_applications_created_at
on public.partner_applications(created_at desc);

create index if not exists
  idx_partner_applications_email
on public.partner_applications(lower(email));

create index if not exists
  idx_partner_applications_partner_type
on public.partner_applications(partner_type);

create index if not exists
  idx_partner_applications_assigned_to
on public.partner_applications(assigned_to);

create index if not exists
  idx_partner_applications_deleted_at
on public.partner_applications(deleted_at);

-- =========================================================
-- 06. UPDATED_AT TRIGGERS
-- =========================================================

drop trigger if exists
  trg_job_applications_updated_at
on public.job_applications;

create trigger trg_job_applications_updated_at
before update
on public.job_applications
for each row
execute function public.set_updated_at();


drop trigger if exists
  trg_partner_applications_updated_at
on public.partner_applications;

create trigger trg_partner_applications_updated_at
before update
on public.partner_applications
for each row
execute function public.set_updated_at();

-- =========================================================
-- 07. ENABLE RLS
-- =========================================================

alter table public.job_applications
enable row level security;

alter table public.partner_applications
enable row level security;

-- =========================================================
-- 08. PUBLIC INSERT POLICIES
-- =========================================================

drop policy if exists
  "public_insert_job_applications"
on public.job_applications;

create policy
  "public_insert_job_applications"
on public.job_applications
for insert
to anon, authenticated
with check (
  deleted_at is null
  and status = 'new'
  and privacy_accepted = true
);


drop policy if exists
  "public_insert_partner_applications"
on public.partner_applications;

create policy
  "public_insert_partner_applications"
on public.partner_applications
for insert
to anon, authenticated
with check (
  deleted_at is null
  and status = 'new'
  and terms_accepted = true
);

-- =========================================================
-- 09. ADMIN READ POLICIES
-- =========================================================

drop policy if exists
  "admin_read_job_applications"
on public.job_applications;

create policy
  "admin_read_job_applications"
on public.job_applications
for select
to authenticated
using (
  public.current_user_has_permission(
    'applications.view'
  )
  or public.current_user_has_permission(
    'applications.manage'
  )
);


drop policy if exists
  "admin_read_partner_applications"
on public.partner_applications;

create policy
  "admin_read_partner_applications"
on public.partner_applications
for select
to authenticated
using (
  public.current_user_has_permission(
    'partners.view'
  )
  or public.current_user_has_permission(
    'partners.manage'
  )
);

-- =========================================================
-- 10. ADMIN UPDATE POLICIES
-- =========================================================

drop policy if exists
  "admin_manage_job_applications"
on public.job_applications;

create policy
  "admin_manage_job_applications"
on public.job_applications
for update
to authenticated
using (
  public.current_user_has_permission(
    'applications.manage'
  )
)
with check (
  public.current_user_has_permission(
    'applications.manage'
  )
);


drop policy if exists
  "admin_manage_partner_applications"
on public.partner_applications;

create policy
  "admin_manage_partner_applications"
on public.partner_applications
for update
to authenticated
using (
  public.current_user_has_permission(
    'partners.manage'
  )
)
with check (
  public.current_user_has_permission(
    'partners.manage'
  )
);

-- =========================================================
-- 11. ADMIN DELETE
-- =========================================================
-- لا نسمح بالحذف المباشر.
-- نعتمد Soft Delete عبر deleted_at.
-- لذلك لا توجد DELETE policy.

-- =========================================================
-- 12. GRANTS
-- =========================================================

grant insert
on public.job_applications
to anon, authenticated;

grant insert
on public.partner_applications
to anon, authenticated;

grant select, update
on public.job_applications
to authenticated;

grant select, update
on public.partner_applications
to authenticated;

commit;