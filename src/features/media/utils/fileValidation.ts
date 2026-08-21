const DEFAULT_ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

type ValidateMediaFileOptions = {
  maxSizeMb?: number;
  allowedMimeTypes?: string[];
};

export function validateMediaFile(
  file: File,
  options: ValidateMediaFileOptions = {},
) {
  const {
    maxSizeMb = 10,
    allowedMimeTypes = DEFAULT_ALLOWED_MIME_TYPES,
  } = options;

  const maxSizeBytes = maxSizeMb * 1024 * 1024;

  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error("نوع الملف غير مدعوم.");
  }

  if (file.size > maxSizeBytes) {
    throw new Error(
      `حجم الملف يجب ألا يتجاوز ${maxSizeMb} MB.`,
    );
  }
}
