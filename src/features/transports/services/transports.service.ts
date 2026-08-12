import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  ProgramTransport,
  ProgramTransportFormValue,
  Transport,
  TransportFormValues,
} from "../types/transport";

import {
  createTransport,
  getDeletedTransports,
  getProgramTransports,
  getTransportById,
  getTransports,
  replaceProgramTransports,
  restoreTransport,
  softDeleteTransport,
  toggleTransportStatus,
  updateTransport,
} from "./transports.repository";

export const transportsQueryKey = [
  "admin",
  "transports",
] as const;

export const deletedTransportsQueryKey = [
  "admin",
  "transports",
  "deleted",
] as const;

export function listTransports(
  supabase: SupabaseClient,
): Promise<Transport[]> {
  return getTransports(supabase);
}

export function listDeletedTransports(
  supabase: SupabaseClient,
): Promise<Transport[]> {
  return getDeletedTransports(
    supabase,
  );
}

export function getTransport(
  supabase: SupabaseClient,
  id: string,
): Promise<Transport | null> {
  return getTransportById(
    supabase,
    id,
  );
}

export function saveNewTransport(
  supabase: SupabaseClient,
  values: TransportFormValues,
): Promise<Transport> {
  return createTransport(
    supabase,
    values,
  );
}

export function saveTransportChanges(
  supabase: SupabaseClient,
  id: string,
  values: TransportFormValues,
): Promise<Transport> {
  return updateTransport(
    supabase,
    id,
    values,
  );
}

export function setTransportActive(
  supabase: SupabaseClient,
  id: string,
  isActive: boolean,
): Promise<void> {
  return toggleTransportStatus(
    supabase,
    id,
    isActive,
  );
}

export function deleteTransport(
  supabase: SupabaseClient,
  id: string,
): Promise<void> {
  return softDeleteTransport(
    supabase,
    id,
  );
}

export function restoreDeletedTransport(
  supabase: SupabaseClient,
  id: string,
): Promise<void> {
  return restoreTransport(
    supabase,
    id,
  );
}

export function getTransportsForProgram(
  supabase: SupabaseClient,
  programId: string,
): Promise<ProgramTransport[]> {
  return getProgramTransports(
    supabase,
    programId,
  );
}

export function saveProgramTransports(
  supabase: SupabaseClient,
  programId: string,
  values: ProgramTransportFormValue[],
): Promise<void> {
  return replaceProgramTransports(
    supabase,
    programId,
    values,
  );
}
