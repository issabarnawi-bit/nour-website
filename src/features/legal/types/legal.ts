export type LegalPageStatus = "draft" | "published" | "inactive";

export type LegalPage = {
  id: string;
  key: string;

  titleAr: string;
  titleEn: string;

  contentAr: string;
  contentEn: string;

  version: string;
  status: LegalPageStatus;

  publishedAt: string | null;

  isActive: boolean;
  sortOrder: number;

  createdAt: string;
  updatedAt: string;
};

export type LegalPageVersion = {
  id: string;
  legalPageId: string;

  version: string;

  titleAr: string;
  titleEn: string;

  contentAr: string;
  contentEn: string;

  publishedAt: string;
  publishedBy: string | null;

  createdAt: string;
};

export type LegalPageFormValues = {
  titleAr: string;
  titleEn: string;

  contentAr: string;
  contentEn: string;

  version: string;

  isActive: boolean;
};