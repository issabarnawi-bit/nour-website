alter table public.program_price_tiers
  add column if not exists departure_id uuid null;

alter table public.program_price_tiers
  drop constraint if exists program_price_tiers_departure_id_fkey;

alter table public.program_price_tiers
  add constraint program_price_tiers_departure_id_fkey
  foreign key (departure_id) references public.program_departures(id) on delete set null;

create index if not exists idx_program_price_tiers_departure_active
  on public.program_price_tiers(departure_id, sort_order)
  where deleted_at is null and departure_id is not null;

create or replace function public.validate_program_price_tier_departure()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  linked_program_id uuid;
begin
  if new.departure_id is null then
    return new;
  end if;

  select d.program_id
    into linked_program_id
  from public.program_departures d
  where d.id = new.departure_id;

  if linked_program_id is null then
    raise exception 'Linked departure does not exist';
  end if;

  if linked_program_id <> new.program_id then
    raise exception 'Price tier departure must belong to the same program';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_program_price_tier_departure on public.program_price_tiers;
create trigger validate_program_price_tier_departure
before insert or update of departure_id, program_id on public.program_price_tiers
for each row execute function public.validate_program_price_tier_departure();
