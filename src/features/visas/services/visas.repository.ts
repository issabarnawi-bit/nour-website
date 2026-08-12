import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  ProgramVisa,
  ProgramVisaFormValue,
  Visa,
  VisaFormValues,
} from "../types/visa";

type VisaRow = {
  id: string;

  name_ar: string;
  name_en: string;

  visa_type: Visa["visaType"];
  processing_type: Visa["processingType"];

  country_id: string | null;

  description_ar: string | null;
  description_en: string | null;

  requirements_ar: string[] | null;
  requirements_en: string[] | null;

  processing_time_days: number | null;
  validity_days: number | null;
  max_stay_days: number | null;

  base_price: number | string | null;
  currency_code: string | null;

  cover_media_id: string | null;

  is_active: boolean;
  sort_order: number;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type ProgramVisaRow = {
  id: string;
  program_id: string;
  visa_id: string;

  is_included: boolean;

  notes_ar: string | null;
  notes_en: string | null;

  sort_order: number;

  created_at: string;
  updated_at: string;

  visa?: VisaRow | null;
};

function mapVisa(
  row: VisaRow,
): Visa {
  return {
    id: row.id,

    nameAr: row.name_ar,
    nameEn: row.name_en,

    visaType: row.visa_type,
    processingType:
      row.processing_type,

    countryId: row.country_id,

    descriptionAr:
      row.description_ar,
    descriptionEn:
      row.description_en,

    requirementsAr:
      row.requirements_ar ?? [],
    requirementsEn:
      row.requirements_en ?? [],

    processingTimeDays:
      row.processing_time_days,
    validityDays:
      row.validity_days,
    maxStayDays:
      row.max_stay_days,

    basePrice:
      row.base_price === null
        ? null
        : Number(row.base_price),
    currencyCode:
      row.currency_code,

    coverMediaId:
      row.cover_media_id,
    coverUrl: null,

    isActive: row.is_active,
    sortOrder: row.sort_order,

    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

function toVisaPayload(
  values: VisaFormValues,
) {
  return {
    name_ar: values.nameAr.trim(),
    name_en: values.nameEn.trim(),

    visa_type: values.visaType,
    processing_type:
      values.processingType,

    country_id:
      values.countryId || null,

    description_ar:
      values.descriptionAr.trim() ||
      null,
    description_en:
      values.descriptionEn.trim() ||
      null,

    requirements_ar:
      values.requirementsAr
        .map((item) => item.trim())
        .filter(Boolean),
    requirements_en:
      values.requirementsEn
        .map((item) => item.trim())
        .filter(Boolean),

    processing_time_days:
      values.processingTimeDays,
    validity_days:
      values.validityDays,
    max_stay_days:
      values.maxStayDays,

    base_price:
      values.basePrice,
    currency_code:
      values.currencyCode.trim()
        ? values.currencyCode
            .trim()
            .toUpperCase()
        : null,

    cover_media_id:
      values.coverMediaId,

    is_active:
      values.isActive,
    sort_order:
      Math.max(
        0,
        values.sortOrder,
      ),
  };
}

export async function getVisas(
  supabase: SupabaseClient,
): Promise<Visa[]> {
  const { data, error } =
    await supabase
      .from("visas")
      .select("*")
      .is("deleted_at", null)
      .order("sort_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    throw error;
  }

  return (
    (data ?? []) as VisaRow[]
  ).map(mapVisa);
}

export async function getDeletedVisas(
  supabase: SupabaseClient,
): Promise<Visa[]> {
  const { data, error } =
    await supabase
      .from("visas")
      .select("*")
      .not("deleted_at", "is", null)
      .order("deleted_at", {
        ascending: false,
      });

  if (error) {
    throw error;
  }

  return (
    (data ?? []) as VisaRow[]
  ).map(mapVisa);
}

export async function getVisaById(
  supabase: SupabaseClient,
  id: string,
): Promise<Visa | null> {
  const { data, error } =
    await supabase
      .from("visas")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();

  if (error) {
    throw error;
  }

  return data
    ? mapVisa(data as VisaRow)
    : null;
}

export async function createVisa(
  supabase: SupabaseClient,
  values: VisaFormValues,
): Promise<Visa> {
  const { data, error } =
    await supabase
      .from("visas")
      .insert(toVisaPayload(values))
      .select("*")
      .single();

  if (error) {
    throw error;
  }

  return mapVisa(
    data as VisaRow,
  );
}

export async function updateVisa(
  supabase: SupabaseClient,
  id: string,
  values: VisaFormValues,
): Promise<Visa> {
  const { data, error } =
    await supabase
      .from("visas")
      .update(toVisaPayload(values))
      .eq("id", id)
      .is("deleted_at", null)
      .select("*")
      .single();

  if (error) {
    throw error;
  }

  return mapVisa(
    data as VisaRow,
  );
}

export async function toggleVisaStatus(
  supabase: SupabaseClient,
  id: string,
  isActive: boolean,
): Promise<void> {
  const { error } =
    await supabase
      .from("visas")
      .update({
        is_active: isActive,
      })
      .eq("id", id)
      .is("deleted_at", null);

  if (error) {
    throw error;
  }
}

export async function softDeleteVisa(
  supabase: SupabaseClient,
  id: string,
): Promise<void> {
  const { error } =
    await supabase
      .from("visas")
      .update({
        deleted_at:
          new Date().toISOString(),
        is_active: false,
      })
      .eq("id", id)
      .is("deleted_at", null);

  if (error) {
    throw error;
  }
}

export async function restoreVisa(
  supabase: SupabaseClient,
  id: string,
): Promise<void> {
  const { error } =
    await supabase
      .from("visas")
      .update({
        deleted_at: null,
        is_active: true,
      })
      .eq("id", id);

  if (error) {
    throw error;
  }
}

function mapProgramVisa(
  row: ProgramVisaRow,
): ProgramVisa {
  return {
    id: row.id,
    programId: row.program_id,
    visaId: row.visa_id,

    isIncluded:
      row.is_included,

    notesAr: row.notes_ar,
    notesEn: row.notes_en,

    sortOrder: row.sort_order,

    createdAt: row.created_at,
    updatedAt: row.updated_at,

    visa:
      row.visa
        ? mapVisa(row.visa)
        : null,
  };
}

export async function getProgramVisas(
  supabase: SupabaseClient,
  programId: string,
): Promise<ProgramVisa[]> {
  const { data, error } =
    await supabase
      .from("program_visas")
      .select(`
        *,
        visa:visas(*)
      `)
      .eq("program_id", programId)
      .order("sort_order", {
        ascending: true,
      });

  if (error) {
    throw error;
  }

  return (
    (data ?? []) as ProgramVisaRow[]
  ).map(mapProgramVisa);
}

export async function replaceProgramVisas(
  supabase: SupabaseClient,
  programId: string,
  values: ProgramVisaFormValue[],
): Promise<void> {
  const { error: deleteError } =
    await supabase
      .from("program_visas")
      .delete()
      .eq("program_id", programId);

  if (deleteError) {
    throw deleteError;
  }

  if (values.length === 0) {
    return;
  }

  const payload = values.map(
    (value, index) => ({
      program_id: programId,
      visa_id: value.visaId,
      is_included:
        value.isIncluded,
      notes_ar:
        value.notesAr.trim() ||
        null,
      notes_en:
        value.notesEn.trim() ||
        null,
      sort_order:
        Number.isFinite(
          value.sortOrder,
        )
          ? value.sortOrder
          : index,
    }),
  );

  const { error: insertError } =
    await supabase
      .from("program_visas")
      .insert(payload);

  if (insertError) {
    throw insertError;
  }
}
