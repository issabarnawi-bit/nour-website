import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  DeleteMediaInput,
  UploadMediaInput,
} from "../types/media.types";

import {
  deleteMedia as deleteMediaRepository,
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
  return deleteMediaRepository(supabase, input);
}