create type public.pilgrim_document_type as enum ('passport','residence_permit','national_id','other');

create table public.pilgrim_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text null,
  country_code varchar(8) null,
  nationality_code varchar(3) null,
  date_of_birth date null,
  passport_number text null,
  passport_expiry date null,
  residence_country_code varchar(3) null,
  preferred_language varchar(5) not null default 'ar' check (preferred_language in ('ar','en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pilgrim_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type public.pilgrim_document_type not null,
  bucket text not null default 'pilgrim-documents',
  path text not null,
  original_name text null,
  mime_type text null,
  file_size bigint null check (file_size is null or file_size >= 0),
  is_verified boolean not null default false,
  verified_at timestamptz null,
  verified_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null
);

create unique index pilgrim_documents_active_type_uidx on public.pilgrim_documents(user_id,document_type) where deleted_at is null;
create index pilgrim_documents_user_idx on public.pilgrim_documents(user_id) where deleted_at is null;

create trigger set_pilgrim_profiles_updated_at before update on public.pilgrim_profiles for each row execute function public.set_updated_at();
create trigger set_pilgrim_documents_updated_at before update on public.pilgrim_documents for each row execute function public.set_updated_at();

alter table public.pilgrim_profiles enable row level security;
alter table public.pilgrim_documents enable row level security;

create policy "pilgrim profile own read" on public.pilgrim_profiles for select to authenticated using (user_id=auth.uid());
create policy "pilgrim profile own insert" on public.pilgrim_profiles for insert to authenticated with check (user_id=auth.uid());
create policy "pilgrim profile own update" on public.pilgrim_profiles for update to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "pilgrim profile admin read" on public.pilgrim_profiles for select to authenticated using (public.current_user_has_permission('bookings.view') or public.current_user_has_permission('bookings.manage'));

create policy "pilgrim docs own read" on public.pilgrim_documents for select to authenticated using (user_id=auth.uid());
create policy "pilgrim docs own insert" on public.pilgrim_documents for insert to authenticated with check (user_id=auth.uid());
create policy "pilgrim docs own update" on public.pilgrim_documents for update to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "pilgrim docs admin read" on public.pilgrim_documents for select to authenticated using (public.current_user_has_permission('bookings.view') or public.current_user_has_permission('bookings.manage'));

revoke all on public.pilgrim_profiles, public.pilgrim_documents from anon, authenticated;
grant select,insert,update on public.pilgrim_profiles, public.pilgrim_documents to authenticated;
grant all on public.pilgrim_profiles, public.pilgrim_documents to service_role;

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('pilgrim-documents','pilgrim-documents',false,10485760,array['image/jpeg','image/png','application/pdf'])
on conflict (id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

create policy "pilgrim storage own read" on storage.objects for select to authenticated
using (bucket_id='pilgrim-documents' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "pilgrim storage own insert" on storage.objects for insert to authenticated
with check (bucket_id='pilgrim-documents' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "pilgrim storage own update" on storage.objects for update to authenticated
using (bucket_id='pilgrim-documents' and (storage.foldername(name))[1]=auth.uid()::text)
with check (bucket_id='pilgrim-documents' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "pilgrim storage own delete" on storage.objects for delete to authenticated
using (bucket_id='pilgrim-documents' and (storage.foldername(name))[1]=auth.uid()::text);

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
  v_profile public.pilgrim_profiles%rowtype;
  v_booking_id uuid;
  v_reference text;
  v_released integer := 0;
  v_available integer;
  v_count integer;
  v_item jsonb;
  v_i integer := 0;
begin
  if auth.uid() is null then raise exception 'authentication_required'; end if;

  select * into v_profile from public.pilgrim_profiles where user_id=auth.uid();
  if not found then raise exception 'pilgrim_profile_required'; end if;
  if char_length(trim(coalesce(v_profile.full_name,''))) < 2
     or v_profile.date_of_birth is null
     or nullif(trim(coalesce(v_profile.nationality_code,'')),'') is null
     or nullif(trim(coalesce(v_profile.passport_number,'')),'') is null
     or v_profile.passport_expiry is null
     or v_profile.passport_expiry <= current_date then
    raise exception 'pilgrim_profile_incomplete';
  end if;
  if not exists (
    select 1 from public.pilgrim_documents d
    where d.user_id=auth.uid() and d.document_type='passport' and d.deleted_at is null
  ) then raise exception 'passport_document_required'; end if;

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
  if v_departure.status <> 'open' or v_departure.start_at <= now() or (v_departure.booking_deadline is not null and v_departure.booking_deadline < now()) then raise exception 'departure_not_open'; end if;

  with expired as (
    update public.bookings b set status='expired', updated_at=now()
    where b.departure_id=p_departure_id and b.status='pending_payment' and b.reserved_until is not null and b.reserved_until <= now() and b.deleted_at is null
    returning b.id,b.travelers_count
  ), hist as (
    insert into public.booking_status_history (booking_id,from_status,to_status,reason,metadata)
    select id,'pending_payment','expired','reservation_hold_expired','{}'::jsonb from expired returning booking_id
  )
  select coalesce(sum(travelers_count),0)::integer into v_released from expired;
  if v_released > 0 then update public.program_departures set seats_available=least(capacity_total,seats_available+v_released) where id=p_departure_id returning * into v_departure; end if;
  v_available := v_departure.seats_available;

  select t.* into v_tier from public.program_price_tiers t
  where t.id=p_price_tier_id and t.program_id=p_program_id and t.departure_id=p_departure_id and t.is_active=true and t.deleted_at is null;
  if not found then raise exception 'price_tier_not_available'; end if;
  if v_tier.min_travelers is not null and p_travelers_count < v_tier.min_travelers then raise exception 'below_min_travelers'; end if;
  if v_tier.max_travelers is not null and p_travelers_count > v_tier.max_travelers then raise exception 'above_max_travelers'; end if;
  if v_available < p_travelers_count then raise exception 'insufficient_seats'; end if;

  v_reference := 'NOUR-' || to_char(now(),'YYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
  insert into public.bookings (reference,program_id,departure_id,price_tier_id,user_id,contact_name,contact_email,contact_phone,contact_country_code,preferred_language,travelers_count,unit_price,total_amount,currency_code,status,payment_status,reserved_until,source)
  values (v_reference,p_program_id,p_departure_id,p_price_tier_id,auth.uid(),trim(p_contact_name),nullif(trim(coalesce(p_contact_email,'')),''),nullif(trim(coalesce(p_contact_phone,'')),''),nullif(trim(coalesce(p_contact_country_code,'')),''),p_preferred_language,p_travelers_count,v_tier.price,v_tier.price*p_travelers_count,v_tier.currency_code,'pending_payment','unpaid',now()+interval '30 minutes','website') returning id into v_booking_id;

  for v_item in select value from jsonb_array_elements(p_travelers)
  loop
    v_i := v_i + 1;
    if char_length(trim(coalesce(v_item->>'first_name',''))) < 1 or char_length(trim(coalesce(v_item->>'last_name',''))) < 1 then raise exception 'traveler_name_required'; end if;
    insert into public.booking_travelers (booking_id,traveler_number,first_name,last_name,date_of_birth,nationality_code,passport_number)
    values (v_booking_id,v_i,trim(v_item->>'first_name'),trim(v_item->>'last_name'),case when nullif(v_item->>'date_of_birth','') is null then null else (v_item->>'date_of_birth')::date end,nullif(upper(trim(coalesce(v_item->>'nationality_code',''))),''),nullif(trim(coalesce(v_item->>'passport_number','')),''));
  end loop;

  update public.program_departures set seats_available=seats_available-p_travelers_count where id=p_departure_id;
  insert into public.booking_status_history (booking_id,from_status,to_status,actor_user_id,reason,metadata)
  values (v_booking_id,null,'pending_payment',auth.uid(),'booking_created',jsonb_build_object('source','website','travelers_count',p_travelers_count));
  return query select b.id,b.reference,b.status,b.reserved_until,b.total_amount,b.currency_code from public.bookings b where b.id=v_booking_id;
end;
$$;

revoke all on function public.create_program_booking(uuid,uuid,uuid,integer,text,text,text,text,text,jsonb) from public;
grant execute on function public.create_program_booking(uuid,uuid,uuid,integer,text,text,text,text,text,jsonb) to authenticated, service_role;
