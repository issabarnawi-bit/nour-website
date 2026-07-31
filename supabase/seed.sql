-- =========================================================
-- NourApp Platform
-- Roles seed
-- Compatible with the normalized RBAC schema
-- =========================================================

insert into public.roles (
  id,
  key,
  name_ar,
  name_en,
  description_ar,
  description_en,
  is_active,
  sort_order,
  created_at,
  updated_at,
  deleted_at
)
values
  (
    '37601ddf-d590-4ceb-8808-de0a7ce35327',
    'super_admin',
    'المدير الأعلى',
    'Super Admin',
    'صلاحيات كاملة لإدارة المنصة.',
    'Full platform administration access.',
    true,
    10,
    now(),
    now(),
    null
  ),
  (
    'e861ec46-ffb9-467b-a27f-8e44e8bce585',
    'admin',
    'مدير',
    'Admin',
    'إدارة معظم وحدات المنصة.',
    'Manage most platform modules.',
    true,
    20,
    now(),
    now(),
    null
  ),
  (
    'f08deaf1-aace-4934-88b4-ed5c3d22aca7',
    'content_manager',
    'مدير المحتوى',
    'Content Manager',
    'إدارة ونشر محتوى الموقع.',
    'Manage and publish website content.',
    true,
    30,
    now(),
    now(),
    null
  ),
  (
    'b18424d0-cbf5-4ff4-aba2-bc90f77f575a',
    'operations_manager',
    'مدير العمليات',
    'Operations Manager',
    'إدارة المحتوى التشغيلي والخدمات.',
    'Manage operational content and services.',
    true,
    40,
    now(),
    now(),
    null
  ),
  (
    '0b83557d-599a-40ac-82d5-6d1e263acee2',
    'viewer',
    'مستعرض',
    'Viewer',
    'صلاحية قراءة فقط.',
    'Read-only access.',
    true,
    50,
    now(),
    now(),
    null
  )
on conflict (id)
do update set
  key = excluded.key,
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now(),
  deleted_at = null;