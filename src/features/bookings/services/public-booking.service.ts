import type { SupabaseClient } from "@supabase/supabase-js";

export type BookingTravelerInput = {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  nationalityCode?: string;
  passportNumber?: string;
};

export type CreateProgramBookingInput = {
  programId: string;
  departureId: string;
  priceTierId: string;
  travelersCount: number;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  contactCountryCode?: string;
  preferredLanguage: "ar" | "en";
  travelers: BookingTravelerInput[];
};

export type CreatedBooking = {
  bookingId: string;
  bookingReference: string;
  status: "pending_payment" | "confirmed" | "cancelled" | "expired" | "refunded";
  reservedUntil: string | null;
  totalAmount: number;
  currencyCode: string;
};

export async function createProgramBooking(
  supabase: SupabaseClient,
  input: CreateProgramBookingInput,
): Promise<CreatedBooking> {
  const { data, error } = await supabase.rpc("create_program_booking", {
    p_program_id: input.programId,
    p_departure_id: input.departureId,
    p_price_tier_id: input.priceTierId,
    p_travelers_count: input.travelersCount,
    p_contact_name: input.contactName,
    p_contact_email: input.contactEmail || null,
    p_contact_phone: input.contactPhone || null,
    p_contact_country_code: input.contactCountryCode || null,
    p_preferred_language: input.preferredLanguage,
    p_travelers: input.travelers.map((traveler) => ({
      first_name: traveler.firstName,
      last_name: traveler.lastName,
      date_of_birth: traveler.dateOfBirth || null,
      nationality_code: traveler.nationalityCode || null,
      passport_number: traveler.passportNumber || null,
    })),
  });

  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) throw new Error("booking_not_created");

  return {
    bookingId: row.booking_id,
    bookingReference: row.booking_reference,
    status: row.status,
    reservedUntil: row.reserved_until ?? null,
    totalAmount: Number(row.total_amount) || 0,
    currencyCode: row.currency_code,
  };
}
