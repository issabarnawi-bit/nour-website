"use client";

import { useMutation } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";

import { deleteMedia } from "../services";
import type { DeleteMediaInput } from "../types/media.types";

export function useDeleteMedia(
  supabase: SupabaseClient,
) {
  return useMutation({
    mutationFn: (input: DeleteMediaInput) =>
      deleteMedia(supabase, input),
  });
}