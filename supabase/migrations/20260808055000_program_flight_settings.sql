create type public.program_flight_inclusion as enum (
  'included',
  'excluded',
  'dynamic'
);

alter table public.programs
  add column if not exists flight_inclusion
    public.program_flight_inclusion
    not null
    default 'dynamic',

  add column if not exists flight_notes_ar text,

  add column if not exists flight_notes_en text;

comment on column public.programs.flight_inclusion is
  'Controls whether flight is included, excluded, or dynamically priced at booking time.';

comment on column public.programs.flight_notes_ar is
  'Arabic public note describing the flight pricing/inclusion policy.';

comment on column public.programs.flight_notes_en is
  'English public note describing the flight pricing/inclusion policy.';