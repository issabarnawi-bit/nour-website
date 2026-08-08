import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  Hotel,
  HotelMedia,
  HotelFormValues,
} from "../types";

type HotelRow = {
  id: string;

  name_ar: string;
  name_en: string;

  city_ar: string | null;
  city_en: string | null;

  stars: number;

  description_ar: string | null;
  description_en: string | null;

  address_ar: string | null;
  address_en: string | null;

  latitude: number | string | null;
  longitude: number | string | null;

  cover_media_id: string | null;

  is_active: boolean;
  sort_order: number;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type MediaRow = {
  id: string;
  bucket: string;
  path: string;
};

type HotelMediaRow = {
  id: string;
  hotel_id: string;
  media_id: string;
  is_cover: boolean;
  sort_order: number;
};

const hotelColumns = `
  id,
  name_ar,
  name_en,
  city_ar,
  city_en,
  stars,
  description_ar,
  description_en,
  address_ar,
  address_en,
  latitude,
  longitude,
  cover_media_id,
  is_active,
  sort_order,
  created_at,
  updated_at,
  deleted_at
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

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
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

async function getMediaMap(
  supabase: SupabaseClient,
  mediaIds: string[],
) {
  const mediaMap =
    new Map<string, MediaRow>();

  if (mediaIds.length === 0) {
    return mediaMap;
  }

  const uniqueIds = [
    ...new Set(mediaIds),
  ];

  const { data, error } = await supabase
    .from("media")
    .select("id,bucket,path")
    .in("id", uniqueIds)
    .is("deleted_at", null);

  if (error) {
    throw new Error(
      `Failed to load hotel media: ${error.message}`,
    );
  }

  ((data ?? []) as MediaRow[]).forEach(
    (media) => {
      mediaMap.set(media.id, media);
    },
  );

  return mediaMap;
}

async function getHotelGallery(
  supabase: SupabaseClient,
  hotelId: string,
): Promise<HotelMedia[]> {
  const { data, error } = await supabase
    .from("hotel_media")
    .select(`
      id,
      hotel_id,
      media_id,
      is_cover,
      sort_order
    `)
    .eq("hotel_id", hotelId)
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `Failed to load hotel gallery: ${error.message}`,
    );
  }

  const rows =
    (data ?? []) as HotelMediaRow[];

  const mediaMap = await getMediaMap(
    supabase,
    rows.map((row) => row.media_id),
  );

  return rows.map((row) => ({
    id: row.id,
    mediaId: row.media_id,

    publicUrl: getPublicMediaUrl(
      supabase,
      mediaMap.get(row.media_id),
    ),

    isCover: row.is_cover,
    sortOrder: row.sort_order,
  }));
}

async function mapHotel(
  supabase: SupabaseClient,
  row: HotelRow,
): Promise<Hotel> {
  let coverUrl:
    | string
    | undefined;

  if (row.cover_media_id) {
    const mediaMap =
      await getMediaMap(
        supabase,
        [row.cover_media_id],
      );

    coverUrl = getPublicMediaUrl(
      supabase,
      mediaMap.get(
        row.cover_media_id,
      ),
    );
  }

  const gallery =
    await getHotelGallery(
      supabase,
      row.id,
    );

  return {
    id: row.id,

    nameAr: row.name_ar,
    nameEn: row.name_en,

    cityAr: row.city_ar ?? "",
    cityEn: row.city_en ?? "",

    stars: row.stars,

    descriptionAr:
      row.description_ar ?? "",

    descriptionEn:
      row.description_en ?? "",

    addressAr:
      row.address_ar ?? "",

    addressEn:
      row.address_en ?? "",

    latitude:
      normalizeCoordinate(
        row.latitude,
      ),

    longitude:
      normalizeCoordinate(
        row.longitude,
      ),

    coverMediaId:
      row.cover_media_id,

    coverUrl,

    gallery,

    status: row.is_active
      ? "active"
      : "inactive",

    sortOrder:
      row.sort_order,

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  };
}

export async function getHotels(
  supabase: SupabaseClient,
): Promise<Hotel[]> {
  const { data, error } = await supabase
    .from("hotels")
    .select(hotelColumns)
    .is("deleted_at", null)
    .order("sort_order", {
      ascending: true,
    })
    .order("name_en", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `Failed to load hotels: ${error.message}`,
    );
  }

  const rows =
    (data ?? []) as HotelRow[];

  return Promise.all(
    rows.map((row) =>
      mapHotel(supabase, row),
    ),
  );
}

export async function getHotelById(
  supabase: SupabaseClient,
  hotelId: string,
): Promise<Hotel> {
  const { data, error } = await supabase
    .from("hotels")
    .select(hotelColumns)
    .eq("id", hotelId)
    .is("deleted_at", null)
    .single();

  if (error) {
    throw new Error(
      `Failed to load hotel: ${error.message}`,
    );
  }

  return mapHotel(
    supabase,
    data as HotelRow,
  );
}

export async function createHotel(
  supabase: SupabaseClient,
  values: HotelFormValues,
  coverMediaId: string | null,
): Promise<Hotel> {
  const { data, error } = await supabase
    .from("hotels")
    .insert({
      name_ar:
        values.nameAr.trim(),

      name_en:
        values.nameEn.trim(),

      city_ar:
        values.cityAr.trim() ||
        null,

      city_en:
        values.cityEn.trim() ||
        null,

      stars:
        values.stars,

      description_ar:
        values.descriptionAr.trim() ||
        null,

      description_en:
        values.descriptionEn.trim() ||
        null,

      address_ar:
        values.addressAr.trim() ||
        null,

      address_en:
        values.addressEn.trim() ||
        null,

      latitude:
        values.latitude,

      longitude:
        values.longitude,

      cover_media_id:
        coverMediaId,

      is_active:
        values.isActive,

      sort_order:
        values.sortOrder,
    })
    .select(hotelColumns)
    .single();

  if (error) {
    throw new Error(
      `Failed to create hotel: ${error.message}`,
    );
  }

  return mapHotel(
    supabase,
    data as HotelRow,
  );
}

export async function updateHotel(
  supabase: SupabaseClient,
  hotelId: string,
  values: HotelFormValues,
  coverMediaId: string | null,
): Promise<Hotel> {
  const { data, error } = await supabase
    .from("hotels")
    .update({
      name_ar:
        values.nameAr.trim(),

      name_en:
        values.nameEn.trim(),

      city_ar:
        values.cityAr.trim() ||
        null,

      city_en:
        values.cityEn.trim() ||
        null,

      stars:
        values.stars,

      description_ar:
        values.descriptionAr.trim() ||
        null,

      description_en:
        values.descriptionEn.trim() ||
        null,

      address_ar:
        values.addressAr.trim() ||
        null,

      address_en:
        values.addressEn.trim() ||
        null,

      latitude:
        values.latitude,

      longitude:
        values.longitude,

      cover_media_id:
        coverMediaId,

      is_active:
        values.isActive,

      sort_order:
        values.sortOrder,
    })
    .eq("id", hotelId)
    .select(hotelColumns)
    .single();

  if (error) {
    throw new Error(
      `Failed to update hotel: ${error.message}`,
    );
  }

  return mapHotel(
    supabase,
    data as HotelRow,
  );
}

export async function updateHotelStatus(
  supabase: SupabaseClient,
  hotelId: string,
  isActive: boolean,
): Promise<void> {
  const { error } = await supabase
    .from("hotels")
    .update({
      is_active: isActive,
    })
    .eq("id", hotelId);

  if (error) {
    throw new Error(
      `Failed to update hotel status: ${error.message}`,
    );
  }
}

export async function softDeleteHotel(
  supabase: SupabaseClient,
  hotelId: string,
): Promise<void> {
  const { data, error } = await supabase
    .from("hotels")
    .update({
      deleted_at:
        new Date().toISOString(),

      is_active: false,
    })
    .eq("id", hotelId)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to delete hotel: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "Hotel was not found or is already deleted.",
    );
  }
}

export async function restoreHotel(
  supabase: SupabaseClient,
  hotelId: string,
): Promise<void> {
  const { error } = await supabase
    .from("hotels")
    .update({
      deleted_at: null,
      is_active: true,
    })
    .eq("id", hotelId);

  if (error) {
    throw new Error(
      `Failed to restore hotel: ${error.message}`,
    );
  }
}

export async function getDeletedHotels(
  supabase: SupabaseClient,
): Promise<Hotel[]> {
  const { data, error } = await supabase
    .from("hotels")
    .select(hotelColumns)
    .not("deleted_at", "is", null)
    .order("deleted_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `Failed to load deleted hotels: ${error.message}`,
    );
  }

  const rows =
    (data ?? []) as HotelRow[];

  return Promise.all(
    rows.map((row) =>
      mapHotel(supabase, row),
    ),
  );
}

export async function addHotelMedia(
  supabase: SupabaseClient,
  hotelId: string,
  mediaId: string,
  options?: {
    isCover?: boolean;
    sortOrder?: number;
  },
): Promise<void> {
  const isCover =
    options?.isCover ?? false;

  const sortOrder =
    options?.sortOrder ?? 0;

  if (isCover) {
    const { error: resetError } =
      await supabase
        .from("hotel_media")
        .update({
          is_cover: false,
        })
        .eq("hotel_id", hotelId);

    if (resetError) {
      throw new Error(
        `Failed to reset hotel cover image: ${resetError.message}`,
      );
    }
  }

  const { error } = await supabase
    .from("hotel_media")
    .insert({
      hotel_id: hotelId,
      media_id: mediaId,
      is_cover: isCover,
      sort_order: sortOrder,
    });

  if (error) {
    throw new Error(
      `Failed to add hotel media: ${error.message}`,
    );
  }

  if (isCover) {
    const {
      error: coverUpdateError,
    } = await supabase
      .from("hotels")
      .update({
        cover_media_id:
          mediaId,
      })
      .eq("id", hotelId);

    if (coverUpdateError) {
      throw new Error(
        `Failed to update hotel cover: ${coverUpdateError.message}`,
      );
    }
  }
}

export async function removeHotelMedia(
  supabase: SupabaseClient,
  hotelMediaId: string,
): Promise<void> {
  const { data, error } = await supabase
    .from("hotel_media")
    .delete()
    .eq("id", hotelMediaId)
    .select(`
      id,
      hotel_id,
      media_id,
      is_cover
    `)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to remove hotel media: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "Hotel media was not found.",
    );
  }

  if (data.is_cover) {
    await supabase
      .from("hotels")
      .update({
        cover_media_id: null,
      })
      .eq(
        "id",
        data.hotel_id,
      );
  }
}