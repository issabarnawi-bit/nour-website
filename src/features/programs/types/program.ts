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
  coverUrl?: string;

  status: ProgramStatus;

  isFeatured: boolean;
  sortOrder: number;

  createdAt: string;
  updatedAt: string;
};