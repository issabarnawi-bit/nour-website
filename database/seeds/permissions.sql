-- =========================================================
-- NourApp Platform
-- Seed: Permissions
-- Compatible with normalized RBAC schema
-- =========================================================

insert into public.permissions (
  key,
  module,
  action,
  name_ar,
  name_en,
  description_ar,
  description_en
)
values
  ('media.read', 'media', 'read', 'عرض الوسائط', 'Media Read', 'عرض سجلات الوسائط.', 'View media records.'),
  ('media.upload', 'media', 'upload', 'رفع الوسائط', 'Media Upload', 'رفع وإنشاء ملفات الوسائط.', 'Upload and create media records.'),
  ('media.update', 'media', 'update', 'تعديل الوسائط', 'Media Update', 'تعديل سجلات الوسائط.', 'Update media records.'),
  ('media.delete', 'media', 'delete', 'حذف الوسائط', 'Media Delete', 'حذف سجلات الوسائط.', 'Delete media records.'),
  ('countries.read', 'countries', 'read', 'عرض الدول', 'Countries Read', 'عرض الدول.', 'View countries.'),
  ('countries.create', 'countries', 'create', 'إضافة الدول', 'Countries Create', 'إضافة دول جديدة.', 'Create countries.'),
  ('countries.update', 'countries', 'update', 'تعديل الدول', 'Countries Update', 'تعديل بيانات الدول.', 'Update countries.'),
  ('countries.delete', 'countries', 'delete', 'حذف الدول', 'Countries Delete', 'حذف الدول.', 'Delete countries.'),
  ('programs.read', 'programs', 'read', 'عرض البرامج', 'Programs Read', 'عرض البرامج.', 'View programs.'),
  ('programs.create', 'programs', 'create', 'إضافة البرامج', 'Programs Create', 'إضافة برامج جديدة.', 'Create programs.'),
  ('programs.update', 'programs', 'update', 'تعديل البرامج', 'Programs Update', 'تعديل بيانات البرامج.', 'Update programs.'),
  ('programs.publish', 'programs', 'publish', 'نشر البرامج', 'Programs Publish', 'نشر البرامج وإلغاء نشرها.', 'Publish and unpublish programs.'),
  ('programs.delete', 'programs', 'delete', 'حذف البرامج', 'Programs Delete', 'حذف البرامج.', 'Delete programs.')
on conflict (key)
do update set
  module = excluded.module,
  action = excluded.action,
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  updated_at = now();
