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

type Coordinates = {
  latitude: number;
  longitude: number;
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

/**
 * Visual centers used only by the public world-map experience.
 *
 * The production countries table keeps its original geographic coordinates.
 * These overrides compensate for country shape / map projection so markers sit
 * visually near the center of each country on the equirectangular SVG map.
 *
 * Some legacy country rows currently contain non-standard ISO2 values, so the
 * lookup also supports normalized English/Arabic names until those records are
 * reconciled separately.
 */
const VISUAL_MAP_CENTERS: Record<string, Coordinates> = {
  "sa": { latitude: 23.8859, longitude: 45.0792 },
  "saudi arabia": { latitude: 23.8859, longitude: 45.0792 },
  "السعودية": { latitude: 23.8859, longitude: 45.0792 },

  "sd": { latitude: 15.6, longitude: 30.4 },
  "su": { latitude: 15.6, longitude: 30.4 },
  "sudan": { latitude: 15.6, longitude: 30.4 },
  "sudan n": { latitude: 15.6, longitude: 30.4 },
  "السودان": { latitude: 15.6, longitude: 30.4 },

  "jo": { latitude: 31.24, longitude: 36.51 },
  "ju": { latitude: 31.24, longitude: 36.51 },
  "jordan": { latitude: 31.24, longitude: 36.51 },
  "jurdan": { latitude: 31.24, longitude: 36.51 },
  "الاردن": { latitude: 31.24, longitude: 36.51 },
  "الأردن": { latitude: 31.24, longitude: 36.51 },

  "es": { latitude: 40.25, longitude: -3.72 },
  "ss": { latitude: 40.25, longitude: -3.72 },
  "spain": { latitude: 40.25, longitude: -3.72 },
  "sbain": { latitude: 40.25, longitude: -3.72 },
  "اسبانيا": { latitude: 40.25, longitude: -3.72 },
  "إسبانيا": { latitude: 40.25, longitude: -3.72 },

  "ca": { latitude: 56.13, longitude: -106.35 },
  "canada": { latitude: 56.13, longitude: -106.35 },
  "كندا": { latitude: 56.13, longitude: -106.35 },

  "ng": { latitude: 9.08, longitude: 8.68 },
  "nj": { latitude: 9.08, longitude: 8.68 },
  "nigeria": { latitude: 9.08, longitude: 8.68 },
  "نيجيريا": { latitude: 9.08, longitude: 8.68 },
};

const STANDARD_FLAG_CODES: Record<string, string> = {
  "sa": "SA",
  "saudi arabia": "SA",
  "السعودية": "SA",
  "sd": "SD",
  "su": "SD",
  "sudan": "SD",
  "sudan n": "SD",
  "السودان": "SD",
  "jo": "JO",
  "ju": "JO",
  "jordan": "JO",
  "jurdan": "JO",
  "الاردن": "JO",
  "الأردن": "JO",
  "es": "ES",
  "ss": "ES",
  "spain": "ES",
  "sbain": "ES",
  "اسبانيا": "ES",
  "إسبانيا": "ES",
  "ca": "CA",
  "canada": "CA",
  "كندا": "CA",
  "ng": "NG",
  "nj": "NG",
  "nigeria": "NG",
  "نيجيريا": "NG",
};

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

function normalizeMapLookup(value: string | null | undefined): string {
  return (value ?? "")
    .trim()
    .toLocaleLowerCase("en-US");
}

function getVisualMapCoordinates(
  country: PublicCountryRow,
  latitude: number,
  longitude: number,
): Coordinates {
  const lookupKeys = [
    country.iso2,
    country.name_en,
    country.name_ar,
  ]
    .map(normalizeMapLookup)
    .filter(Boolean);

  for (const key of lookupKeys) {
    const override = VISUAL_MAP_CENTERS[key];
    if (override) return override;
  }

  return { latitude, longitude };
}

function getCountryFlagCode(country: PublicCountryRow): string | undefined {
  const lookupKeys = [country.iso2, country.name_en, country.name_ar]
    .map(normalizeMapLookup)
    .filter(Boolean);

  for (const key of lookupKeys) {
    const code = STANDARD_FLAG_CODES[key];
    if (code) return code;
  }

  const rawIso2 = (country.iso2 ?? "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(rawIso2) ? rawIso2 : undefined;
}

function countryCodeToEmoji(code: string): string {
  return [...code.toUpperCase()]
    .map((character) => String.fromCodePoint(127397 + character.charCodeAt(0)))
    .join("");
}

function getFallbackFlagDataUrl(country: PublicCountryRow): string | undefined {
  const code = getCountryFlagCode(country);
  if (!code) return undefined;

  const emoji = countryCodeToEmoji(code);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="44" viewBox="0 0 64 44"><rect width="64" height="44" rx="6" fill="#ffffff"/><text x="32" y="31" text-anchor="middle" font-size="30">${emoji}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
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
      const sourceLatitude =
        normalizeCoordinate(
          country.latitude,
        ) as number;

      const sourceLongitude =
        normalizeCoordinate(
          country.longitude,
        ) as number;

      const { latitude, longitude } =
        getVisualMapCoordinates(
          country,
          sourceLatitude,
          sourceLongitude,
        );

      const programCount =
        programCounts.get(country.id) ??
        0;

      const media =
        country.flag_media_id
          ? mediaMap.get(
              country.flag_media_id,
            )
          : undefined;

      const storedFlagUrl = getPublicMediaUrl(
        supabase,
        media,
      );

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

        flagUrl: storedFlagUrl ?? getFallbackFlagDataUrl(country),

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
