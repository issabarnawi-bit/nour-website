select
  p.id,
  p.title_ar,
  p.cover_media_id,
  m.bucket,
  m.path
from public.programs p
left join public.media m
  on m.id = p.cover_media_id
where p.deleted_at is null
order by p.created_at desc;