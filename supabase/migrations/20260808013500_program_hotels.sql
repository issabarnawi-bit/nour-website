create table if not exists public.hotels (
  id uuid primary key default gen_random_uuid(),

  name_ar text not null,
  name_en text not null,

  city_ar text,
  city_en text,

  stars integer not null default 3,

  description_ar text,
  description_en text,

  address_ar text,
  address_en text,

  latitude numeric(9,6),
  longitude numeric(9,6),

  cover_media_id uuid
    references public.media(id)
    on delete set null,

  is_active boolean not null default true,
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,

  constraint hotels_stars_check
    check (stars between 1 and 5),

  constraint hotels_sort_order_check
    check (sort_order >= 0),

  constraint hotels_latitude_check
    check (
      latitude is null
      or latitude between -90 and 90
    ),

  constraint hotels_longitude_check
    check (
      longitude is null
      or longitude between -180 and 180
    )
);

create table if not exists public.hotel_media (
  id uuid primary key default gen_random_uuid(),

  hotel_id uuid not null
    references public.hotels(id)
    on delete cascade,

  media_id uuid not null
    references public.media(id)
    on delete cascade,

  is_cover boolean not null default false,
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),

  constraint hotel_media_unique
    unique (hotel_id, media_id),

  constraint hotel_media_sort_order_check
    check (sort_order >= 0)
);

create table if not exists public.program_hotels (
  id uuid primary key default gen_random_uuid(),

  program_id uuid not null
    references public.programs(id)
    on delete cascade,

  hotel_id uuid not null
    references public.hotels(id)
    on delete restrict,

  nights integer not null default 1,

  room_type_ar text,
  room_type_en text,

  meal_plan_ar text,
  meal_plan_en text,

  check_in_date date,
  check_out_date date,

  notes_ar text,
  notes_en text,

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint program_hotels_nights_check
    check (nights >= 0),

  constraint program_hotels_sort_order_check
    check (sort_order >= 0),

  constraint program_hotels_unique
    unique (program_id, hotel_id)
);

create index if not exists hotels_active_sort_idx
  on public.hotels (
    is_active,
    sort_order
  )
  where deleted_at is null;

create index if not exists hotel_media_hotel_idx
  on public.hotel_media (
    hotel_id,
    sort_order
  );

create index if not exists program_hotels_program_idx
  on public.program_hotels (
    program_id,
    sort_order
  );

create index if not exists program_hotels_hotel_idx
  on public.program_hotels (
    hotel_id
  );

drop trigger if exists set_hotels_updated_at
  on public.hotels;

create trigger set_hotels_updated_at
before update on public.hotels
for each row
execute function public.set_updated_at();

drop trigger if exists set_program_hotels_updated_at
  on public.program_hotels;

create trigger set_program_hotels_updated_at
before update on public.program_hotels
for each row
execute function public.set_updated_at();

alter table public.hotels
  enable row level security;

alter table public.hotel_media
  enable row level security;

alter table public.program_hotels
  enable row level security;

create policy "Public can read active hotels"
on public.hotels
for select
using (
  is_active = true
  and deleted_at is null
);

create policy "Public can read hotel media"
on public.hotel_media
for select
using (
  exists (
    select 1
    from public.hotels h
    where h.id = hotel_media.hotel_id
      and h.is_active = true
      and h.deleted_at is null
  )
);

create policy "Public can read program hotels"
on public.program_hotels
for select
using (
  exists (
    select 1
    from public.programs p
    where p.id = program_hotels.program_id
      and p.status = 'published'
      and p.is_active = true
      and p.deleted_at is null
  )
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
values
  (
    'hotels.read',
    'hotels',
    'read',
    'عرض الفنادق',
    'View hotels',
    'عرض الفنادق وبيانات الإقامة.',
    'View hotels and accommodation data.',
    true,
    10
  ),
  (
    'hotels.manage',
    'hotels',
    'manage',
    'إدارة الفنادق',
    'Manage hotels',
    'إضافة وتعديل وحذف الفنادق وربطها بالبرامج.',
    'Create, update, delete, and link hotels to programs.',
    true,
    20
  )
on conflict (key)
do update set
  module = excluded.module,
  action = excluded.action,
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.role_permissions (
  role_id,
  permission_id
)
select
  r.id,
  p.id
from public.roles r
join public.permissions p
  on p.key in (
    'hotels.read',
    'hotels.manage'
  )
where coalesce(
  to_jsonb(r) ->> 'key',
  to_jsonb(r) ->> 'code',
  to_jsonb(r) ->> 'slug',
  to_jsonb(r) ->> 'name'
) = 'super_admin'
on conflict do nothing;

create policy "Admins can read hotels"
on public.hotels
for select
to authenticated
using (
  public.current_user_has_permission(
    'hotels.read'
  )
  or public.current_user_has_permission(
    'hotels.manage'
  )
);

create policy "Admins can manage hotels"
on public.hotels
for all
to authenticated
using (
  public.current_user_has_permission(
    'hotels.manage'
  )
)
with check (
  public.current_user_has_permission(
    'hotels.manage'
  )
);

create policy "Admins can manage hotel media"
on public.hotel_media
for all
to authenticated
using (
  public.current_user_has_permission(
    'hotels.manage'
  )
)
with check (
  public.current_user_has_permission(
    'hotels.manage'
  )
);

create policy "Admins can manage program hotels"
on public.program_hotels
for all
to authenticated
using (
  public.current_user_has_permission(
    'hotels.manage'
  )
)
with check (
  public.current_user_has_permission(
    'hotels.manage'
  )
);