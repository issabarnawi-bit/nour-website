-- Reconcile CEO message with the production platform_settings CMS.
-- platform_settings is the existing RLS/RBAC-backed settings source used by Admin.

begin;

insert into public.platform_settings (
  setting_key,
  setting_group,
  value_type,
  value_json,
  label_ar,
  label_en,
  description_ar,
  description_en,
  validation_rules,
  is_public,
  is_required,
  is_active,
  sort_order
)
select
  'home.ceo_message',
  'general'::public.platform_setting_group,
  'json'::public.platform_setting_value_type,
  coalesce(
    (select ss.value_json from public.site_settings ss where ss.key = 'home.ceo_message' limit 1),
    jsonb_build_object(
      'enabled', false,
      'name_ar', '',
      'name_en', '',
      'title_ar', 'الرئيس التنفيذي',
      'title_en', 'Chief Executive Officer',
      'message_ar', '',
      'message_en', '',
      'image_media_id', null
    )
  ),
  'كلمة الرئيس التنفيذي',
  'CEO Message',
  'محتوى كلمة الرئيس التنفيذي المعروضة في الصفحة الرئيسية.',
  'Chief Executive Officer message displayed on the homepage.',
  '{}'::jsonb,
  true,
  false,
  true,
  95
on conflict (setting_key) do update set
  value_type = excluded.value_type,
  value_json = excluded.value_json,
  label_ar = excluded.label_ar,
  label_en = excluded.label_en,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  is_public = true,
  is_active = true,
  deleted_at = null,
  updated_at = now();

-- Remove the temporary duplicate source created by the first foundation migration.
delete from public.site_settings
where key = 'home.ceo_message';

commit;
