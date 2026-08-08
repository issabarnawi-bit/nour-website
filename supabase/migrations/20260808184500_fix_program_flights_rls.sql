-- Fix program_flights admin RLS policies
-- Align them with the actual Programs permission keys.

drop policy if exists
  "Admins can manage program flights"
on public.program_flights;

drop policy if exists
  "Admins can read program flights"
on public.program_flights;

drop policy if exists
  "Admins can insert program flights"
on public.program_flights;

drop policy if exists
  "Admins can update program flights"
on public.program_flights;

drop policy if exists
  "Admins can delete program flights"
on public.program_flights;


-- Admin read
create policy
  "Admins can read program flights"
on public.program_flights
for select
to authenticated
using (
  public.current_user_has_permission(
    'programs.create'
  )
  or
  public.current_user_has_permission(
    'programs.update'
  )
  or
  public.current_user_has_permission(
    'programs.publish'
  )
  or
  public.current_user_has_permission(
    'programs.delete'
  )
);


-- Create flight rows
create policy
  "Admins can insert program flights"
on public.program_flights
for insert
to authenticated
with check (
  public.current_user_has_permission(
    'programs.create'
  )
  or
  public.current_user_has_permission(
    'programs.update'
  )
);


-- Update flight rows
create policy
  "Admins can update program flights"
on public.program_flights
for update
to authenticated
using (
  public.current_user_has_permission(
    'programs.update'
  )
)
with check (
  public.current_user_has_permission(
    'programs.update'
  )
);


-- Remove / replace flight rows while editing a program
create policy
  "Admins can delete program flights"
on public.program_flights
for delete
to authenticated
using (
  public.current_user_has_permission(
    'programs.update'
  )
  or
  public.current_user_has_permission(
    'programs.delete'
  )
);