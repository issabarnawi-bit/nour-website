create type public.booking_status as enum ('pending_payment','confirmed','cancelled','expired','refunded');
create type public.booking_payment_status as enum ('unpaid','pending','paid','failed','refunded');

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  program_id uuid not null references public.programs(id) on delete restrict,
  departure_id uuid not null references public.program_departures(id) on delete restrict,
  price_tier_id uuid not null references public.program_price_tiers(id) on delete restrict,
  user_id uuid null references auth.users(id) on delete set null,
  contact_name text not null check (char_length(trim(contact_name)) between 2 and 160),
  contact_email text null,
  contact_phone text null,
  contact_country_code varchar(8) null,
  preferred_language varchar(5) not null default 'ar' check (preferred_language in ('ar','en')),
  travelers_count integer not null check (travelers_count > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  total_amount numeric(12,2) not null check (total_amount >= 0),
  currency_code varchar(3) not null check (currency_code = upper(currency_code)),
  status public.booking_status not null default 'pending_payment',
  payment_status public.booking_payment_status not null default 'unpaid',
  reserved_until timestamptz null,
  source text not null default 'website',
  notes text null,
  confirmed_at timestamptz null,
  cancelled_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  constraint bookings_contact_channel_check check (
    nullif(trim(coalesce(contact_email,'')), '') is not null
    or nullif(trim(coalesce(contact_phone,'')), '') is not null
  )
);

create table public.booking_travelers (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  traveler_number integer not null check (traveler_number > 0),
  first_name text not null check (char_length(trim(first_name)) between 1 and 100),
  last_name text not null check (char_length(trim(last_name)) between 1 and 100),
  date_of_birth date null,
  nationality_code varchar(3) null,
  passport_number text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  unique (booking_id, traveler_number)
);

