-- =========================================================
-- Nour Platform
-- Disable SVG uploads in the public media bucket.
--
-- Production verification before this migration confirmed that
-- there are no active public.media SVG records and no SVG objects
-- currently stored in the media bucket.
-- =========================================================

begin;

update storage.buckets
set allowed_mime_types = array[
  'image/jpeg',
  'image/png',
  'image/webp'
]::text[]
where id = 'media';

commit;
