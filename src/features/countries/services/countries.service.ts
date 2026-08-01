import type { SupabaseClient } from "@supabase/supabase-js";

import {
  deleteMedia,
  uploadMedia,
} from "../../media";
import type { CountryFormValues } from "../forms/CountryForm";
import {
  createCountry as createCountryRepository,
  getCountries,
  updateCountry as updateCountryRepository,
  updateCountryStatus as updateCountryStatusRepository,
  softDeleteCountry as softDeleteCountryRepository,
  restoreCountry as restoreCountryRepository,
  getDeletedCountries,
} from "./countries.repository";

type UploadedMediaReference = {
  id: string;
  bucket: string;
  path: string;
};

type DatabaseErrorLike = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

function getCountryErrorMessage(error: unknown) {
  const databaseError =
    typeof error === "object" && error !== null
      ? (error as DatabaseErrorLike)
      : null;

  const code = databaseError?.code ?? "";

  const combinedMessage = [
    databaseError?.message,
    databaseError?.details,
    databaseError?.hint,
    error instanceof Error ? error.message : "",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    combinedMessage.includes("uq_countries_iso2") ||
    combinedMessage.includes("countries_iso2")
  ) {
    return "رمز ISO2 مستخدم لدولة أخرى.";
  }

  if (
    combinedMessage.includes("uq_countries_iso3") ||
    combinedMessage.includes("countries_iso3")
  ) {
    return "رمز ISO3 مستخدم لدولة أخرى.";
  }

  if (
    combinedMessage.includes(
      "chk_countries_iso2_format",
    )
  ) {
    return "رمز ISO2 يجب أن يتكون من حرفين إنجليزيين كبيرين.";
  }

  if (
    combinedMessage.includes(
      "chk_countries_iso3_format",
    )
  ) {
    return "رمز ISO3 يجب أن يتكون من ثلاثة أحرف إنجليزية كبيرة.";
  }

  if (
    combinedMessage.includes(
      "chk_countries_sort_order",
    )
  ) {
    return "ترتيب الظهور يجب أن يساوي صفرًا أو أكبر.";
  }

  if (
    code === "23505" ||
    combinedMessage.includes("duplicate key") ||
    combinedMessage.includes("unique constraint")
  ) {
    return "توجد دولة أخرى تحمل البيانات نفسها.";
  }

  if (
    code === "23514" ||
    combinedMessage.includes("check constraint")
  ) {
    return "إحدى قيم الدولة لا تطابق التنسيق المطلوب.";
  }

  if (
    code === "23503" ||
    combinedMessage.includes("foreign key")
  ) {
    return "تعذر ربط الدولة بملف الوسائط المحدد.";
  }

  if (
    code === "42501" ||
    combinedMessage.includes("permission denied") ||
    combinedMessage.includes("row-level security")
  ) {
    return "ليس لديك صلاحية لتنفيذ هذه العملية.";
  }

  if (
    combinedMessage.includes("failed to fetch") ||
    combinedMessage.includes("network")
  ) {
    return "تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت ثم حاول مجددًا.";
  }

  return "تعذر حفظ بيانات الدولة. يرجى مراجعة البيانات والمحاولة مجددًا.";
}

function createCountryServiceError(error: unknown) {
  return new Error(getCountryErrorMessage(error));
}

async function cleanupUploadedMedia(
  supabase: SupabaseClient,
  uploadedMedia: UploadedMediaReference | null,
) {
  if (!uploadedMedia) {
    return;
  }

  try {
    await deleteMedia(supabase, {
      mediaId: uploadedMedia.id,
      bucket: uploadedMedia.bucket,
      path: uploadedMedia.path,
    });
  } catch {
    // لا نمنع إظهار الخطأ الأساسي إذا فشل تنظيف الملف.
  }
}

export async function listCountries(
  supabase: SupabaseClient,
) {
  try {
    return await getCountries(supabase);
  } catch (error) {
    throw createCountryServiceError(error);
  }
}

export async function createCountry(
  supabase: SupabaseClient,
  values: CountryFormValues,
) {
  let uploadedMedia: UploadedMediaReference | null = null;

  try {
    if (values.flagFile) {
      const uploadResult = await uploadMedia(supabase, {
        file: values.flagFile,
        folder: "countries",
        altAr: `علم ${values.nameAr.trim()}`,
        altEn: `${values.nameEn.trim()} flag`,
      });

      uploadedMedia = {
        id: uploadResult.media.id,
        bucket: uploadResult.media.bucket,
        path: uploadResult.media.path,
      };
    }

    return await createCountryRepository(
      supabase,
      values,
      uploadedMedia?.id ?? null,
    );
  } catch (error) {
    await cleanupUploadedMedia(
      supabase,
      uploadedMedia,
    );

    throw createCountryServiceError(error);
  }
}

export async function updateCountry(
  supabase: SupabaseClient,
  countryId: string,
  values: CountryFormValues,
  currentFlagMediaId: string | null,
) {
  let uploadedMedia: UploadedMediaReference | null = null;
  let nextFlagMediaId = currentFlagMediaId;

  try {
    if (values.flagFile) {
      const uploadResult = await uploadMedia(supabase, {
        file: values.flagFile,
        folder: "countries",
        altAr: `علم ${values.nameAr.trim()}`,
        altEn: `${values.nameEn.trim()} flag`,
      });

      uploadedMedia = {
        id: uploadResult.media.id,
        bucket: uploadResult.media.bucket,
        path: uploadResult.media.path,
      };

      nextFlagMediaId = uploadedMedia.id;
    }

    const updatedCountry =
      await updateCountryRepository(
        supabase,
        countryId,
        values,
        nextFlagMediaId,
      );

    if (
      uploadedMedia &&
      currentFlagMediaId &&
      currentFlagMediaId !== uploadedMedia.id
    ) {
      const {
        data: oldMedia,
        error: oldMediaError,
      } = await supabase
        .from("media")
        .select("id,bucket,path")
        .eq("id", currentFlagMediaId)
        .maybeSingle();

      if (!oldMediaError && oldMedia) {
        try {
          await deleteMedia(supabase, {
            mediaId: oldMedia.id,
            bucket: oldMedia.bucket,
            path: oldMedia.path,
          });
        } catch {
          // نجاح تحديث الدولة أهم من فشل حذف العلم القديم.
        }
      }
    }

    return updatedCountry;
  } catch (error) {
    await cleanupUploadedMedia(
      supabase,
      uploadedMedia,
    );

    throw createCountryServiceError(error);
  }
}

export async function updateCountryStatus(
  supabase: SupabaseClient,
  countryId: string,
  isActive: boolean,
) {
  try {
    return await updateCountryStatusRepository(
      supabase,
      countryId,
      isActive,
    );
  } catch (error) {
    throw createCountryServiceError(error);
  }
}

export async function softDeleteCountry(
  supabase: SupabaseClient,
  countryId: string,
) {
  try {
    return await softDeleteCountryRepository(
      supabase,
      countryId,
    );
  } catch (error) {
    throw createCountryServiceError(error);
  }
}

export async function restoreCountry(
  supabase: SupabaseClient,
  countryId: string,
) {
  try {
    return await restoreCountryRepository(
      supabase,
      countryId,
    );
  } catch (error) {
    throw createCountryServiceError(error);
  }
}

export async function listDeletedCountries(
  supabase: SupabaseClient,
) {
  try {
    return await getDeletedCountries(supabase);
  } catch (error) {
    throw createCountryServiceError(error);
  }
}