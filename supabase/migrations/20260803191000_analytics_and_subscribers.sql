begin;

-- =========================================================
-- 01. Required extension
-- =========================================================

create extension if not exists pgcrypto;


-- =========================================================
-- 02. Enums
-- =========================================================

do $$
begin
  create type public.visitor_device_type as enum (
    'desktop',
    'mobile',
    'tablet',
    'bot',
    'unknown'
  );
exception
  when duplicate_object then null;
end;
$$;


do $$
begin
  create type public.subscriber_status as enum (
    'pending',
    'active',
    'unsubscribed',
    'blocked'
  );
exception
  when duplicate_object then null;
end;
$$;


do $$
begin
  create type public.subscriber_channel as enum (
    'email',
    'whatsapp',
    'email_and_whatsapp'
  );
exception
  when duplicate_object then null;
end;
$$;


-- =========================================================
-- 03. Shared updated_at function
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
-- 04. visitor_sessions
-- Anonymous visitor session summary
-- No full IP address is stored
-- =========================================================

create table if not exists public.visitor_sessions (
  id uuid primary key default gen_random_uuid(),

  session_key uuid not null unique,

  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),

  pages_count integer not null default 1,

  device_type public.visitor_device_type
    not null default 'unknown',

  language varchar(5),

  country_code varchar(2),

  initial_referrer text,

  utm_source varchar(120),
  utm_medium varchar(120),
  utm_campaign varchar(160),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint visitor_sessions_pages_count_check
    check (pages_count >= 1),

  constraint visitor_sessions_language_check
    check (
      language is null
      or language in ('ar', 'en')
    ),

  constraint visitor_sessions_country_code_check
    check (
      country_code is null
      or country_code ~ '^[A-Z]{2}$'
    ),

  constraint visitor_sessions_referrer_length_check
    check (
      initial_referrer is null
      or char_length(initial_referrer) <= 2000
    )
);


create index if not exists
  visitor_sessions_last_seen_at_idx
on public.visitor_sessions (last_seen_at desc);


create index if not exists
  visitor_sessions_device_type_idx
on public.visitor_sessions (device_type);


create index if not exists
  visitor_sessions_language_idx
on public.visitor_sessions (language);



create index if not exists
  visitor_sessions_country_code_idx
on public.visitor_sessions (country_code);


drop trigger if exists visitor_sessions_set_updated_at
on public.visitor_sessions;

create trigger visitor_sessions_set_updated_at
before update
on public.visitor_sessions
for each row
execute function public.set_row_updated_at();


-- =========================================================
-- 05. page_visits
-- Individual anonymous page visit events
-- =========================================================

create table if not exists public.page_visits (
  id uuid primary key default gen_random_uuid(),

  session_id uuid not null
    references public.visitor_sessions(id)
    on update cascade
    on delete cascade,

  page_path text not null,

  page_title varchar(300),

  referrer text,

  language varchar(5),

  device_type public.visitor_device_type
    not null default 'unknown',

  country_code varchar(2),

  utm_source varchar(120),
  utm_medium varchar(120),
  utm_campaign varchar(160),

  visited_at timestamptz not null default now(),
  created_at timestamptz not null default now(),

  constraint page_visits_page_path_check
    check (
      char_length(page_path) between 1 and 1000
      and page_path like '/%'
    ),

  constraint page_visits_page_title_check
    check (
      page_title is null
      or char_length(page_title) <= 300
    ),

  constraint page_visits_referrer_length_check
    check (
      referrer is null
      or char_length(referrer) <= 2000
    ),

  constraint page_visits_language_check
    check (
      language is null
      or language in ('ar', 'en')
    ),

  constraint page_visits_country_code_check
    check (
      country_code is null
      or country_code ~ '^[A-Z]{2}$'
    )
);


create index if not exists
  page_visits_session_id_idx
on public.page_visits (session_id);


create index if not exists
  page_visits_page_path_idx
on public.page_visits (page_path);


create index if not exists
  page_visits_visited_at_idx
on public.page_visits (visited_at desc);


