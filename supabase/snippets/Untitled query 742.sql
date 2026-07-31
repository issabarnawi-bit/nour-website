-- =========================================================
-- NourApp Platform
-- Seed: Permissions
-- =========================================================

insert into public.permissions (
  name,
  code,
  description,
  module_key,
  is_active,
  sort_order
)
values
  ('Countries Read', 'countries.read', 'Permission for countries.read.', 'countries', true, 10),
  ('Countries Create', 'countries.create', 'Permission for countries.create.', 'countries', true, 20),
  ('Countries Update', 'countries.update', 'Permission for countries.update.', 'countries', true, 30),
  ('Countries Publish', 'countries.publish', 'Permission for countries.publish.', 'countries', true, 40),
  ('Countries Delete', 'countries.delete', 'Permission for countries.delete.', 'countries', true, 50),
  ('Programs Read', 'programs.read', 'Permission for programs.read.', 'programs', true, 60),
  ('Programs Create', 'programs.create', 'Permission for programs.create.', 'programs', true, 70),
  ('Programs Update', 'programs.update', 'Permission for programs.update.', 'programs', true, 80),
  ('Programs Publish', 'programs.publish', 'Permission for programs.publish.', 'programs', true, 90),
  ('Programs Delete', 'programs.delete', 'Permission for programs.delete.', 'programs', true, 100),
  ('Media Read', 'media.read', 'Permission for media.read.', 'media', true, 110),
  ('Media Upload', 'media.upload', 'Permission for media.upload.', 'media', true, 120),
  ('Media Update', 'media.update', 'Permission for media.update.', 'media', true, 130),
  ('Media Delete', 'media.delete', 'Permission for media.delete.', 'media', true, 140),
  ('Users Manage', 'users.manage', 'Permission for users.manage.', 'users', true, 150),
  ('Settings Manage', 'settings.manage', 'Permission for settings.manage.', 'settings', true, 160),
  ('Audit Logs Read', 'audit_logs.read', 'Permission for audit_logs.read.', 'audit_logs', true, 170)
on conflict (lower(code)) where deleted_at is null
do update set
  name = excluded.name,
  description = excluded.description,
  module_key = excluded.module_key,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = timezone('utc', now());
