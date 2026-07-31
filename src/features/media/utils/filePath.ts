function sanitizeSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

export function getFileExtension(file: File) {
  const extension = file.name.split(".").pop();

  if (!extension) {
    throw new Error("تعذر تحديد امتداد الملف.");
  }

  return extension.toLowerCase();
}

export function createMediaFilePath(
  folder: string,
  file: File,
) {
  const safeFolder = folder
    .split("/")
    .map(sanitizeSegment)
    .filter(Boolean)
    .join("/");

  const extension = getFileExtension(file);
  const uniqueId = crypto.randomUUID();

  return `${safeFolder}/${uniqueId}.${extension}`;
}