create index if not exists
  page_visits_page_visited_at_idx
on public.page_visits (
  page_path,
  visited_at desc
);


create index if not exists
  page_visits_language_idx
on public.page_visits (language);


create index if not exists
  page_visits_device_type_idx
on public.page_visits (device_type);


-- =========================================================
-- 06. daily_analytics
-- Aggregated daily analytics for dashboard reporting
-- =========================================================

create table if not exists public.daily_analytics (
  id uuid primary key default gen_random_uuid(),

  analytics_date date not null,
  page_path text not null,

  visits_count bigint not null default 0,
  unique_sessions_count bigint not null default 0,

  language_breakdown jsonb
    not null default '{}'::jsonb,

  device_breakdown jsonb
    not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint daily_analytics_date_page_unique
    unique (analytics_date, page_path),

  constraint daily_analytics_page_path_check
    check (
      char_length(page_path) between 1 and 1000
      and page_path like '/%'
    ),

  constraint daily_analytics_visits_count_check
    check (visits_count >= 0),

  constraint daily_analytics_unique_sessions_check
    check (unique_sessions_count >= 0),

  constraint daily_analytics_language_json_check
    check (jsonb_typeof(language_breakdown) = 'object'),

  constraint daily_analytics_device_json_check
    check (jsonb_typeof(device_breakdown) = 'object')
);


create index if not exists
  daily_analytics_date_idx
on public.daily_analytics (analytics_date desc);


create index if not exists
  daily_analytics_page_path_idx
on public.daily_analytics (page_path);

drop trigger if exists daily_analytics_set_updated_at
on public.daily_analytics;
create trigger daily_analytics_set_updated_at
before update
on public.daily_analytics
for each row
execute function public.set_row_updated_at();


-- =========================================================
-- 07. newsletter_subscribers
-- Explicit-consent subscription records
-- =========================================================

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),

  full_name varchar(180),

  email varchar(320),
  email_normalized varchar(320),

  phone varchar(30),

  country_code varchar(2),

  preferred_language varchar(5)
    not null default 'ar',

  preferred_channel public.subscriber_channel
    not null default 'email',

  status public.subscriber_status
    not null default 'pending',

  consent_given boolean not null default false,
  consent_at timestamptz,
  consent_source varchar(160),

  source_page text,

  unsubscribe_token uuid
    not null default gen_random_uuid(),

  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  blocked_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,

  constraint newsletter_subscribers_contact_check
    check (
      email is not null
      or phone is not null
    ),

  constraint newsletter_subscribers_email_length_check
    check (
      email is null
      or char_length(email) between 3 and 320
    ),

  constraint newsletter_subscribers_phone_length_check
    check (
      phone is null
      or char_length(phone) between 7 and 30
    ),

  constraint newsletter_subscribers_name_length_check
    check (
      full_name is null
      or char_length(full_name) between 2 and 180
    ),

  constraint newsletter_subscribers_language_check
    check (
      preferred_language in ('ar', 'en')
    ),

  constraint newsletter_subscribers_country_code_check
    check (
      country_code is null
      or country_code ~ '^[A-Z]{2}$'
    ),

  constraint newsletter_subscribers_consent_check
    check (
      (
        consent_given = true
        and consent_at is not null
      )
      or
      (
        consent_given = false
        and consent_at is null
      )
    ),

  constraint newsletter_subscribers_source_page_check
    check (
      source_page is null
      or (
        char_length(source_page) <= 1000
        and source_page like '/%'
      )
    )
);


create unique index if not exists
  newsletter_subscribers_email_unique_idx
on public.newsletter_subscribers (email_normalized)
where
  email_normalized is not null
  and deleted_at is null;


create unique index if not exists
  newsletter_subscribers_unsubscribe_token_idx
on public.newsletter_subscribers (unsubscribe_token);


create index if not exists
  newsletter_subscribers_status_idx
on public.newsletter_subscribers (status);


create index if not exists
  newsletter_subscribers_created_at_idx
on public.newsletter_subscribers (created_at desc);


