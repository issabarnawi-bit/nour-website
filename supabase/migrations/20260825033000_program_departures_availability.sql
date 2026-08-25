-- Program departures and availability

do $$
begin
  if not exists (select 1 from pg_type where typname = 'program_departure_status') then
    create type public.program_departure_status as enum ('scheduled','open','full','closed','cancelled');
  end if;
end $$;

create table if not exists public.program_departures (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  start_at timestamptz not null,
  end_at timestamptz,
  booking_deadline timestamptz,
  capacity_total integer not null default 0 check (capacity_total >= 0),
  seats_available integer not null default 0 check (seats_available >= 0),
  status public.program_departure_status not null default 'scheduled',
  notes_ar text,
  notes_en text,
  is_active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint program_departures_end_after_start check (end_at is null or end_at >= start_at),
  constraint program_departures_deadline_before_start check (booking_deadline is null or booking_deadline <= start_at),
  constraint program_departures_seats_within_capacity check (seats_available <= capacity_total)
);

create index if not exists idx_program_departures_program on public.program_departures(program_id);
create index if not exists idx_program_departures_public on public.program_departures(program_id, start_at, status) where deleted_at is null and is_active = true;

alter table public.program_departures enable row level security;

drop trigger if exists set_program_departures_updated_at on public.program_departures;
create trigger set_program_departures_updated_at
before update on public.program_departures
for each row execute function public.set_updated_at();

revoke all on table public.program_departures from anon, authenticated;
grant select on table public.program_departures to anon;
grant select, insert, update, delete on table public.program_departures to authenticated;
grant all on table public.program_departures to service_role;

drop policy if exists "Public can read program departures" on public.program_departures;
create policy "Public can read program departures"
on public.program_departures
for select
to anon, authenticated
using (
  is_active = true
  and deleted_at is null
  and exists (
    select 1 from public.programs p
    where p.id = program_departures.program_id
      and p.status = 'published'::public.program_status
      and p.is_active = true
      and p.deleted_at is null
  )
);

drop policy if exists "Admins can read program departures" on public.program_departures;
create policy "Admins can read program departures"
on public.program_departures
for select
to authenticated
using (
  public.current_user_has_permission('programs.create')
  or public.current_user_has_permission('programs.update')
  or public.current_user_has_permission('programs.publish')
  or public.current_user_has_permission('programs.delete')
);

drop policy if exists "Admins can insert program departures" on public.program_departures;
create policy "Admins can insert program departures"
on public.program_departures
for insert
to authenticated
with check (
  public.current_user_has_permission('programs.create')
  or public.current_user_has_permission('programs.update')
);

drop policy if exists "Admins can update program departures" on public.program_departures;
create policy "Admins can update program departures"
on public.program_departures
for update
to authenticated
using (public.current_user_has_permission('programs.update'))
with check (public.current_user_has_permission('programs.update'));

drop policy if exists "Admins can delete program departures" on public.program_departures;
create policy "Admins can delete program departures"
on public.program_departures
for delete
to authenticated
using (
  public.current_user_has_permission('programs.update')
  or public.current_user_has_permission('programs.delete')
);
