import type { SupabaseClient } from "@supabase/supabase-js";

import { uploadMedia } from "../../media/repositories/media.repository";
import type { ProgramFormValues } from "../types";import type { Program } from "../types";

import {
  createProgram as createProgramRecord,
  deleteProgram as deleteProgramRecord,
  getDeletedPrograms as getDeletedProgramRecords,
  getProgramById as getProgramByIdRecord,
  getPrograms as getProgramRecords,
  permanentlyDeleteProgram as permanentlyDeleteProgramRecord,
  restoreProgram as restoreProgramRecord,
  updateProgram as updateProgramRecord,
} from "./programs.repository";

export async function createProgram(
  supabase: SupabaseClient,
  values: ProgramFormValues,
): Promise<Program> {
  let coverMediaId: string | null = null;

  if (values.coverFile) {
    const uploadResult = await uploadMedia(
      supabase,
      {
        file: values.coverFile,
        folder: "programs",
        altAr: values.titleAr,
        altEn: values.titleEn,
      },
    );

    coverMediaId = uploadResult.media.id;
  }

  return createProgramRecord(
    supabase,
    values,
    coverMediaId,
  );
}

export async function getPrograms(
  supabase: SupabaseClient,
): Promise<Program[]> {
  return getProgramRecords(supabase);
}

export async function getProgramById(
  supabase: SupabaseClient,
  programId: string,
): Promise<Program> {
  return getProgramByIdRecord(
    supabase,
    programId,
  );
}

export async function updateProgram(
  supabase: SupabaseClient,
  programId: string,
  values: ProgramFormValues,
  currentCoverMediaId: string | null = null,
): Promise<Program> {
  let coverMediaId = currentCoverMediaId;

  if (values.coverFile) {
    const uploadResult = await uploadMedia(
      supabase,
      {
        file: values.coverFile,
        folder: "programs",
        altAr: values.titleAr,
        altEn: values.titleEn,
      },
    );

    coverMediaId = uploadResult.media.id;
  }

  return updateProgramRecord(
    supabase,
    programId,
    values,
    coverMediaId,
  );
}

export async function deleteProgram(
  supabase: SupabaseClient,
  programId: string,
): Promise<void> {
  return deleteProgramRecord(
    supabase,
    programId,
  );
}

export async function getDeletedPrograms(
  supabase: SupabaseClient,
): Promise<Program[]> {
  return getDeletedProgramRecords(
    supabase,
  );
}

export async function restoreProgram(
  supabase: SupabaseClient,
  programId: string,
): Promise<void> {
  return restoreProgramRecord(
    supabase,
    programId,
  );
}

export async function permanentlyDeleteProgram(
  supabase: SupabaseClient,
  programId: string,
): Promise<void> {
  return permanentlyDeleteProgramRecord(
    supabase,
    programId,
  );
}
