-- Nour Platform — Articles / Knowledge Center schema source

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

create trigger article_categories_set_updated_at
before update on public.article_categories
for each row execute function public.set_updated_at();

create trigger articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();
