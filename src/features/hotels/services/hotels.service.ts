import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  Hotel,
  HotelFormValues,
} from "../types";

import {
  addHotelMedia,
  createHotel as createHotelRepository,
  getDeletedHotels as getDeletedHotelsRepository,
  getHotelById as getHotelByIdRepository,
  getHotels as getHotelsRepository,
  removeHotelMedia as removeHotelMediaRepository,
  restoreHotel as restoreHotelRepository,
  softDeleteHotel as softDeleteHotelRepository,
  updateHotel as updateHotelRepository,
  updateHotelStatus as updateHotelStatusRepository,
} from "./hotels.repository";

import {
  uploadMedia,
} from "../../media/services/media.service";

type ExistingGalleryItem = {
  id: string;
  mediaId: string;
};

type UpdateHotelInput = {
  values: HotelFormValues;

  currentCoverMediaId?: string | null;

  existingGallery?: ExistingGalleryItem[];

  removedGalleryIds?: string[];
};

async function uploadHotelFile(
  supabase: SupabaseClient,
  file: File,
  options: {
    altAr: string;
    altEn: string;
  },
) {
  return uploadMedia(
    supabase,
    {
      file,
      folder: "hotels",
      altAr: options.altAr,
      altEn: options.altEn,
    },
  );
}

async function uploadCover(
  supabase: SupabaseClient,
  values: HotelFormValues,
) {
  if (!values.coverFile) {
    return null;
  }

  return uploadHotelFile(
    supabase,
    values.coverFile,
    {
      altAr:
        `صورة فندق ${values.nameAr}`,

      altEn:
        `${values.nameEn} hotel image`,
    },
  );
}

async function uploadGallery(
  supabase: SupabaseClient,
  values: HotelFormValues,
) {
  if (
    !values.galleryFiles ||
    values.galleryFiles.length === 0
  ) {
    return [];
  }

  const uploaded = [];

  for (
    let index = 0;
    index <
    values.galleryFiles.length;
    index += 1
  ) {
    const file =
      values.galleryFiles[index];

    const result =
      await uploadHotelFile(
        supabase,
        file,
        {
          altAr:
            `صورة ${
              index + 1
            } لفندق ${
              values.nameAr
            }`,

          altEn:
            `${
              values.nameEn
            } hotel image ${
              index + 1
            }`,
        },
      );

    uploaded.push(result);
  }

  return uploaded;
}

export async function listHotels(
  supabase: SupabaseClient,
): Promise<Hotel[]> {
  return getHotelsRepository(
    supabase,
  );
}

export async function getHotel(
  supabase: SupabaseClient,
  hotelId: string,
): Promise<Hotel> {
  return getHotelByIdRepository(
    supabase,
    hotelId,
  );
}

export async function createHotel(
  supabase: SupabaseClient,
  values: HotelFormValues,
): Promise<Hotel> {
  let coverMediaId:
    | string
    | null = null;

  /*
   * رفع صورة الغلاف.
   */
  const cover =
    await uploadCover(
      supabase,
      values,
    );

  if (cover) {
    coverMediaId =
      cover.media.id;
  }

  /*
   * إنشاء الفندق.
   */
  const hotel =
    await createHotelRepository(
      supabase,
      values,
      coverMediaId,
    );

  /*
   * ربط صورة الغلاف بمعرض الفندق.
   */
  if (coverMediaId) {
    await addHotelMedia(
      supabase,
      hotel.id,
      coverMediaId,
      {
        isCover: true,
        sortOrder: 0,
      },
    );
  }

  /*
   * رفع صور المعرض.
   */
  const gallery =
    await uploadGallery(
      supabase,
      values,
    );

  /*
   * ربط صور المعرض بالفندق.
   */
  for (
    let index = 0;
    index <
    gallery.length;
    index += 1
  ) {
    await addHotelMedia(
      supabase,
      hotel.id,
      gallery[index].media.id,
      {
        isCover: false,
        sortOrder:
          index + 1,
      },
    );
  }

  /*
   * إعادة الفندق بعد اكتمال
   * جميع العلاقات والصور.
   */
  return getHotelByIdRepository(
    supabase,
    hotel.id,
  );
}

export async function updateHotel(
  supabase: SupabaseClient,
  hotelId: string,
  input: UpdateHotelInput,
): Promise<Hotel> {
  const {
    values,

    currentCoverMediaId =
      null,

    existingGallery = [],

    removedGalleryIds = [],
  } = input;

  let coverMediaId =
    currentCoverMediaId;

  /*
   * صورة غلاف جديدة.
   */
  if (values.coverFile) {
    const newCover =
      await uploadCover(
        supabase,
        values,
      );

    if (newCover) {
      coverMediaId =
        newCover.media.id;

      await addHotelMedia(
        supabase,
        hotelId,
        newCover.media.id,
        {
          isCover: true,
          sortOrder: 0,
        },
      );
    }
  }

  /*
   * حذف الصور التي أزيلت
   * من المعرض.
   */
  for (
    const hotelMediaId
    of removedGalleryIds
  ) {
    await removeHotelMediaRepository(
      supabase,
      hotelMediaId,
    );
  }

  /*
   * رفع صور المعرض الجديدة.
   */
  const gallery =
    await uploadGallery(
      supabase,
      values,
    );

  const existingCount =
    existingGallery.filter(
      (item) =>
        !removedGalleryIds.includes(
          item.id,
        ),
    ).length;

  /*
   * ربط الصور الجديدة.
   */
  for (
    let index = 0;
    index <
    gallery.length;
    index += 1
  ) {
    await addHotelMedia(
      supabase,
      hotelId,
      gallery[index].media.id,
      {
        isCover: false,

        sortOrder:
          existingCount +
          index +
          1,
      },
    );
  }

  /*
   * تحديث بيانات الفندق.
   */
  await updateHotelRepository(
    supabase,
    hotelId,
    values,
    coverMediaId,
  );

  return getHotelByIdRepository(
    supabase,
    hotelId,
  );
}

export async function updateHotelStatus(
  supabase: SupabaseClient,
  hotelId: string,
  isActive: boolean,
): Promise<void> {
  return updateHotelStatusRepository(
    supabase,
    hotelId,
    isActive,
  );
}

export async function softDeleteHotel(
  supabase: SupabaseClient,
  hotelId: string,
): Promise<void> {
  return softDeleteHotelRepository(
    supabase,
    hotelId,
  );
}

export async function restoreHotel(
  supabase: SupabaseClient,
  hotelId: string,
): Promise<void> {
  return restoreHotelRepository(
    supabase,
    hotelId,
  );
}

export async function listDeletedHotels(
  supabase: SupabaseClient,
): Promise<Hotel[]> {
  return getDeletedHotelsRepository(
    supabase,
  );
}