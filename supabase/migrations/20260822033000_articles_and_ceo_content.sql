-- Nour Platform — Articles CMS + CEO content foundation
-- Database-first migration. CEO message is stored in existing public.site_settings.

begin;

create table if not exists public.article_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  description_ar text,
  description_en text,
  is_active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_ar text not null,
  title_en text not null,
  excerpt_ar text,
  excerpt_en text,
  content_ar text not null,
  content_en text not null,
  category_id uuid references public.article_categories(id) on delete set null,
  cover_media_id uuid references public.media(id) on delete set null,
  author_name_ar text,
  author_name_en text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  is_featured boolean not null default false,
  is_active boolean not null default true,
  published_at timestamptz,
  seo_title_ar text,
  seo_title_en text,
  seo_description_ar text,
  seo_description_en text,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint articles_published_requires_date check (
    status <> 'published' or published_at is not null
  )
);

create index if not exists article_categories_active_sort_idx
  on public.article_categories (is_active, sort_order)
  where deleted_at is null;

create index if not exists articles_public_listing_idx
  on public.articles (status, is_active, is_featured, published_at desc, sort_order)
  where deleted_at is null;

create index if not exists articles_category_idx
  on public.articles (category_id)
  where deleted_at is null;

create index if not exists articles_tags_gin_idx
  on public.articles using gin (tags);

drop trigger if exists article_categories_set_updated_at on public.article_categories;
create trigger article_categories_set_updated_at
before update on public.article_categories
for each row execute function public.set_updated_at();

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

alter table public.article_categories enable row level security;
alter table public.articles enable row level security;

-- Explicit grants; RLS remains the authorization boundary.
revoke all on table public.article_categories from public, anon, authenticated;
revoke all on table public.articles from public, anon, authenticated;
grant select on table public.article_categories to anon, authenticated;
grant select on table public.articles to anon, authenticated;
grant insert, update, delete on table public.article_categories to authenticated;
grant insert, update, delete on table public.articles to authenticated;

drop policy if exists "article_categories_public_read" on public.article_categories;
create policy "article_categories_public_read"
on public.article_categories
for select
to anon, authenticated
using (is_active = true and deleted_at is null);

drop policy if exists "article_categories_admin_read" on public.article_categories;
create policy "article_categories_admin_read"
on public.article_categories
for select
to authenticated
using (public.current_user_has_permission('articles.read'));

drop policy if exists "article_categories_admin_insert" on public.article_categories;
create policy "article_categories_admin_insert"
on public.article_categories
for insert
to authenticated
with check (public.current_user_has_permission('articles.manage'));

drop policy if exists "article_categories_admin_update" on public.article_categories;
create policy "article_categories_admin_update"
on public.article_categories
for update
to authenticated
using (public.current_user_has_permission('articles.manage'))
with check (public.current_user_has_permission('articles.manage'));

drop policy if exists "article_categories_admin_delete" on public.article_categories;
create policy "article_categories_admin_delete"
on public.article_categories
for delete
to authenticated
using (public.current_user_has_permission('articles.manage'));

drop policy if exists "articles_public_read" on public.articles;
create policy "articles_public_read"
on public.articles
for select
to anon, authenticated
using (
  status = 'published'
  and is_active = true
  and deleted_at is null
  and published_at is not null
  and published_at <= now()
);

drop policy if exists "articles_admin_read" on public.articles;
create policy "articles_admin_read"
on public.articles
for select
to authenticated
using (public.current_user_has_permission('articles.read'));

drop policy if exists "articles_admin_insert" on public.articles;
create policy "articles_admin_insert"
on public.articles
for insert
to authenticated
with check (public.current_user_has_permission('articles.manage'));

drop policy if exists "articles_admin_update" on public.articles;
create policy "articles_admin_update"
on public.articles
for update
to authenticated
using (public.current_user_has_permission('articles.manage'))
with check (public.current_user_has_permission('articles.manage'));

drop policy if exists "articles_admin_delete" on public.articles;
create policy "articles_admin_delete"
on public.articles
for delete
to authenticated
using (public.current_user_has_permission('articles.manage'));

-- RBAC permissions for the new CMS module.
insert into public.permissions (
  key, module, action, name_ar, name_en,
  description_ar, description_en, is_active, sort_order
)
values
  (
    'articles.read', 'articles', 'read', 'عرض المقالات', 'View articles',
    'عرض المقالات والتصنيفات في لوحة الإدارة',
    'View articles and categories in the admin dashboard',
    true, 150
  ),
  (
    'articles.manage', 'articles', 'manage', 'إدارة المقالات', 'Manage articles',
    'إنشاء وتعديل ونشر وأرشفة المقالات والتصنيفات',
    'Create, edit, publish, archive articles and categories',
    true, 151
  )
on conflict (key) do update set
  module = excluded.module,
  action = excluded.action,
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  is_active = true,
  deleted_at = null,
  updated_at = now();

-- Super admin receives the new permissions automatically.
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.key in ('articles.read', 'articles.manage')
where r.key = 'super_admin'
  and r.deleted_at is null
  and not exists (
    select 1
    from public.role_permissions rp
    where rp.role_id = r.id
      and rp.permission_id = p.id
  );

-- CEO message uses the existing settings CMS instead of introducing another table.
-- It starts disabled until real approved content is entered from Admin Settings.
insert into public.site_settings (key, value_json, group_key, is_public)
values (
  'home.ceo_message',
  jsonb_build_object(
    'enabled', false,
    'name_ar', '',
    'name_en', '',
    'title_ar', 'الرئيس التنفيذي',
    'title_en', 'Chief Executive Officer',
    'message_ar', '',
    'message_en', '',
    'image_media_id', null
  ),
  'home_content',
  true
)
on conflict (key) do nothing;

commit;
