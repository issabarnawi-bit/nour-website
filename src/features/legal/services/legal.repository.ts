import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  LegalPage,
  LegalPageFormValues,
  LegalPageVersion,
} from "../types/legal";

type LegalPageRow = {
  id: string;
  key: string;

  title_ar: string;
  title_en: string;

  content_ar: string;
  content_en: string;

  version: string;
  status: "draft" | "published" | "inactive";

  published_at: string | null;

  is_active: boolean;
  sort_order: number;

  created_at: string;
  updated_at: string;
};

type LegalPageVersionRow = {
  id: string;
  legal_page_id: string;

  version: string;

  title_ar: string;
  title_en: string;

  content_ar: string;
  content_en: string;

  published_at: string;
  published_by: string | null;

  created_at: string;
};

function mapLegalPage(
  row: LegalPageRow,
): LegalPage {
  return {
    id: row.id,
    key: row.key,

    titleAr: row.title_ar,
    titleEn: row.title_en,

    contentAr: row.content_ar,
    contentEn: row.content_en,

    version: row.version,
    status: row.status,

    publishedAt: row.published_at,

    isActive: row.is_active,
    sortOrder: row.sort_order,

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapLegalPageVersion(
  row: LegalPageVersionRow,
): LegalPageVersion {
  return {
    id: row.id,
    legalPageId: row.legal_page_id,

    version: row.version,

    titleAr: row.title_ar,
    titleEn: row.title_en,

    contentAr: row.content_ar,
    contentEn: row.content_en,

    publishedAt: row.published_at,
    publishedBy: row.published_by,

    createdAt: row.created_at,
  };
}

export async function getLegalPages(
  supabase: SupabaseClient,
): Promise<LegalPage[]> {
  const { data, error } =
    await supabase
      .from("legal_pages")
      .select(`
        id,
        key,
        title_ar,
        title_en,
        content_ar,
        content_en,
        version,
        status,
        published_at,
        is_active,
        sort_order,
        created_at,
        updated_at
      `)
      .is("deleted_at", null)
      .order(
        "sort_order",
        {
          ascending: true,
        },
      );

  if (error) {
    throw new Error(
      `تعذر تحميل المحتوى القانوني: ${error.message}`,
    );
  }

  return (
    (data ?? []) as LegalPageRow[]
  ).map(mapLegalPage);
}

export async function getLegalPageById(
  supabase: SupabaseClient,
  legalPageId: string,
): Promise<LegalPage> {
  const { data, error } =
    await supabase
      .from("legal_pages")
      .select(`
        id,
        key,
        title_ar,
        title_en,
        content_ar,
        content_en,
        version,
        status,
        published_at,
        is_active,
        sort_order,
        created_at,
        updated_at
      `)
      .eq(
        "id",
        legalPageId,
      )
      .is(
        "deleted_at",
        null,
      )
      .single();

  if (error) {
    throw new Error(
      `تعذر تحميل المحتوى القانوني: ${error.message}`,
    );
  }

  return mapLegalPage(
    data as LegalPageRow,
  );
}

export async function updateLegalPage(
  supabase: SupabaseClient,
  legalPageId: string,
  values: LegalPageFormValues,
): Promise<LegalPage> {
  const { data, error } =
    await supabase
      .from("legal_pages")
      .update({
        title_ar:
          values.titleAr.trim(),

        title_en:
          values.titleEn.trim(),

        content_ar:
          values.contentAr,

        content_en:
          values.contentEn,

        version:
          values.version.trim(),

        is_active:
          values.isActive,

        status:
          values.isActive
            ? "draft"
            : "inactive",
      })
      .eq(
        "id",
        legalPageId,
      )
      .is(
        "deleted_at",
        null,
      )
      .select(`
        id,
        key,
        title_ar,
        title_en,
        content_ar,
        content_en,
        version,
        status,
        published_at,
        is_active,
        sort_order,
        created_at,
        updated_at
      `)
      .single();

  if (error) {
    throw new Error(
      `تعذر حفظ المحتوى القانوني: ${error.message}`,
    );
  }

  return mapLegalPage(
    data as LegalPageRow,
  );
}

export async function publishLegalPage(
  supabase: SupabaseClient,
  legalPageId: string,
): Promise<string> {
  const { data, error } =
    await supabase.rpc(
      "publish_legal_page",
      {
        p_legal_page_id:
          legalPageId,
      },
    );

  if (error) {
    throw new Error(
      `تعذر نشر المحتوى القانوني: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "لم يتم إنشاء إصدار منشور.",
    );
  }

  return data as string;
}

export async function getLegalPageVersions(
  supabase: SupabaseClient,
  legalPageId: string,
): Promise<LegalPageVersion[]> {
  const { data, error } =
    await supabase
      .from("legal_page_versions")
      .select(`
        id,
        legal_page_id,
        version,
        title_ar,
        title_en,
        content_ar,
        content_en,
        published_at,
        published_by,
        created_at
      `)
      .eq(
        "legal_page_id",
        legalPageId,
      )
      .order(
        "published_at",
        {
          ascending: false,
        },
      );

  if (error) {
    throw new Error(
      `تعذر تحميل سجل الإصدارات: ${error.message}`,
    );
  }

  return (
    (data ?? []) as LegalPageVersionRow[]
  ).map(mapLegalPageVersion);
}