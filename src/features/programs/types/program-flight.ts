export type ProgramFlightDirection =
  | "outbound"
  | "return";

export type ProgramFlightType =
  | "direct"
  | "transit";

export type ProgramFlightFormValue = {
  direction: ProgramFlightDirection;

  airlineNameAr: string;
  airlineNameEn: string;

  flightNumber: string;

  departureAirportAr: string;
  departureAirportEn: string;

  arrivalAirportAr: string;
  arrivalAirportEn: string;

  departureAt: string;
  arrivalAt: string;

  flightType: ProgramFlightType;

  transitAirportAr: string;
  transitAirportEn: string;

  transitDurationMinutes: number;

  cabinClassAr: string;
  cabinClassEn: string;

  baggageAllowanceKg: number;

  notesAr: string;
  notesEn: string;

  sortOrder: number;
};