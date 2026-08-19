-- =========================================================
-- Nour Platform
-- Legal Content Permissions
-- =========================================================

insert into public.permissions (
  key,
  module,
  action,
  name_ar,
  name_en,
  description_ar,
  description_en,
  is_active,
  sort_order
)
values

(
  'legal.view',
  'legal',
  'view',
  'عرض المحتوى القانوني',
  'View Legal Content',
  'السماح بعرض السياسات والشروط والمحتوى القانوني في لوحة الإدارة',
  'Allows viewing legal policies, terms and legal content in the admin dashboard',
  true,
  1
),

(
  'legal.edit',
  'legal',
  'edit',
  'تعديل المحتوى القانوني',
  'Edit Legal Content',
  'السماح بتعديل مسودات السياسات والشروط والمحتوى القانوني',
  'Allows editing drafts of legal policies, terms and legal content',
  true,
  2
),

(
  'legal.publish',
  'legal',
  'publish',
  'نشر المحتوى القانوني',
  'Publish Legal Content',
  'السماح بنشر نسخ جديدة من السياسات والشروط والمحتوى القانوني',
  'Allows publishing new versions of legal policies, terms and legal content',
  true,
  3
)

on conflict (key)
do update set
  module = excluded.module,
  action = excluded.action,
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();