create or replace function public.is_super_admin(
  user_id uuid default auth.uid()
)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_user_roles aur
    join public.roles r
      on r.id = aur.role_id
    where aur.user_id = $1
      and aur.deleted_at is null
      and r.code = 'super_admin'
      and r.is_active = true
      and r.deleted_at is null
  );
$$;

grant execute
on function public.is_super_admin(uuid)
to authenticated;