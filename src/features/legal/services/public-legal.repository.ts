import type { SupabaseClient } from "@supabase/supabase-js";

export type PublishedLegalPage = {
  legalPageId: string;
  pageKey: string;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  version: string;
  publishedAt: string;
};

type PublishedLegalPageRow = {
  legal_page_id: string;
  page_key: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  version: string;
  published_at: string;
};

export async function getPublishedLegalPage(
  supabase: SupabaseClient,
  pageKey: "privacy-policy" | "terms-and-conditions",
): Promise<PublishedLegalPage | null> {
  const { data, error } = await supabase.rpc(
    "get_published_legal_page",
    {
      p_key: pageKey,
    },
  );

  if (error) {
    throw new Error(
      `Unable to load published legal content: ${error.message}`,
    );
  }

  const row = (data?.[0] ?? null) as PublishedLegalPageRow | null;

  if (!row) {
    return null;
  }

  return {
    legalPageId: row.legal_page_id,
    pageKey: row.page_key,
    titleAr: row.title_ar,
    titleEn: row.title_en,
    contentAr: row.content_ar,
    contentEn: row.content_en,
    version: row.version,
    publishedAt: row.published_at,
  };
}