grant usage on schema public to authenticated;

grant select
on table public.admin_profiles
to authenticated;

grant select
on table public.admin_user_roles
to authenticated;

grant select
on table public.roles
to authenticated;

grant execute
on function public.is_super_admin(uuid)
to authenticated;