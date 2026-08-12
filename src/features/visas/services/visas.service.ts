import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  ProgramVisa,
  ProgramVisaFormValue,
  Visa,
  VisaFormValues,
} from "../types/visa";

import {
  createVisa,
  getDeletedVisas,
  getProgramVisas,
  getVisaById,
  getVisas,
  replaceProgramVisas,
  restoreVisa,
  softDeleteVisa,
  toggleVisaStatus,
  updateVisa,
} from "./visas.repository";

export const visasQueryKey = [
  "admin",
  "visas",
] as const;

export const deletedVisasQueryKey = [
  "admin",
  "visas",
  "deleted",
] as const;

export function listVisas(
  supabase: SupabaseClient,
): Promise<Visa[]> {
  return getVisas(supabase);
}

export function listDeletedVisas(
  supabase: SupabaseClient,
): Promise<Visa[]> {
  return getDeletedVisas(supabase);
}

export function getVisa(
  supabase: SupabaseClient,
  id: string,
): Promise<Visa | null> {
  return getVisaById(
    supabase,
    id,
  );
}

export function saveNewVisa(
  supabase: SupabaseClient,
  values: VisaFormValues,
): Promise<Visa> {
  return createVisa(
    supabase,
    values,
  );
}

export function saveVisaChanges(
  supabase: SupabaseClient,
  id: string,
  values: VisaFormValues,
): Promise<Visa> {
  return updateVisa(
    supabase,
    id,
    values,
  );
}

export function setVisaActive(
  supabase: SupabaseClient,
  id: string,
  isActive: boolean,
): Promise<void> {
  return toggleVisaStatus(
    supabase,
    id,
    isActive,
  );
}

export function deleteVisa(
  supabase: SupabaseClient,
  id: string,
): Promise<void> {
  return softDeleteVisa(
    supabase,
    id,
  );
}

export function restoreDeletedVisa(
  supabase: SupabaseClient,
  id: string,
): Promise<void> {
  return restoreVisa(
    supabase,
    id,
  );
}

export function getVisasForProgram(
  supabase: SupabaseClient,
  programId: string,
): Promise<ProgramVisa[]> {
  return getProgramVisas(
    supabase,
    programId,
  );
}

export function saveProgramVisas(
  supabase: SupabaseClient,
  programId: string,
  values: ProgramVisaFormValue[],
): Promise<void> {
  return replaceProgramVisas(
    supabase,
    programId,
    values,
  );
}
