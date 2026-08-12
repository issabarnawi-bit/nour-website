export type TransportServiceType =
  | "airport_hotel"
  | "hotel_airport"
  | "hotel_hotel"
  | "hotel_haram"
  | "haram_hotel"
  | "intercity"
  | "ziyarat"
  | "other";

export type TransportMode =
  | "private"
  | "shared";

export type TransportVehicleType =
  | "sedan"
  | "suv"
  | "van"
  | "minibus"
  | "bus"
  | "coach"
  | "other";

export type Transport = {
  id: string;

  nameAr: string;
  nameEn: string;

  providerNameAr: string | null;
  providerNameEn: string | null;

  serviceType: TransportServiceType;
  mode: TransportMode;
  vehicleType: TransportVehicleType;

  vehicleNameAr: string | null;
  vehicleNameEn: string | null;

  capacity: number;
  luggageCapacity: number | null;

  descriptionAr: string | null;
  descriptionEn: string | null;

  amenitiesAr: string[];
  amenitiesEn: string[];

  coverMediaId: string | null;
  coverUrl?: string | null;

  isActive: boolean;
  sortOrder: number;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type TransportFormValues = {
  nameAr: string;
  nameEn: string;

  providerNameAr: string;
  providerNameEn: string;

  serviceType: TransportServiceType;
  mode: TransportMode;
  vehicleType: TransportVehicleType;

  vehicleNameAr: string;
  vehicleNameEn: string;

  capacity: number;
  luggageCapacity: number | null;

  descriptionAr: string;
  descriptionEn: string;

  amenitiesAr: string[];
  amenitiesEn: string[];

  coverMediaId: string | null;

  isActive: boolean;
  sortOrder: number;
};

export type ProgramTransport = {
  id: string;
  programId: string;
  transportId: string;

  dayNumber: number | null;

  pickupNameAr: string | null;
  pickupNameEn: string | null;

  dropoffNameAr: string | null;
  dropoffNameEn: string | null;

  pickupDatetime: string | null;
  estimatedDurationMinutes: number | null;

  notesAr: string | null;
  notesEn: string | null;

  isIncluded: boolean;
  sortOrder: number;

  createdAt: string;
  updatedAt: string;

  transport?: Transport | null;
};

export type ProgramTransportFormValue = {
  id?: string;
  transportId: string;

  dayNumber: number | null;

  pickupNameAr: string;
  pickupNameEn: string;

  dropoffNameAr: string;
  dropoffNameEn: string;

  pickupDatetime: string;
  estimatedDurationMinutes: number | null;

  notesAr: string;
  notesEn: string;

  isIncluded: boolean;
  sortOrder: number;
};

export const emptyTransportFormValues: TransportFormValues = {
  nameAr: "",
  nameEn: "",

  providerNameAr: "",
  providerNameEn: "",

  serviceType: "other",
  mode: "private",
  vehicleType: "van",

  vehicleNameAr: "",
  vehicleNameEn: "",

  capacity: 1,
  luggageCapacity: null,

  descriptionAr: "",
  descriptionEn: "",

  amenitiesAr: [],
  amenitiesEn: [],

  coverMediaId: null,

  isActive: true,
  sortOrder: 0,
};
