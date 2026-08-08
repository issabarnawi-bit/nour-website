alter table public.countries
  add column if not exists latitude numeric(9,6),
  add column if not exists longitude numeric(9,6);

alter table public.countries
  drop constraint if exists countries_latitude_range_check;

alter table public.countries
  add constraint countries_latitude_range_check
  check (
    latitude is null
    or latitude between -90 and 90
  );

alter table public.countries
  drop constraint if exists countries_longitude_range_check;

alter table public.countries
  add constraint countries_longitude_range_check
  check (
    longitude is null
    or longitude between -180 and 180
  );

comment on column public.countries.latitude is
  'Geographic latitude used to position the country on the public world map.';

comment on column public.countries.longitude is
  'Geographic longitude used to position the country on the public world map.';

create index if not exists countries_public_coordinates_idx
  on public.countries (
    is_active,
    latitude,
    longitude
  )
  where deleted_at is null;