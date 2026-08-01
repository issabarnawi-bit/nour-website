import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  Program,
  ProgramFormValues,
} from "../types";

type CoverMediaRow = {
  bucket: string;
  path: string;
};

type ProgramRow = {
  id: string;
  title_ar: string;
  title_en: string;
  slug: string;
  summary_ar: string;
  summary_en: string;
  description_ar: string;
  description_en: string;
  country_id: string | null;
  duration_days: number;
  duration_nights: number;
  base_price: number | string;
  currency_code: string;
  cover_media_id: string | null;
  cover_media:
    | CoverMediaRow
    | CoverMediaRow[]
    | null;
  status: "draft" | "published" | "inactive";
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

function getCoverMedia(
  coverMedia: ProgramRow["cover_media"],
): CoverMediaRow | null {
  if (!coverMedia) {
    return null;
  }

  if (Array.isArray(coverMedia)) {
    return coverMedia[0] ?? null;
  }

  return coverMedia;
}

function createPublicMediaUrl(
  media: CoverMediaRow | null,
): string | null {
  if (!media) {
    return null;
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return null;
  }

  return `${supabaseUrl}/storage/v1/object/public/${media.bucket}/${media.path}`;
}

function mapProgram(row: ProgramRow): Program {
  const coverMedia = getCoverMedia(
    row.cover_media,
  );

  return {
    id: row.id,
    titleAr: row.title_ar,
    titleEn: row.title_en,
    slug: row.slug,
    summaryAr: row.summary_ar,
    summaryEn: row.summary_en,
    descriptionAr: row.description_ar,
    descriptionEn: row.description_en,
    countryId: row.country_id,
    durationDays: row.duration_days,
    durationNights: row.duration_nights,
    basePrice: Number(row.base_price),
    currencyCode: row.currency_code,
    coverMediaId: row.cover_media_id,
    coverUrl: createPublicMediaUrl(
      coverMedia,
    ),
    status: row.status,
    isFeatured: row.is_featured,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

const programSelect = `
  id,
  title_ar,
  title_en,
  slug,
  summary_ar,
  summary_en,
  description_ar,
  description_en,
  country_id,
  duration_days,
  duration_nights,
  base_price,
  currency_code,
  cover_media_id,
  status,
  is_featured,
  is_active,
  sort_order,
  created_by,
  updated_by,
  created_at,
  updated_at,
  deleted_at,
  cover_media:media!programs_cover_media_id_fkey (
    bucket,
    path
  )
`;

export async function createProgram(
  supabase: SupabaseClient,
  values: ProgramFormValues,
  coverMediaId: string | null = null,
): Promise<Program> {
  const { data, error } = await supabase
    .from("programs")
    .insert({
      title_ar: values.titleAr.trim(),
      title_en: values.titleEn.trim(),
      slug: values.slug.trim(),
      summary_ar: values.summaryAr.trim(),
      summary_en: values.summaryEn.trim(),
      description_ar:
        values.descriptionAr.trim(),
      description_en:
        values.descriptionEn.trim(),
      country_id: values.countryId || null,
      duration_days: values.durationDays,
      duration_nights: values.durationNights,
      base_price: values.basePrice,
      currency_code: values.currencyCode
        .trim()
        .toUpperCase(),
      cover_media_id: coverMediaId,
      status: values.status,
      is_featured: values.isFeatured,
      is_active: values.isActive,
      sort_order: values.sortOrder,
    })
    .select(programSelect)
    .single();

  if (error) {
    throw new Error(
      `تعذر إنشاء البرنامج: ${error.message}`,
    );
  }

  return mapProgram(data as ProgramRow);
}

export async function getPrograms(
  supabase: SupabaseClient,
): Promise<Program[]> {
  const { data, error } = await supabase
    .from("programs")
    .select(programSelect)
    .is("deleted_at", null)
    .order("sort_order", {
      ascending: true,
    })
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `تعذر تحميل البرامج: ${error.message}`,
    );
  }

  return (data as ProgramRow[]).map(
    mapProgram,
  );
}

export async function getProgramById(
  supabase: SupabaseClient,
  programId: string,
): Promise<Program> {
  const { data, error } = await supabase
    .from("programs")
    .select(programSelect)
    .eq("id", programId)
    .is("deleted_at", null)
    .single();

  if (error) {
    throw new Error(
      `تعذر تحميل تفاصيل البرنامج: ${error.message}`,
    );
  }

  return mapProgram(data as ProgramRow);
}

export async function updateProgram(
  supabase: SupabaseClient,
  programId: string,
  values: ProgramFormValues,
  coverMediaId: string | null,
): Promise<Program> {
  const { data, error } = await supabase
    .from("programs")
    .update({
      title_ar: values.titleAr.trim(),
      title_en: values.titleEn.trim(),
      slug: values.slug.trim(),
      summary_ar: values.summaryAr.trim(),
      summary_en: values.summaryEn.trim(),
      description_ar:
        values.descriptionAr.trim(),
      description_en:
        values.descriptionEn.trim(),
      country_id: values.countryId || null,
      duration_days: values.durationDays,
      duration_nights: values.durationNights,
      base_price: values.basePrice,
      currency_code: values.currencyCode
        .trim()
        .toUpperCase(),
      cover_media_id: coverMediaId,
      status: values.status,
      is_featured: values.isFeatured,
      is_active: values.isActive,
      sort_order: values.sortOrder,
    })
    .eq("id", programId)
    .is("deleted_at", null)
    .select(programSelect)
    .maybeSingle();

  if (error) {
    throw new Error(
      `تعذر تحديث البرنامج: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "لم يتم العثور على البرنامج أو ليست لديك صلاحية تعديله.",
    );
  }

  return mapProgram(data as ProgramRow);
}

export async function deleteProgram(
  supabase: SupabaseClient,
  programId: string,
): Promise<void> {
  const { data, error } = await supabase.rpc(
    "soft_delete_program",
    {
      p_program_id: programId,
    },
  );

  if (error) {
    if (
      error.code === "42501" ||
      error.message.includes("صلاحية")
    ) {
      throw new Error(
        "ليس لديك صلاحية حذف هذا البرنامج.",
      );
    }

    throw new Error(
      `تعذر حذف البرنامج: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "لم يتم العثور على البرنامج أو أنه محذوف بالفعل.",
    );
  }
}

export async function getDeletedPrograms(
  supabase: SupabaseClient,
): Promise<Program[]> {
  const { data, error } = await supabase
    .from("programs")
    .select(programSelect)
    .not("deleted_at", "is", null)
    .order("deleted_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `تعذر تحميل البرامج المحذوفة: ${error.message}`,
    );
  }

  return (data as ProgramRow[]).map(
    mapProgram,
  );
}

export async function restoreProgram(
  supabase: SupabaseClient,
  programId: string,
): Promise<void> {
  const { data, error } = await supabase
    .from("programs")
    .update({
      deleted_at: null,
      is_active: false,
      status: "draft",
    })
    .eq("id", programId)
    .not("deleted_at", "is", null)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(
      `تعذر استعادة البرنامج: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "لم يتم العثور على البرنامج داخل سلة المحذوفات أو ليست لديك صلاحية استعادته.",
    );
  }
}

export async function permanentlyDeleteProgram(
  supabase: SupabaseClient,
  programId: string,
): Promise<void> {
  const { data, error } = await supabase
    .from("programs")
    .delete()
    .eq("id", programId)
    .not("deleted_at", "is", null)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(
      `تعذر حذف البرنامج نهائيًا: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "لم يتم العثور على البرنامج داخل سلة المحذوفات أو ليست لديك صلاحية حذفه نهائيًا.",
    );
  }
}