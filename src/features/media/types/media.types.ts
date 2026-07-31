export type MediaRecord = {
  id: string;
  bucket: string;
  path: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  altAr: string | null;
  altEn: string | null;
  uploadedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type UploadMediaInput = {
  file: File;
  folder: string;
  altAr?: string;
  altEn?: string;
};

export type UploadMediaResult = {
  media: MediaRecord;
  publicUrl: string;
};

export type DeleteMediaInput = {
  mediaId: string;
  bucket: string;
  path: string;
};