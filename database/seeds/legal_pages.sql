-- =========================================================
-- Nour Platform
-- Legal Pages Seed
-- =========================================================

insert into public.legal_pages (
  key,
  title_ar,
  title_en,
  content_ar,
  content_en,
  version,
  status,
  is_active,
  sort_order
)
values

(
  'privacy-policy',
  'سياسة الخصوصية',
  'Privacy Policy',
  '',
  '',
  '1.0',
  'draft',
  true,
  1
),

(
  'terms-and-conditions',
  'الشروط والأحكام',
  'Terms and Conditions',
  '',
  '',
  '1.0',
  'draft',
  true,
  2
)

on conflict (key)
do update set
  title_ar = excluded.title_ar,
  title_en = excluded.title_en,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();