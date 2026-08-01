export type ProgramStatus =
  | "draft"
  | "published"
  | "inactive";

export type Program = {
  id: string;

  titleAr: string;
  titleEn: string;

  slug: string;

  summaryAr: string;
  summaryEn: string;

  descriptionAr: string;
  descriptionEn: string;

  countryId: string | null;

  durationDays: number;
  durationNights: number;

  basePrice: number;
  currencyCode: string;

  coverMediaId: string | null;
  coverUrl: string | null;

  status: ProgramStatus;

  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;

  createdBy: string | null;
  updatedBy: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ProgramFormValues = {
  titleAr: string;
  titleEn: string;

  slug: string;

  summaryAr: string;
  summaryEn: string;

  descriptionAr: string;
  descriptionEn: string;

  countryId: string;

  durationDays: number;
  durationNights: number;

  basePrice: number;
  currencyCode: string;

  status: ProgramStatus;

  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;

  coverFile: File | null;
};