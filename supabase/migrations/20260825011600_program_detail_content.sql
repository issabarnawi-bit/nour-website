-- Structured public/admin program detail content.
-- Adds itinerary, inclusions/exclusions, cancellation rules, meeting points,
-- price tiers, and FAQs using the existing programs RBAC model.

create table if not exists public.program_itinerary_days (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  day_number integer not null check (day_number > 0),
  title_ar text not null,
  title_en text not null,
  description_ar text,
  description_en text,
  location_ar text,
  location_en text,
  start_time time,
  end_time time,
  is_active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint program_itinerary_days_program_day_unique unique (program_id, day_number)
);

create table if not exists public.program_inclusion_items (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  inclusion_type text not null check (inclusion_type in ('included', 'excluded')),
  title_ar text not null,
  title_en text not null,
  description_ar text,
  description_en text,
  is_active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.program_cancellation_rules (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  title_ar text not null,
  title_en text not null,
  description_ar text not null,
  description_en text not null,
  days_before_start integer check (days_before_start is null or days_before_start >= 0),
  refund_percent numeric(5,2) check (refund_percent is null or (refund_percent >= 0 and refund_percent <= 100)),
  is_active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.program_meeting_points (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  name_ar text not null,
  name_en text not null,
  address_ar text,
  address_en text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  meeting_at timestamptz,
  notes_ar text,
  notes_en text,
  is_active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint program_meeting_points_latitude_check check (latitude is null or (latitude between -90 and 90)),
  constraint program_meeting_points_longitude_check check (longitude is null or (longitude between -180 and 180))
);

create table if not exists public.program_price_tiers (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  name_ar text not null,
  name_en text not null,
  description_ar text,
  description_en text,
  price numeric(12,2) not null check (price >= 0),
  currency_code varchar(3) not null default 'SAR' check (char_length(currency_code) = 3),
  min_travelers integer check (min_travelers is null or min_travelers > 0),
  max_travelers integer check (max_travelers is null or max_travelers > 0),
  is_active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint program_price_tiers_traveler_range_check check (
    min_travelers is null or max_travelers is null or min_travelers <= max_travelers
  )
);

create table if not exists public.program_faqs (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  question_ar text not null,
  question_en text not null,
  answer_ar text not null,
  answer_en text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists program_itinerary_days_program_idx on public.program_itinerary_days(program_id, sort_order, day_number) where deleted_at is null;
create index if not exists program_inclusion_items_program_idx on public.program_inclusion_items(program_id, inclusion_type, sort_order) where deleted_at is null;
create index if not exists program_cancellation_rules_program_idx on public.program_cancellation_rules(program_id, sort_order) where deleted_at is null;
create index if not exists program_meeting_points_program_idx on public.program_meeting_points(program_id, sort_order) where deleted_at is null;
create index if not exists program_price_tiers_program_idx on public.program_price_tiers(program_id, sort_order) where deleted_at is null;
create index if not exists program_faqs_program_idx on public.program_faqs(program_id, sort_order) where deleted_at is null;

create trigger set_program_itinerary_days_updated_at before update on public.program_itinerary_days for each row execute function public.set_updated_at();
create trigger set_program_inclusion_items_updated_at before update on public.program_inclusion_items for each row execute function public.set_updated_at();
create trigger set_program_cancellation_rules_updated_at before update on public.program_cancellation_rules for each row execute function public.set_updated_at();
create trigger set_program_meeting_points_updated_at before update on public.program_meeting_points for each row execute function public.set_updated_at();
create trigger set_program_price_tiers_updated_at before update on public.program_price_tiers for each row execute function public.set_updated_at();
create trigger set_program_faqs_updated_at before update on public.program_faqs for each row execute function public.set_updated_at();

alter table public.program_itinerary_days enable row level security;
alter table public.program_inclusion_items enable row level security;
alter table public.program_cancellation_rules enable row level security;
alter table public.program_meeting_points enable row level security;
alter table public.program_price_tiers enable row level security;
alter table public.program_faqs enable row level security;

-- Public rows must be active and belong to a currently published/active program.
do $$
declare
  t text;
begin
  foreach t in array array[
    'program_itinerary_days',
    'program_inclusion_items',
    'program_cancellation_rules',
    'program_meeting_points',
    'program_price_tiers',
    'program_faqs'
  ] loop
    execute format(
      'create policy %I on public.%I for select using (
        is_active = true and deleted_at is null and exists (
          select 1 from public.programs p
          where p.id = program_id
            and p.status = ''published''::public.program_status
            and p.is_active = true
            and p.deleted_at is null
        )
      )',
      'Public can read ' || replace(t, '_', ' '),
      t
    );

    execute format(
      'create policy %I on public.%I for select using (
        public.current_user_has_permission(''programs.create'')
        or public.current_user_has_permission(''programs.update'')
        or public.current_user_has_permission(''programs.publish'')
        or public.current_user_has_permission(''programs.delete'')
      )',
      'Admins can read ' || replace(t, '_', ' '),
      t
    );

    execute format(
      'create policy %I on public.%I for insert with check (
        public.current_user_has_permission(''programs.create'')
        or public.current_user_has_permission(''programs.update'')
      )',
      'Admins can insert ' || replace(t, '_', ' '),
      t
    );

    execute format(
      'create policy %I on public.%I for update using (
        public.current_user_has_permission(''programs.update'')
      ) with check (
        public.current_user_has_permission(''programs.update'')
      )',
      'Admins can update ' || replace(t, '_', ' '),
      t
    );

    execute format(
      'create policy %I on public.%I for delete using (
        public.current_user_has_permission(''programs.update'')
        or public.current_user_has_permission(''programs.delete'')
      )',
      'Admins can delete ' || replace(t, '_', ' '),
      t
    );
  end loop;
end $$;
