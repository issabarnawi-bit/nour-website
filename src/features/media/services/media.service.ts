import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  DeleteMediaInput,
  UploadMediaInput,
} from "../types/media.types";

import {
  uploadMedia as uploadMediaRepository,
} from "../repositories/media.repository";

export type MediaCleanupFailure = {
  mediaId: string;
  bucket: string;
  path: string;
  reason: string;
};

export type MediaCleanupReconciliationResult = {
  inspected: number;
  cleaned: number;
  failed: number;
  failures: MediaCleanupFailure[];
};

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

export async function reconcilePendingMediaStorageCleanup(
  supabase: SupabaseClient,
): Promise<MediaCleanupReconciliationResult> {
  const { data, error } = await supabase.rpc(
    "list_pending_media_storage_cleanup",
  );

  if (error) {
    throw new Error(
      `تعذر تحميل ملفات الوسائط المعلّقة للتنظيف: ${error.message}`,
    );
  }

  const pendingRows = Array.isArray(data) ? data : [];
  const failures: MediaCleanupFailure[] = [];
  let cleaned = 0;

  for (const row of pendingRows) {
    const mediaId = String(row.id ?? "");
    const bucket = String(row.bucket ?? "");
    const path = String(row.path ?? "");

    if (!mediaId || !bucket || !path) {
      failures.push({
        mediaId,
        bucket,
        path,
        reason: "بيانات سجل التنظيف غير مكتملة.",
      });
      continue;
    }

    const { error: storageError } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (storageError) {
      failures.push({
        mediaId,
        bucket,
        path,
        reason: storageError.message,
      });
      continue;
    }

    const { error: confirmError } = await supabase.rpc(
      "confirm_media_storage_cleanup",
      { p_media_id: mediaId },
    );

    if (confirmError) {
      failures.push({
        mediaId,
        bucket,
        path,
        reason: confirmError.message,
      });
      continue;
    }

    cleaned += 1;
  }

  return {
    inspected: pendingRows.length,
    cleaned,
    failed: failures.length,
    failures,
  };
}