create index if not exists
  newsletter_subscribers_language_idx
on public.newsletter_subscribers (preferred_language);


create index if not exists
  newsletter_subscribers_country_code_idx
on public.newsletter_subscribers (country_code);

drop trigger if exists newsletter_subscribers_set_updated_at
on public.newsletter_subscribers;

create trigger newsletter_subscribers_set_updated_at
before update
on public.newsletter_subscribers
for each row
execute function public.set_row_updated_at();


-- =========================================================
-- 08. Permissions
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
  'analytics.read',
  'analytics',
  'read',
  'عرض التحليلات',
  'View analytics',
  'عرض إحصائيات الزيارات والزوار',
  'View visitor and traffic analytics',
  true,
  700
where not exists (
  select 1
  from public.permissions
  where key = 'analytics.read'
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
  'subscribers.read',
  'subscribers',
  'read',
  'عرض المشتركين',
  'View subscribers',
  'عرض قائمة المشتركين وبيانات الموافقة',
  'View subscribers and consent records',
  true,
  710
where not exists (
  select 1
  from public.permissions
  where key = 'subscribers.read'
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
  'subscribers.manage',
  'subscribers',
  'manage',
  'إدارة المشتركين',
  'Manage subscribers',
  'تحديث حالة المشتركين وإدارة الاشتراكات',
  'Update subscriber status and manage subscriptions',
  true,
  720
where not exists (
  select 1
  from public.permissions
  where key = 'subscribers.manage'
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
  'subscribers.export',
  'subscribers',
  'export',
  'تصدير المشتركين',
  'Export subscribers',
  'تصدير بيانات المشتركين بصيغة CSV',
  'Export subscriber data as CSV',
  true,
  730
where not exists (
  select 1
  from public.permissions
  where key = 'subscribers.export'
);


-- =========================================================
-- 09. Secure page visit registration function
-- Available to website visitors
-- =========================================================

create or replace function public.record_page_visit(
  p_session_key uuid,
  p_page_path text,
  p_page_title text default null,
  p_referrer text default null,
  p_language varchar default null,
  p_device_type public.visitor_device_type default 'unknown',
  p_country_code varchar default null,
  p_utm_source varchar default null,
  p_utm_medium varchar default null,
  p_utm_campaign varchar default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_session_id uuid;
  v_visit_id uuid;
  v_page_path text;
  v_language varchar(5);
  v_country_code varchar(2);
begin
  if p_session_key is null then
    raise exception 'Session key is required'
      using errcode = '22023';
  end if;

  v_page_path := trim(p_page_path);

  if v_page_path is null
     or v_page_path = ''
     or v_page_path not like '/%'
     or char_length(v_page_path) > 1000 then
    raise exception 'Invalid page path'
      using errcode = '22023';
  end if;

  v_language := case
    when lower(trim(p_language)) in ('ar', 'en')
      then lower(trim(p_language))
    else null
  end;

  v_country_code := case
    when upper(trim(p_country_code)) ~ '^[A-Z]{2}$'
      then upper(trim(p_country_code))
    else null
  end;

  insert into public.visitor_sessions (
    session_key,
    first_seen_at,
    last_seen_at,
    pages_count,
    device_type,
    language,
    country_code,
    initial_referrer,
    utm_source,
    utm_medium,
    utm_campaign
  )
  values (
    p_session_key,
    now(),
    now(),
    1,
    coalesce(p_device_type, 'unknown'),
    v_language,
    v_country_code,
    left(nullif(trim(p_referrer), ''), 2000),
    left(nullif(trim(p_utm_source), ''), 120),
    left(nullif(trim(p_utm_medium), ''), 120),
    left(nullif(trim(p_utm_campaign), ''), 160)
  )
  on conflict (session_key)
  do update set
    last_seen_at = now(),
    pages_count =
      public.visitor_sessions.pages_count + 1,
    device_type =
      coalesce(
        excluded.device_type,
        public.visitor_sessions.device_type
      ),
    language =
      coalesce(
        excluded.language,
        public.visitor_sessions.language
      ),
    country_code =
      coalesce(
        excluded.country_code,
        public.visitor_sessions.country_code
      ),
    utm_source =
      coalesce(
        public.visitor_sessions.utm_source,
        excluded.utm_source
      ),
    utm_medium =
      coalesce(
        public.visitor_sessions.utm_medium,
        excluded.utm_medium
      ),
    utm_campaign =
      coalesce(
        public.visitor_sessions.utm_campaign,
        excluded.utm_campaign
      )
  returning id into v_session_id;

  insert into public.page_visits (
    session_id,
    page_path,
    page_title,
    referrer,
    language,
    device_type,
    country_code,
    utm_source,
    utm_medium,
    utm_campaign,
    visited_at
  )
  values (
    v_session_id,
    v_page_path,
    left(nullif(trim(p_page_title), ''), 300),
    left(nullif(trim(p_referrer), ''), 2000),
    v_language,
    coalesce(p_device_type, 'unknown'),
    v_country_code,
    left(nullif(trim(p_utm_source), ''), 120),
    left(nullif(trim(p_utm_medium), ''), 120),
    left(nullif(trim(p_utm_campaign), ''), 160),
    now()
  )
  returning id into v_visit_id;

  return jsonb_build_object(
    'session_id', v_session_id,
    'visit_id', v_visit_id,
    'recorded', true
  );
end;
$$;


revoke all
on function public.record_page_visit(
  uuid,
  text,
  text,
  text,
  varchar,
  public.visitor_device_type,
  varchar,
  varchar,
  varchar,
  varchar
)
from public;


grant execute
on function public.record_page_visit(
  uuid,
  text,
  text,
  text,
  varchar,
  public.visitor_device_type,
  varchar,
  varchar,
  varchar,
  varchar
)
to anon, authenticated;


-- =========================================================
-- 10. Secure subscription function
-- =========================================================

create or replace function public.subscribe_to_updates(
  p_full_name text default null,
  p_email text default null,
  p_phone text default null,
  p_country_code varchar default null,
  p_preferred_language varchar default 'ar',
  p_preferred_channel public.subscriber_channel default 'email',
  p_consent_given boolean default false,
  p_consent_source text default null,
  p_source_page text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_subscriber_id uuid;
  v_email varchar(320);
  v_phone varchar(30);
  v_country_code varchar(2);
  v_language varchar(5);
  v_unsubscribe_token uuid;
begin
  if p_consent_given is not true then
    raise exception 'Explicit consent is required'
      using errcode = '22023';
  end if;

  v_email := lower(nullif(trim(p_email), ''));
  v_phone := nullif(trim(p_phone), '');

  if v_email is null and v_phone is null then
    raise exception 'Email or phone is required'
      using errcode = '22023';
  end if;

  if v_email is not null
     and (
       char_length(v_email) > 320
       or v_email !~
         '^[A-Za-z0-9.!#$%&''*+/=?^_`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
     ) then
    raise exception 'Invalid email address'
      using errcode = '22023';
  end if;

  if v_phone is not null
     and char_length(v_phone) not between 7 and 30 then
    raise exception 'Invalid phone number'
      using errcode = '22023';
  end if;

  v_language := case
    when lower(trim(p_preferred_language)) in ('ar', 'en')
      then lower(trim(p_preferred_language))
    else 'ar'
  end;

  v_country_code := case
    when upper(trim(p_country_code)) ~ '^[A-Z]{2}$'
      then upper(trim(p_country_code))
    else null
  end;

  if v_email is not null then
    insert into public.newsletter_subscribers (
      full_name,
      email,
      email_normalized,
      phone,
      country_code,
      preferred_language,
      preferred_channel,
      status,
      consent_given,
      consent_at,
      consent_source,
      source_page,
      unsubscribe_token
    )
    values (
      left(nullif(trim(p_full_name), ''), 180),
      v_email,
      v_email,
      left(v_phone, 30),
      v_country_code,
      v_language,
      coalesce(p_preferred_channel, 'email'),
      'active',
      true,
      now(),
      left(nullif(trim(p_consent_source), ''), 160),
      left(nullif(trim(p_source_page), ''), 1000),
      gen_random_uuid()
    )
    on conflict (email_normalized)
      where deleted_at is null
    do update set
      full_name =
        coalesce(
          excluded.full_name,
          public.newsletter_subscribers.full_name
        ),
      phone =
        coalesce(
          excluded.phone,
          public.newsletter_subscribers.phone
        ),
      country_code =
        coalesce(
          excluded.country_code,
          public.newsletter_subscribers.country_code
        ),
      preferred_language =
        excluded.preferred_language,
      preferred_channel =
        excluded.preferred_channel,
      status = 'active',
      consent_given = true,
      consent_at = now(),
      consent_source =
        excluded.consent_source,
      source_page =
        excluded.source_page,
      unsubscribed_at = null,
      blocked_at = null,
      unsubscribe_token =
        case
          when public.newsletter_subscribers.status
               in ('unsubscribed', 'blocked')
            then gen_random_uuid()
          else
            public.newsletter_subscribers.unsubscribe_token
        end,
      updated_at = now()
    returning
      id,
      unsubscribe_token
    into
      v_subscriber_id,
      v_unsubscribe_token;
  else
    insert into public.newsletter_subscribers (
      full_name,
      phone,
      country_code,
      preferred_language,
      preferred_channel,
      status,
      consent_given,
      consent_at,
      consent_source,
      source_page,
      unsubscribe_token
    )
    values (
      left(nullif(trim(p_full_name), ''), 180),
      left(v_phone, 30),
      v_country_code,
      v_language,
      coalesce(p_preferred_channel, 'whatsapp'),
      'active',
      true,
      now(),
      left(nullif(trim(p_consent_source), ''), 160),
      left(nullif(trim(p_source_page), ''), 1000),
      gen_random_uuid()
    )
    returning
      id,
      unsubscribe_token
    into
      v_subscriber_id,
      v_unsubscribe_token;
  end if;

  return jsonb_build_object(
    'subscriber_id', v_subscriber_id,
    'status', 'active',
    'subscribed', true
  );
end;
$$;


revoke all
on function public.subscribe_to_updates(
  text,
  text,
  text,
  varchar,
  varchar,
  public.subscriber_channel,
  boolean,
  text,
  text
)
from public;


grant execute
on function public.subscribe_to_updates(
  text,
  text,
  text,
  varchar,
  varchar,
  public.subscriber_channel,
  boolean,
  text,
  text
)
to anon, authenticated;


-- =========================================================
-- 11. Unsubscribe function
-- =========================================================

create or replace function public.unsubscribe_from_updates(
  p_unsubscribe_token uuid
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_updated_count integer;
begin
  if p_unsubscribe_token is null then
    return false;
  end if;

  update public.newsletter_subscribers
  set
    status = 'unsubscribed',
    unsubscribed_at = now(),
    updated_at = now()
  where
    unsubscribe_token = p_unsubscribe_token
    and deleted_at is null
    and status <> 'unsubscribed';

  get diagnostics
    v_updated_count = row_count;

  return v_updated_count > 0;
end;
$$;


revoke all
on function public.unsubscribe_from_updates(uuid)
from public;


grant execute
on function public.unsubscribe_from_updates(uuid)
to anon, authenticated;


-- =========================================================
-- 12. Daily analytics aggregation function
-- Intended for scheduled service-role execution
-- =========================================================

create or replace function public.refresh_daily_analytics(
  p_analytics_date date default current_date
)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_inserted_count integer;
begin
  delete from public.daily_analytics
  where analytics_date = p_analytics_date;

  with base as (
    select
      page_path,
      session_id,
      coalesce(language, 'unknown') as language,
      coalesce(
        device_type::text,
        'unknown'
      ) as device_type
    from public.page_visits
    where visited_at >=
      p_analytics_date::timestamptz
      and visited_at <
      (p_analytics_date + 1)::timestamptz
  ),
  totals as (
    select
      page_path,
      count(*)::bigint as visits_count,
      count(distinct session_id)::bigint
        as unique_sessions_count
    from base
    group by page_path
  ),
  language_counts as (
    select
      page_path,
      language,
      count(*)::bigint as total
    from base
    group by page_path, language
  ),
  language_json as (
    select
      page_path,
      jsonb_object_agg(
        language,
        total
      ) as breakdown
    from language_counts
    group by page_path
  ),
  device_counts as (
    select
      page_path,
      device_type,
      count(*)::bigint as total
    from base
    group by page_path, device_type
  ),
  device_json as (
    select
      page_path,
      jsonb_object_agg(
        device_type,
        total
      ) as breakdown
    from device_counts
    group by page_path
  )
  insert into public.daily_analytics (
    analytics_date,
    page_path,
    visits_count,
    unique_sessions_count,
    language_breakdown,
    device_breakdown
  )
  select
    p_analytics_date,
    totals.page_path,
    totals.visits_count,
    totals.unique_sessions_count,
    coalesce(
      language_json.breakdown,
      '{}'::jsonb
    ),
    coalesce(
      device_json.breakdown,
      '{}'::jsonb
    )
  from totals
  left join language_json
    on language_json.page_path =
       totals.page_path
  left join device_json
    on device_json.page_path =
       totals.page_path;

  get diagnostics
    v_inserted_count = row_count;

  return v_inserted_count;
end;
$$;


revoke all
on function public.refresh_daily_analytics(date)
from public;


grant execute
on function public.refresh_daily_analytics(date)
to service_role;


-- =========================================================
-- 13. RLS
-- =========================================================

alter table public.visitor_sessions
enable row level security;

alter table public.page_visits
enable row level security;

alter table public.daily_analytics
enable row level security;

alter table public.newsletter_subscribers
enable row level security;


-- =========================================================
-- 14. visitor_sessions policies
-- =========================================================

drop policy if exists
  visitor_sessions_admin_select
on public.visitor_sessions;


create policy visitor_sessions_admin_select
on public.visitor_sessions
for select
to authenticated
using (
  public.current_user_has_permission(
    'analytics.read'
  )
);


-- =========================================================
-- 15. page_visits policies
-- =========================================================

drop policy if exists
  page_visits_admin_select
on public.page_visits;


create policy page_visits_admin_select
on public.page_visits
for select
to authenticated
using (
  public.current_user_has_permission(
    'analytics.read'
  )
);


-- =========================================================
-- 16. daily_analytics policies
-- =========================================================

drop policy if exists
  daily_analytics_admin_select
on public.daily_analytics;


create policy daily_analytics_admin_select
on public.daily_analytics
for select
to authenticated
using (
  public.current_user_has_permission(
    'analytics.read'
  )
);


-- =========================================================
-- 17. newsletter_subscribers policies
-- =========================================================

drop policy if exists
  newsletter_subscribers_admin_select
on public.newsletter_subscribers;


create policy newsletter_subscribers_admin_select
on public.newsletter_subscribers
for select
to authenticated
using (
  public.current_user_has_permission(
    'subscribers.read'
  )
);


drop policy if exists
  newsletter_subscribers_admin_update
on public.newsletter_subscribers;


create policy newsletter_subscribers_admin_update
on public.newsletter_subscribers
for update
to authenticated
using (
  public.current_user_has_permission(
    'subscribers.manage'
  )
)
with check (
  public.current_user_has_permission(
    'subscribers.manage'
  )
);


-- =========================================================
-- 18. Remove direct public table access
-- Website writes must go through RPC functions
-- =========================================================

revoke all
on public.visitor_sessions
from anon;

revoke all
on public.page_visits
from anon;

revoke all
on public.daily_analytics
from anon;

revoke all
on public.newsletter_subscribers
from anon;


grant select
on public.visitor_sessions
to authenticated;

grant select
on public.page_visits
to authenticated;

grant select
on public.daily_analytics
to authenticated;

grant select, update
on public.newsletter_subscribers
to authenticated;


commit;

notify pgrst, 'reload schema';