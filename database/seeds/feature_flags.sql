-- =========================================================
-- NourApp Platform
-- Seed: Feature Flags
-- =========================================================

insert into public.feature_flags (
  key,
  name,
  description,
  is_enabled,
  config_json,
  sort_order
)
values
  ('world_map', 'World Map', 'Interactive country map.', true, '{}'::jsonb, 10),
  ('programs', 'Programs', 'Umrah programs and packages.', true, '{}'::jsonb, 20),
  ('hotels', 'Hotels', 'Hotel catalog and availability.', false, '{}'::jsonb, 30),
  ('payments', 'Payments', 'Payment processing features.', false, '{}'::jsonb, 40),
  ('testimonials', 'Testimonials', 'Customer testimonials.', true, '{}'::jsonb, 50),
  ('booking', 'Booking', 'Booking workflows.', false, '{}'::jsonb, 60),
  ('partner_portal', 'Partner Portal', 'Partner self-service portal.', false, '{}'::jsonb, 70),
  ('ai_assistant', 'AI Assistant', 'AI-assisted user and admin experiences.', false, '{}'::jsonb, 80)
on conflict (key)
do update set
  name = excluded.name,
  description = excluded.description,
  is_enabled = excluded.is_enabled,
  config_json = excluded.config_json,
  sort_order = excluded.sort_order,
  updated_at = timezone('utc', now());
