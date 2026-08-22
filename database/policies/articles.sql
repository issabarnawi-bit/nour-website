-- Nour Platform — Articles / Knowledge Center RLS source

alter table public.article_categories enable row level security;
alter table public.articles enable row level security;

-- Public readers only see active, non-deleted categories.
drop policy if exists "article_categories_public_read" on public.article_categories;
create policy "article_categories_public_read"
on public.article_categories
for select
to anon, authenticated
using (is_active = true and deleted_at is null);

-- Admins with articles.read can see every category, including inactive/deleted records.
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

-- Public readers only see content that is explicitly published and active.
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

-- Admins with articles.read can inspect drafts, archived, inactive, and soft-deleted content.
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
