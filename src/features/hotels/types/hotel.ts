export type HotelStatus =
  | "active"
  | "inactive";

export type Hotel = {
  id: string;

  nameAr: string;
  nameEn: string;

  cityAr: string;
  cityEn: string;

  stars: number;

  descriptionAr: string;
  descriptionEn: string;

  addressAr: string;
  addressEn: string;

  latitude: number | null;
  longitude: number | null;

  coverMediaId: string | null;
  coverUrl?: string;

  gallery: HotelMedia[];

  status: HotelStatus;
  sortOrder: number;

  createdAt: string;
  updatedAt: string;
};

export type HotelMedia = {
  id: string;

  mediaId: string;

  publicUrl?: string;

  isCover: boolean;
  sortOrder: number;
};

export type HotelFormValues = {
  nameAr: string;
  nameEn: string;

  cityAr: string;
  cityEn: string;

  stars: number;

  descriptionAr: string;
  descriptionEn: string;

  addressAr: string;
  addressEn: string;

  latitude: number | null;
  longitude: number | null;

  sortOrder: number;
  isActive: boolean;

  coverFile: File | null;
  galleryFiles: File[];
};