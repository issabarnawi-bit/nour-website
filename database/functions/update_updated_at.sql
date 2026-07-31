-- =========================================================
-- NourApp Platform
-- Function: set_updated_at
-- Purpose: Automatically refresh updated_at on row updates
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;