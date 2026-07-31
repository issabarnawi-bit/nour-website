-- =========================================================
-- NourApp Platform
-- Seed: Countries
-- =========================================================

insert into public.countries (
  name_ar,
  name_en,
  iso2,
  iso3,
  phone_code,
  currency_code,
  currency_name_ar,
  currency_name_en,
  timezone,
  is_active,
  sort_order
)
values
  (
    'المملكة العربية السعودية',
    'Saudi Arabia',
    'SA',
    'SAU',
    '+966',
    'SAR',
    'ريال سعودي',
    'Saudi Riyal',
    'Asia/Riyadh',
    true,
    10
  ),
  (
    'نيجيريا',
    'Nigeria',
    'NG',
    'NGA',
    '+234',
    'NGN',
    'نايرا نيجيرية',
    'Nigerian Naira',
    'Africa/Lagos',
    true,
    20
  ),
  (
    'باكستان',
    'Pakistan',
    'PK',
    'PAK',
    '+92',
    'PKR',
    'روبية باكستانية',
    'Pakistani Rupee',
    'Asia/Karachi',
    true,
    30
  )
on conflict (lower(iso2)) where deleted_at is null
do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  iso3 = excluded.iso3,
  phone_code = excluded.phone_code,
  currency_code = excluded.currency_code,
  currency_name_ar = excluded.currency_name_ar,
  currency_name_en = excluded.currency_name_en,
  timezone = excluded.timezone,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = timezone('utc', now());