create table public.booking_status_history (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  from_status public.booking_status null,
  to_status public.booking_status not null,
  actor_user_id uuid null references auth.users(id) on delete set null,
  reason text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index bookings_departure_status_idx on public.bookings(departure_id,status) where deleted_at is null;
create index bookings_program_created_idx on public.bookings(program_id,created_at desc) where deleted_at is null;
create index bookings_user_created_idx on public.bookings(user_id,created_at desc) where user_id is not null and deleted_at is null;
create index booking_travelers_booking_idx on public.booking_travelers(booking_id) where deleted_at is null;
create index booking_status_history_booking_idx on public.booking_status_history(booking_id,created_at desc);

create trigger set_bookings_updated_at before update on public.bookings for each row execute function public.set_updated_at();
create trigger set_booking_travelers_updated_at before update on public.booking_travelers for each row execute function public.set_updated_at();

alter table public.bookings enable row level security;
alter table public.booking_travelers enable row level security;
alter table public.booking_status_history enable row level security;

insert into public.permissions (key,module,action,name_ar,name_en,description_ar,description_en,is_active,sort_order)
values
 ('bookings.view','bookings','view','عرض الحجوزات','View Bookings','عرض الحجوزات وتفاصيلها','View bookings and their details',true,10),
 ('bookings.manage','bookings','manage','إدارة الحجوزات','Manage Bookings','إدارة حالات الحجوزات والتعديلات التشغيلية','Manage booking status and operational updates',true,20)
on conflict (key) do update set
 module=excluded.module, action=excluded.action, name_ar=excluded.name_ar, name_en=excluded.name_en,
 description_ar=excluded.description_ar, description_en=excluded.description_en, is_active=true, deleted_at=null;

insert into public.role_permissions (role_id,permission_id)
select r.id,p.id from public.roles r cross join public.permissions p
where r.key='super_admin' and p.key in ('bookings.view','bookings.manage')
on conflict do nothing;

create policy "bookings admin read" on public.bookings for select to authenticated
using (public.current_user_has_permission('bookings.view') or public.current_user_has_permission('bookings.manage'));
create policy "bookings own read" on public.bookings for select to authenticated
using (user_id = auth.uid());
create policy "bookings admin update" on public.bookings for update to authenticated
using (public.current_user_has_permission('bookings.manage'))
with check (public.current_user_has_permission('bookings.manage'));

create policy "booking travelers admin read" on public.booking_travelers for select to authenticated
using (public.current_user_has_permission('bookings.view') or public.current_user_has_permission('bookings.manage'));
create policy "booking travelers own read" on public.booking_travelers for select to authenticated
using (exists (select 1 from public.bookings b where b.id=booking_id and b.user_id=auth.uid()));
create policy "booking travelers admin update" on public.booking_travelers for update to authenticated
using (public.current_user_has_permission('bookings.manage'))
with check (public.current_user_has_permission('bookings.manage'));

create policy "booking history admin read" on public.booking_status_history for select to authenticated
using (public.current_user_has_permission('bookings.view') or public.current_user_has_permission('bookings.manage'));
create policy "booking history own read" on public.booking_status_history for select to authenticated
using (exists (select 1 from public.bookings b where b.id=booking_id and b.user_id=auth.uid()));

revoke all on public.bookings from anon, authenticated;
revoke all on public.booking_travelers from anon, authenticated;
revoke all on public.booking_status_history from anon, authenticated;
grant select, update on public.bookings to authenticated;
grant select, update on public.booking_travelers to authenticated;
grant select on public.booking_status_history to authenticated;
grant all on public.bookings, public.booking_travelers, public.booking_status_history to service_role;

create or replace function public.create_program_booking(
  p_program_id uuid,
  p_departure_id uuid,
  p_price_tier_id uuid,
  p_travelers_count integer,
  p_contact_name text,
  p_contact_email text default null,
  p_contact_phone text default null,
  p_contact_country_code text default null,
  p_preferred_language text default 'ar',
  p_travelers jsonb default '[]'::jsonb
) returns table (booking_id uuid, booking_reference text, status public.booking_status, reserved_until timestamptz, total_amount numeric, currency_code varchar)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_departure public.program_departures%rowtype;
  v_tier public.program_price_tiers%rowtype;
  v_booking_id uuid;
  v_reference text;
  v_released integer := 0;
  v_available integer;
  v_count integer;
  v_item jsonb;
  v_i integer := 0;
begin
  if p_travelers_count is null or p_travelers_count <= 0 then raise exception 'invalid_travelers_count'; end if;
  if char_length(trim(coalesce(p_contact_name,''))) < 2 then raise exception 'contact_name_required'; end if;
  if nullif(trim(coalesce(p_contact_email,'')),'') is null and nullif(trim(coalesce(p_contact_phone,'')),'') is null then raise exception 'contact_channel_required'; end if;
  if p_preferred_language not in ('ar','en') then raise exception 'invalid_language'; end if;
  if jsonb_typeof(coalesce(p_travelers,'[]'::jsonb)) <> 'array' then raise exception 'invalid_travelers'; end if;
  v_count := jsonb_array_length(coalesce(p_travelers,'[]'::jsonb));
  if v_count <> p_travelers_count then raise exception 'traveler_details_count_mismatch'; end if;

  select d.* into v_departure from public.program_departures d
  join public.programs p on p.id=d.program_id
  where d.id=p_departure_id and d.program_id=p_program_id and d.is_active=true and d.deleted_at is null
    and p.status='published' and p.is_active=true and p.deleted_at is null
  for update of d;
  if not found then raise exception 'departure_not_available'; end if;

  if v_departure.status <> 'open' or v_departure.start_at <= now() or (v_departure.booking_deadline is not null and v_departure.booking_deadline < now()) then
    raise exception 'departure_not_open';
  end if;

  with expired as (
    update public.bookings b set status='expired', updated_at=now()
    where b.departure_id=p_departure_id and b.status='pending_payment' and b.reserved_until is not null and b.reserved_until <= now() and b.deleted_at is null
    returning b.id,b.travelers_count
  ), hist as (
    insert into public.booking_status_history (booking_id,from_status,to_status,reason,metadata)
    select id,'pending_payment','expired','reservation_hold_expired','{}'::jsonb from expired returning booking_id
  )
  select coalesce(sum(travelers_count),0)::integer into v_released from expired;

  if v_released > 0 then
    update public.program_departures set seats_available=least(capacity_total,seats_available+v_released) where id=p_departure_id returning * into v_departure;
  end if;
  v_available := v_departure.seats_available;

  select t.* into v_tier from public.program_price_tiers t
  where t.id=p_price_tier_id and t.program_id=p_program_id and t.departure_id=p_departure_id and t.is_active=true and t.deleted_at is null;
  if not found then raise exception 'price_tier_not_available'; end if;
  if v_tier.min_travelers is not null and p_travelers_count < v_tier.min_travelers then raise exception 'below_min_travelers'; end if;
  if v_tier.max_travelers is not null and p_travelers_count > v_tier.max_travelers then raise exception 'above_max_travelers'; end if;
  if v_available < p_travelers_count then raise exception 'insufficient_seats'; end if;

  v_reference := 'NOUR-' || to_char(now(),'YYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
  insert into public.bookings (
    reference,program_id,departure_id,price_tier_id,user_id,contact_name,contact_email,contact_phone,contact_country_code,
    preferred_language,travelers_count,unit_price,total_amount,currency_code,status,payment_status,reserved_until,source
  ) values (
    v_reference,p_program_id,p_departure_id,p_price_tier_id,auth.uid(),trim(p_contact_name),nullif(trim(coalesce(p_contact_email,'')),''),
    nullif(trim(coalesce(p_contact_phone,'')),''),nullif(trim(coalesce(p_contact_country_code,'')),''),p_preferred_language,p_travelers_count,
    v_tier.price,v_tier.price*p_travelers_count,v_tier.currency_code,'pending_payment','unpaid',now()+interval '30 minutes','website'
  ) returning id into v_booking_id;

  for v_item in select value from jsonb_array_elements(p_travelers)
  loop
    v_i := v_i + 1;
    if char_length(trim(coalesce(v_item->>'first_name',''))) < 1 or char_length(trim(coalesce(v_item->>'last_name',''))) < 1 then
      raise exception 'traveler_name_required';
    end if;
    insert into public.booking_travelers (booking_id,traveler_number,first_name,last_name,date_of_birth,nationality_code,passport_number)
    values (
      v_booking_id,v_i,trim(v_item->>'first_name'),trim(v_item->>'last_name'),
      case when nullif(v_item->>'date_of_birth','') is null then null else (v_item->>'date_of_birth')::date end,
      nullif(upper(trim(coalesce(v_item->>'nationality_code',''))),''),nullif(trim(coalesce(v_item->>'passport_number','')),'')
    );
  end loop;

  update public.program_departures set seats_available=seats_available-p_travelers_count where id=p_departure_id;
  insert into public.booking_status_history (booking_id,from_status,to_status,actor_user_id,reason,metadata)
  values (v_booking_id,null,'pending_payment',auth.uid(),'booking_created',jsonb_build_object('source','website','travelers_count',p_travelers_count));

  return query select b.id,b.reference,b.status,b.reserved_until,b.total_amount,b.currency_code from public.bookings b where b.id=v_booking_id;
end;
$$;

revoke all on function public.create_program_booking(uuid,uuid,uuid,integer,text,text,text,text,text,jsonb) from public;
grant execute on function public.create_program_booking(uuid,uuid,uuid,integer,text,text,text,text,text,jsonb) to anon, authenticated;

create or replace function public.admin_set_booking_status(p_booking_id uuid,p_status public.booking_status,p_reason text default null)
returns public.bookings
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_booking public.bookings%rowtype;
  v_old public.booking_status;
  v_release boolean := false;
begin
  if not public.current_user_has_permission('bookings.manage') then raise exception 'permission_denied'; end if;
  select * into v_booking from public.bookings where id=p_booking_id and deleted_at is null for update;
  if not found then raise exception 'booking_not_found'; end if;
  v_old := v_booking.status;
  if v_old = p_status then return v_booking; end if;
  if v_old in ('cancelled','expired','refunded') then raise exception 'terminal_booking_status'; end if;
  if p_status in ('cancelled','expired') then v_release := true; end if;

  update public.bookings set status=p_status,
    confirmed_at=case when p_status='confirmed' then coalesce(confirmed_at,now()) else confirmed_at end,
    cancelled_at=case when p_status='cancelled' then coalesce(cancelled_at,now()) else cancelled_at end
  where id=p_booking_id returning * into v_booking;

  if v_release then
    update public.program_departures set seats_available=least(capacity_total,seats_available+v_booking.travelers_count) where id=v_booking.departure_id;
  end if;
  insert into public.booking_status_history (booking_id,from_status,to_status,actor_user_id,reason)
  values (p_booking_id,v_old,p_status,auth.uid(),nullif(trim(coalesce(p_reason,'')),''));
  return v_booking;
end;
$$;

revoke all on function public.admin_set_booking_status(uuid,public.booking_status,text) from public;
grant execute on function public.admin_set_booking_status(uuid,public.booking_status,text) to authenticated, service_role;