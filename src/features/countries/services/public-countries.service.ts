import type { SupabaseClient } from "@supabase/supabase-js";

export type PublicCountry = {
  id: string;

  nameAr: string;
  nameEn: string;

  iso2: string;
  iso3: string;

  latitude: number;
  longitude: number;

  flagMediaId: string | null;
  flagUrl?: string;

  publishedProgramsCount: number;
  hasPublishedPrograms: boolean;

  sortOrder: number;
};

type PublicCountryRow = {
  id: string;

  name_ar: string;
  name_en: string;

  iso2: string;
  iso3: string;

  latitude: number | string | null;
  longitude: number | string | null;

  flag_media_id: string | null;

  sort_order: number;
};

type ProgramCountryRow = {
  country_id: string | null;
};

type MediaRow = {
  id: string;
  bucket: string;
  path: string;
};

const publicCountryColumns = `
  id,
  name_ar,
  name_en,
  iso2,
  iso3,
  latitude,
  longitude,
  flag_media_id,
  sort_order
`;

function normalizeCoordinate(
  value: number | string | null,
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue)
    ? parsedValue
    : null;
}

function getPublicMediaUrl(
  supabase: SupabaseClient,
  media?: Pick<MediaRow, "bucket" | "path">,
): string | undefined {
  if (!media) {
    return undefined;
  }

  const { data } = supabase.storage
    .from(media.bucket)
    .getPublicUrl(media.path);

  return data.publicUrl || undefined;
}

async function getCountryFlagsMap(
  supabase: SupabaseClient,
  mediaIds: string[],
): Promise<Map<string, MediaRow>> {
  const mediaMap = new Map<string, MediaRow>();

  if (mediaIds.length === 0) {
    return mediaMap;
  }

  const uniqueMediaIds = [
    ...new Set(mediaIds),
  ];

  const { data, error } = await supabase
    .from("media")
    .select("id,bucket,path")
    .in("id", uniqueMediaIds)
    .is("deleted_at", null);

  if (error) {
    throw new Error(
      `Failed to load public country flags: ${error.message}`,
    );
  }

  (
    (data ?? []) as MediaRow[]
  ).forEach((media) => {
    mediaMap.set(media.id, media);
  });

  return mediaMap;
}

async function getPublishedProgramCounts(
  supabase: SupabaseClient,
): Promise<Map<string, number>> {
  const { data, error } = await supabase
    .from("programs")
    .select("country_id")
    .eq("status", "published")
    .eq("is_active", true)
    .is("deleted_at", null)
    .not("country_id", "is", null);

  if (error) {
    throw new Error(
      `Failed to load published program counts: ${error.message}`,
    );
  }

  const counts = new Map<string, number>();

  (
    (data ?? []) as ProgramCountryRow[]
  ).forEach((program) => {
    if (!program.country_id) {
      return;
    }

    counts.set(
      program.country_id,
      (counts.get(program.country_id) ?? 0) + 1,
    );
  });

  return counts;
}

export async function getPublicCountries(
  supabase: SupabaseClient,
): Promise<PublicCountry[]> {
  const { data, error } = await supabase
    .from("countries")
    .select(publicCountryColumns)
    .eq("is_active", true)
    .is("deleted_at", null)
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .order("sort_order", {
      ascending: true,
    })
    .order("name_en", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `Failed to load public countries: ${error.message}`,
    );
  }

  const countryRows =
    (data ?? []) as PublicCountryRow[];

  const validCountryRows = countryRows.filter(
    (country) => {
      const latitude = normalizeCoordinate(
        country.latitude,
      );

      const longitude = normalizeCoordinate(
        country.longitude,
      );

      return (
        latitude !== null &&
        longitude !== null &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180
      );
    },
  );

  const mediaIds = validCountryRows
    .map(
      (country) =>
        country.flag_media_id,
    )
    .filter(
      (mediaId): mediaId is string =>
        typeof mediaId === "string",
    );

  const [
    mediaMap,
    programCounts,
  ] = await Promise.all([
    getCountryFlagsMap(
      supabase,
      mediaIds,
    ),

    getPublishedProgramCounts(
      supabase,
    ),
  ]);

  return validCountryRows.map(
    (country) => {
      const latitude =
        normalizeCoordinate(
          country.latitude,
        ) as number;

      const longitude =
        normalizeCoordinate(
          country.longitude,
        ) as number;

      const programCount =
        programCounts.get(country.id) ??
        0;

      const media =
        country.flag_media_id
          ? mediaMap.get(
              country.flag_media_id,
            )
          : undefined;

      return {
        id: country.id,

        nameAr: country.name_ar,
        nameEn: country.name_en,

        iso2: country.iso2,
        iso3: country.iso3,

        latitude,
        longitude,

        flagMediaId:
          country.flag_media_id,

        flagUrl: getPublicMediaUrl(
          supabase,
          media,
        ),

        publishedProgramsCount:
          programCount,

        hasPublishedPrograms:
          programCount > 0,

        sortOrder:
          country.sort_order,
      };
    },
  );
}

export async function getPublicCountryById(
  supabase: SupabaseClient,
  countryId: string,
): Promise<PublicCountry | null> {
  const countries =
    await getPublicCountries(supabase);

  return (
    countries.find(
      (country) =>
        country.id === countryId,
    ) ?? null
  );
}