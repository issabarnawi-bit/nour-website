import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  DeleteMediaInput,
  UploadMediaInput,
} from "../types/media.types";

import {
  uploadMedia as uploadMediaRepository,
} from "../repositories/media.repository";

export async function uploadMedia(
  supabase: SupabaseClient,
  input: UploadMediaInput,
) {
  return uploadMediaRepository(supabase, input);
}

export async function deleteMedia(
  supabase: SupabaseClient,
  input: DeleteMediaInput,
) {
  const {
    data,
    error: softDeleteError,
  } = await supabase.rpc(
    "soft_delete_media_for_cleanup",
    { p_media_id: input.mediaId },
  );

  if (softDeleteError) {
    throw new Error(
      `تعذر حذف سجل الوسائط بشكل آمن: ${softDeleteError.message}`,
    );
  }

  const row = Array.isArray(data)
    ? data[0]
    : data;

  if (!row?.bucket || !row?.path) {
    throw new Error(
      "لم تُرجع قاعدة البيانات مسار ملف الوسائط المطلوب تنظيفه.",
    );
  }

  const { error: storageError } =
    await supabase.storage
      .from(row.bucket)
      .remove([row.path]);

  if (storageError) {
    throw new Error(
      "تم حذف سجل الوسائط منطقيًا، لكن تعذر تنظيف الملف من التخزين. بقيت حالة التنظيف معلّقة لإعادة المحاولة بأمان.",
    );
  }

  const { error: confirmError } =
    await supabase.rpc(
      "confirm_media_storage_cleanup",
      { p_media_id: input.mediaId },
    );

  if (confirmError) {
    throw new Error(
      "تم حذف الملف من التخزين، لكن تعذر تأكيد اكتمال التنظيف في قاعدة البيانات. بقيت الحالة معلّقة ويمكن تسويتها لاحقًا.",
    );
  }
}
