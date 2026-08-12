export type VisaType =
  | "umrah"
  | "tourist"
  | "visit"
  | "transit"
  | "other";

export type VisaProcessingType =
  | "standard"
  | "express"
  | "manual";

export type Visa = {
  id: string;

  nameAr: string;
  nameEn: string;

  visaType: VisaType;
  processingType: VisaProcessingType;

  countryId: string | null;

  descriptionAr: string | null;
  descriptionEn: string | null;

  requirementsAr: string[];
  requirementsEn: string[];

  processingTimeDays: number | null;
  validityDays: number | null;
  maxStayDays: number | null;

  basePrice: number | null;
  currencyCode: string | null;

  coverMediaId: string | null;
  coverUrl?: string | null;

  isActive: boolean;
  sortOrder: number;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type VisaFormValues = {
  nameAr: string;
  nameEn: string;

  visaType: VisaType;
  processingType: VisaProcessingType;

  countryId: string | null;

  descriptionAr: string;
  descriptionEn: string;

  requirementsAr: string[];
  requirementsEn: string[];

  processingTimeDays: number | null;
  validityDays: number | null;
  maxStayDays: number | null;

  basePrice: number | null;
  currencyCode: string;

  coverMediaId: string | null;

  isActive: boolean;
  sortOrder: number;
};

export type ProgramVisa = {
  id: string;
  programId: string;
  visaId: string;

  isIncluded: boolean;

  notesAr: string | null;
  notesEn: string | null;

  sortOrder: number;

  createdAt: string;
  updatedAt: string;

  visa?: Visa | null;
};

export type ProgramVisaFormValue = {
  id?: string;
  visaId: string;

  isIncluded: boolean;

  notesAr: string;
  notesEn: string;

  sortOrder: number;
};

export const emptyVisaFormValues: VisaFormValues = {
  nameAr: "",
  nameEn: "",

  visaType: "umrah",
  processingType: "standard",

  countryId: null,

  descriptionAr: "",
  descriptionEn: "",

  requirementsAr: [],
  requirementsEn: [],

  processingTimeDays: null,
  validityDays: null,
  maxStayDays: null,

  basePrice: null,
  currencyCode: "SAR",

  coverMediaId: null,

  isActive: true,
  sortOrder: 0,
};
