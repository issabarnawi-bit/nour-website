select
  aur.user_id,
  r.code,
  r.name
from public.admin_user_roles aur
join public.roles r
  on r.id = aur.role_id
where aur.deleted_at is null;