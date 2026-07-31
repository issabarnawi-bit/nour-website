"use client";

import { useMutation } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";

import { uploadMedia } from "../services";
import type { UploadMediaInput } from "../types/media.types";

export function useUploadMedia(
  supabase: SupabaseClient,
) {
  return useMutation({
    mutationFn: (input: UploadMediaInput) =>
      uploadMedia(supabase, input),
  });
}