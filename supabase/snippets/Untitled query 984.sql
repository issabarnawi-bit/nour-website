begin;

set local role authenticated;

set local request.jwt.claim.sub =
  '79640f2c-3dc1-4693-98b4-1251cfe46983';

set local request.jwt.claim.role =
  'authenticated';

select
  auth.uid() as current_user_id,
  public.is_super_admin(auth.uid()) as is_super_admin,
  public.current_user_has_permission(
    'countries.create'
  ) as can_create_country,
  public.current_user_has_permission(
    'media.upload'
  ) as can_upload_media;

rollback;