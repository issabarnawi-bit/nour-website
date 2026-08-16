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
  'applications.view',
  'applications',
  'view',
  'عرض طلبات الانضمام',
  'View Job Applications',
  'السماح بعرض طلبات الانضمام والتوظيف.',
  'Allows viewing job and join-us applications.',
  true,
  310
),
(
  'applications.manage',
  'applications',
  'manage',
  'إدارة طلبات الانضمام',
  'Manage Job Applications',
  'السماح بإدارة حالات وملاحظات طلبات الانضمام.',
  'Allows managing job application status and notes.',
  true,
  311
),
(
  'partners.view',
  'partners',
  'view',
  'عرض طلبات الشراكة',
  'View Partner Applications',
  'السماح بعرض طلبات الشراكة.',
  'Allows viewing partner applications.',
  true,
  320
),
(
  'partners.manage',
  'partners',
  'manage',
  'إدارة طلبات الشراكة',
  'Manage Partner Applications',
  'السماح بإدارة حالات وملاحظات طلبات الشراكة.',
  'Allows managing partner application status and notes.',
  true,
  321
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