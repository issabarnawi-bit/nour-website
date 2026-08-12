
begin;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'transport_service_type') then
    create type public.transport_service_type as enum (
      'airport_hotel','hotel_airport','hotel_hotel','hotel_haram','haram_hotel','intercity','ziyarat','other'
    );
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'transport_mode') then
    create type public.transport_mode as enum ('private','shared');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'transport_vehicle_type') then
    create type public.transport_vehicle_type as enum ('sedan','suv','van','minibus','bus','coach','other');
  end if;
end
$$;

create table if not exists public.transports (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  provider_name_ar text,
  provider_name_en text,
  service_type public.transport_service_type not null default 'other',
  mode public.transport_mode not null default 'private',
  vehicle_type public.transport_vehicle_type not null default 'van',
  vehicle_name_ar text,
  vehicle_name_en text,
  capacity integer not null default 1 check (capacity >= 1),
  luggage_capacity integer check (luggage_capacity is null or luggage_capacity >= 0),
  description_ar text,
  description_en text,
  amenities_ar text[],
  amenities_en text[],
  cover_media_id uuid references public.media(id) on delete set null,
  is_active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_transports_active on public.transports (is_active) where deleted_at is null;
create index if not exists idx_transports_service_type on public.transports (service_type) where deleted_at is null;
create index if not exists idx_transports_mode on public.transports (mode) where deleted_at is null;
create index if not exists idx_transports_sort on public.transports (sort_order, created_at desc) where deleted_at is null;

create table if not exists public.transport_media (
  id uuid primary key default gen_random_uuid(),
  transport_id uuid not null references public.transports(id) on delete cascade,
  media_id uuid not null references public.media(id) on delete cascade,
  is_cover boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  unique (transport_id, media_id)
);

create index if not exists idx_transport_media_transport on public.transport_media (transport_id, sort_order);

create table if not exists public.program_transports (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  transport_id uuid not null references public.transports(id) on delete restrict,
  day_number integer check (day_number is null or day_number >= 1),
  pickup_name_ar text,
  pickup_name_en text,
  dropoff_name_ar text,
  dropoff_name_en text,
  pickup_datetime timestamptz,
  estimated_duration_minutes integer check (estimated_duration_minutes is null or estimated_duration_minutes >= 0),
  notes_ar text,
  notes_en text,
  is_included boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_program_transports_program on public.program_transports (program_id, sort_order);
create index if not exists idx_program_transports_transport on public.program_transports (transport_id);

insert into public.permissions (
  key,module,action,name_ar,name_en,description_ar,description_en,is_active,sort_order
)
values
  ('transports.read','transports','read','عرض النقل','View transports','عرض خدمات النقل وربطها بالبرامج.','View transport services and program assignments.',true,0),
  ('transports.manage','transports','manage','إدارة النقل','Manage transports','إنشاء وتعديل وحذف واستعادة خدمات النقل وربطها بالبرامج.','Create, update, delete, restore, and assign transport services.',true,10)
on conflict (key) do update
set module = excluded.module,
    action = excluded.action,
    name_ar = excluded.name_ar,
    name_en = excluded.name_en,
    description_ar = excluded.description_ar,
    description_en = excluded.description_en,
    is_active = excluded.is_active,
    sort_order = excluded.sort_order,
    updated_at = now();

alter table public.transports enable row level security;
alter table public.transport_media enable row level security;
alter table public.program_transports enable row level security;

drop policy if exists "Public can read active transports" on public.transports;
create policy "Public can read active transports" on public.transports for select using (deleted_at is null and is_active = true);

drop policy if exists "Admins can read transports" on public.transports;
create policy "Admins can read transports" on public.transports for select to authenticated using (
  public.current_user_has_permission('transports.read') or public.current_user_has_permission('transports.manage')
);

drop policy if exists "Admins can insert transports" on public.transports;
create policy "Admins can insert transports" on public.transports for insert to authenticated with check (
  public.current_user_has_permission('transports.manage')
);

drop policy if exists "Admins can update transports" on public.transports;
create policy "Admins can update transports" on public.transports for update to authenticated using (
  public.current_user_has_permission('transports.manage')
) with check (
  public.current_user_has_permission('transports.manage')
);

drop policy if exists "Admins can delete transports" on public.transports;
create policy "Admins can delete transports" on public.transports for delete to authenticated using (
  public.current_user_has_permission('transports.manage')
);

drop policy if exists "Public can read active transport media" on public.transport_media;
create policy "Public can read active transport media" on public.transport_media for select using (
  exists (
    select 1 from public.transports t
    where t.id = transport_media.transport_id
      and t.deleted_at is null
      and t.is_active = true
  )
);

drop policy if exists "Admins can manage transport media" on public.transport_media;
create policy "Admins can manage transport media" on public.transport_media for all to authenticated using (
  public.current_user_has_permission('transports.manage')
) with check (
  public.current_user_has_permission('transports.manage')
);

drop policy if exists "Public can read published program transports" on public.program_transports;
create policy "Public can read published program transports" on public.program_transports for select using (
  exists (
    select 1 from public.programs p
    where p.id = program_transports.program_id
      and p.deleted_at is null
      and p.is_active = true
      and p.status = 'published'
  )
);

drop policy if exists "Admins can read program transports" on public.program_transports;
create policy "Admins can read program transports" on public.program_transports for select to authenticated using (
  public.current_user_has_permission('transports.read') or public.current_user_has_permission('transports.manage')
);

drop policy if exists "Admins can insert program transports" on public.program_transports;
create policy "Admins can insert program transports" on public.program_transports for insert to authenticated with check (
  public.current_user_has_permission('transports.manage')
);

drop policy if exists "Admins can update program transports" on public.program_transports;
create policy "Admins can update program transports" on public.program_transports for update to authenticated using (
  public.current_user_has_permission('transports.manage')
) with check (
  public.current_user_has_permission('transports.manage')
);

drop policy if exists "Admins can delete program transports" on public.program_transports;
create policy "Admins can delete program transports" on public.program_transports for delete to authenticated using (
  public.current_user_has_permission('transports.manage')
);

commit;