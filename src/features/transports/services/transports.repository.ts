import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  ProgramTransport,
  ProgramTransportFormValue,
  Transport,
  TransportFormValues,
} from "../types/transport";

type TransportRow = {
  id: string;
  name_ar: string;
  name_en: string;
  provider_name_ar: string | null;
  provider_name_en: string | null;
  service_type: Transport["serviceType"];
  mode: Transport["mode"];
  vehicle_type: Transport["vehicleType"];
  vehicle_name_ar: string | null;
  vehicle_name_en: string | null;
  capacity: number;
  luggage_capacity: number | null;
  description_ar: string | null;
  description_en: string | null;
  amenities_ar: string[] | null;
  amenities_en: string[] | null;
  cover_media_id: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type ProgramTransportRow = {
  id: string;
  program_id: string;
  transport_id: string;
  day_number: number | null;
  pickup_name_ar: string | null;
  pickup_name_en: string | null;
  dropoff_name_ar: string | null;
  dropoff_name_en: string | null;
  pickup_datetime: string | null;
  estimated_duration_minutes: number | null;
  notes_ar: string | null;
  notes_en: string | null;
  is_included: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  transport?: TransportRow | null;
};

function mapTransport(
  row: TransportRow,
): Transport {
  return {
    id: row.id,
    nameAr: row.name_ar,
    nameEn: row.name_en,
    providerNameAr: row.provider_name_ar,
    providerNameEn: row.provider_name_en,
    serviceType: row.service_type,
    mode: row.mode,
    vehicleType: row.vehicle_type,
    vehicleNameAr: row.vehicle_name_ar,
    vehicleNameEn: row.vehicle_name_en,
    capacity: row.capacity,
    luggageCapacity: row.luggage_capacity,
    descriptionAr: row.description_ar,
    descriptionEn: row.description_en,
    amenitiesAr: row.amenities_ar ?? [],
    amenitiesEn: row.amenities_en ?? [],
    coverMediaId: row.cover_media_id,
    coverUrl: null,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

function toTransportPayload(
  values: TransportFormValues,
) {
  return {
    name_ar: values.nameAr.trim(),
    name_en: values.nameEn.trim(),
    provider_name_ar:
      values.providerNameAr.trim() || null,
    provider_name_en:
      values.providerNameEn.trim() || null,
    service_type: values.serviceType,
    mode: values.mode,
    vehicle_type: values.vehicleType,
    vehicle_name_ar:
      values.vehicleNameAr.trim() || null,
    vehicle_name_en:
      values.vehicleNameEn.trim() || null,
    capacity: Math.max(1, values.capacity),
    luggage_capacity:
      values.luggageCapacity === null
        ? null
        : Math.max(0, values.luggageCapacity),
    description_ar:
      values.descriptionAr.trim() || null,
    description_en:
      values.descriptionEn.trim() || null,
    amenities_ar: values.amenitiesAr,
    amenities_en: values.amenitiesEn,
    cover_media_id: values.coverMediaId,
    is_active: values.isActive,
    sort_order: Math.max(0, values.sortOrder),
  };
}

export async function getTransports(
  supabase: SupabaseClient,
): Promise<Transport[]> {
  const { data, error } =
    await supabase
      .from("transports")
      .select("*")
      .is("deleted_at", null)
      .order("sort_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    throw error;
  }

  return (
    (data ?? []) as TransportRow[]
  ).map(mapTransport);
}

export async function getDeletedTransports(
  supabase: SupabaseClient,
): Promise<Transport[]> {
  const { data, error } =
    await supabase
      .from("transports")
      .select("*")
      .not("deleted_at", "is", null)
      .order("deleted_at", {
        ascending: false,
      });

  if (error) {
    throw error;
  }

  return (
    (data ?? []) as TransportRow[]
  ).map(mapTransport);
}

export async function getTransportById(
  supabase: SupabaseClient,
  id: string,
): Promise<Transport | null> {
  const { data, error } =
    await supabase
      .from("transports")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();

  if (error) {
    throw error;
  }

  return data
    ? mapTransport(data as TransportRow)
    : null;
}

export async function createTransport(
  supabase: SupabaseClient,
  values: TransportFormValues,
): Promise<Transport> {
  const { data, error } =
    await supabase
      .from("transports")
      .insert(toTransportPayload(values))
      .select("*")
      .single();

  if (error) {
    throw error;
  }

  return mapTransport(
    data as TransportRow,
  );
}

export async function updateTransport(
  supabase: SupabaseClient,
  id: string,
  values: TransportFormValues,
): Promise<Transport> {
  const { data, error } =
    await supabase
      .from("transports")
      .update(toTransportPayload(values))
      .eq("id", id)
      .is("deleted_at", null)
      .select("*")
      .single();

  if (error) {
    throw error;
  }

  return mapTransport(
    data as TransportRow,
  );
}

export async function toggleTransportStatus(
  supabase: SupabaseClient,
  id: string,
  isActive: boolean,
): Promise<void> {
  const { error } =
    await supabase
      .from("transports")
      .update({
        is_active: isActive,
      })
      .eq("id", id)
      .is("deleted_at", null);

  if (error) {
    throw error;
  }
}

export async function softDeleteTransport(
  supabase: SupabaseClient,
  id: string,
): Promise<void> {
  const { error } =
    await supabase
      .from("transports")
      .update({
        deleted_at:
          new Date().toISOString(),
        is_active: false,
      })
      .eq("id", id)
      .is("deleted_at", null);

  if (error) {
    throw error;
  }
}

export async function restoreTransport(
  supabase: SupabaseClient,
  id: string,
): Promise<void> {
  const { error } =
    await supabase
      .from("transports")
      .update({
        deleted_at: null,
        is_active: true,
      })
      .eq("id", id);

  if (error) {
    throw error;
  }
}

function mapProgramTransport(
  row: ProgramTransportRow,
): ProgramTransport {
  return {
    id: row.id,
    programId: row.program_id,
    transportId: row.transport_id,
    dayNumber: row.day_number,
    pickupNameAr: row.pickup_name_ar,
    pickupNameEn: row.pickup_name_en,
    dropoffNameAr: row.dropoff_name_ar,
    dropoffNameEn: row.dropoff_name_en,
    pickupDatetime: row.pickup_datetime,
    estimatedDurationMinutes:
      row.estimated_duration_minutes,
    notesAr: row.notes_ar,
    notesEn: row.notes_en,
    isIncluded: row.is_included,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    transport: row.transport
      ? mapTransport(row.transport)
      : null,
  };
}

export async function getProgramTransports(
  supabase: SupabaseClient,
  programId: string,
): Promise<ProgramTransport[]> {
  const { data, error } =
    await supabase
      .from("program_transports")
      .select(`
        *,
        transport:transports(*)
      `)
      .eq("program_id", programId)
      .order("sort_order", {
        ascending: true,
      });

  if (error) {
    throw error;
  }

  return (
    (data ?? []) as ProgramTransportRow[]
  ).map(mapProgramTransport);
}

export async function replaceProgramTransports(
  supabase: SupabaseClient,
  programId: string,
  values: ProgramTransportFormValue[],
): Promise<void> {
  const { error: deleteError } =
    await supabase
      .from("program_transports")
      .delete()
      .eq("program_id", programId);

  if (deleteError) {
    throw deleteError;
  }

  if (values.length === 0) {
    return;
  }

  const payload = values.map(
    (value, index) => ({
      program_id: programId,
      transport_id: value.transportId,
      day_number: value.dayNumber,
      pickup_name_ar:
        value.pickupNameAr.trim() || null,
      pickup_name_en:
        value.pickupNameEn.trim() || null,
      dropoff_name_ar:
        value.dropoffNameAr.trim() || null,
      dropoff_name_en:
        value.dropoffNameEn.trim() || null,
      pickup_datetime:
        value.pickupDatetime || null,
      estimated_duration_minutes:
        value.estimatedDurationMinutes,
      notes_ar:
        value.notesAr.trim() || null,
      notes_en:
        value.notesEn.trim() || null,
      is_included: value.isIncluded,
      sort_order: Number.isFinite(
        value.sortOrder,
      )
        ? value.sortOrder
        : index,
    }),
  );

  const { error: insertError } =
    await supabase
      .from("program_transports")
      .insert(payload);

  if (insertError) {
    throw insertError;
  }
}
