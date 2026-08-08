create type public.program_flight_direction as enum (
  'outbound',
  'return'
);

create type public.program_flight_type as enum (
  'direct',
  'transit'
);

create table if not exists public.program_flights (
  id uuid primary key default gen_random_uuid(),

  program_id uuid not null
    references public.programs(id)
    on delete cascade,

  direction public.program_flight_direction not null,

  airline_name_ar text,
  airline_name_en text,

  flight_number text,

  departure_airport_ar text,
  departure_airport_en text,

  arrival_airport_ar text,
  arrival_airport_en text,

  departure_at timestamptz,
  arrival_at timestamptz,

  flight_type public.program_flight_type
    not null
    default 'direct',

  transit_airport_ar text,
  transit_airport_en text,

  transit_duration_minutes integer,

  cabin_class_ar text,
  cabin_class_en text,

  baggage_allowance_kg integer,

  notes_ar text,
  notes_en text,

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint program_flights_sort_order_check
    check (sort_order >= 0),

  constraint program_flights_baggage_check
    check (
      baggage_allowance_kg is null
      or baggage_allowance_kg >= 0
    ),

  constraint program_flights_transit_duration_check
    check (
      transit_duration_minutes is null
      or transit_duration_minutes >= 0
    ),

  constraint program_flights_time_check
    check (
      departure_at is null
      or arrival_at is null
      or arrival_at > departure_at
    )
);

create index if not exists program_flights_program_idx
  on public.program_flights (
    program_id,
    direction,
    sort_order
  );

drop trigger if exists set_program_flights_updated_at
  on public.program_flights;

create trigger set_program_flights_updated_at
before update on public.program_flights
for each row
execute function public.set_updated_at();

alter table public.program_flights
  enable row level security;

create policy "Public can read program flights"
on public.program_flights
for select
using (
  exists (
    select 1
    from public.programs p
    where p.id = program_flights.program_id
      and p.status = 'published'
      and p.is_active = true
      and p.deleted_at is null
  )
);

create policy "Admins can read program flights"
on public.program_flights
for select
to authenticated
using (
  public.current_user_has_permission(
    'programs.read'
  )
  or public.current_user_has_permission(
    'programs.manage'
  )
);

create policy "Admins can manage program flights"
on public.program_flights
for all
to authenticated
using (
  public.current_user_has_permission(
    'programs.manage'
  )
)
with check (
  public.current_user_has_permission(
    'programs.manage'
  )
);