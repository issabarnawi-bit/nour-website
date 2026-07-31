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

export async function listCountries(
  supabase: SupabaseClient,
) {
  return getCountries(supabase);
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
    if (uploadedMedia) {
      try {
        await deleteMedia(supabase, {
          mediaId: uploadedMedia.id,
          bucket: uploadedMedia.bucket,
          path: uploadedMedia.path,
        });
      } catch {
      }
    }

    throw error;
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

    const updatedCountry = await updateCountryRepository(
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
      const { data: oldMedia, error: oldMediaError } =
        await supabase
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
        }
      }
    }

    return updatedCountry;
  } catch (error) {
    if (uploadedMedia) {
      try {
        await deleteMedia(supabase, {
          mediaId: uploadedMedia.id,
          bucket: uploadedMedia.bucket,
          path: uploadedMedia.path,
        });
      } catch {
      }
    }

    throw error;
  }
}
export async function updateCountryStatus(
  supabase: SupabaseClient,
  countryId: string,
  isActive: boolean,
) {
  return updateCountryStatusRepository(
    supabase,
    countryId,
    isActive,
  );
}

export async function softDeleteCountry(
  supabase: SupabaseClient,
  countryId: string,
) {
  return softDeleteCountryRepository(
    supabase,
    countryId,
  );
}
export async function restoreCountry(
  supabase: SupabaseClient,
  countryId: string,
) {
  return restoreCountryRepository(
    supabase,
    countryId,
  );
}

export async function listDeletedCountries(
  supabase: SupabaseClient,
) {
  return getDeletedCountries(supabase);
}