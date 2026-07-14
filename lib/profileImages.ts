export const PROFILE_IMAGE_LIMIT = 6;
export const PROFILE_IMAGE_MAX_SIZE = 8 * 1024 * 1024;
export const PROFILE_IMAGE_TOTAL_MAX_SIZE =
  PROFILE_IMAGE_LIMIT * PROFILE_IMAGE_MAX_SIZE;
export const PROFILE_IMAGE_FORMAT_LABEL =
  "JPG, JPEG, PNG, WEBP, GIF, AVIF, BMP, HEIC, HEIF, or TIFF";
export const PROFILE_IMAGE_REQUEST_TOO_LARGE_MESSAGE =
  "Your profile photos are too large for one upload. Please choose smaller photos or upload fewer photos, then try again.";

const ALLOWED_PROFILE_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/bmp",
  "image/x-ms-bmp",
  "image/heic",
  "image/heif",
  "image/tiff",
]);

const ALLOWED_PROFILE_IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "jfif",
  "png",
  "webp",
  "gif",
  "avif",
  "bmp",
  "heic",
  "heif",
  "tif",
  "tiff",
]);

const PROFILE_IMAGE_ACCEPT_VALUES = [
  ...ALLOWED_PROFILE_IMAGE_TYPES,
  ...Array.from(ALLOWED_PROFILE_IMAGE_EXTENSIONS, (extension) => `.${extension}`),
];

export const PROFILE_IMAGE_ACCEPT = PROFILE_IMAGE_ACCEPT_VALUES.join(",");

const NON_PREVIEWABLE_PROFILE_IMAGE_TYPES = new Set([
  "image/heic",
  "image/heif",
  "image/tiff",
]);

const NON_PREVIEWABLE_PROFILE_IMAGE_EXTENSIONS = new Set([
  "heic",
  "heif",
  "tif",
  "tiff",
]);

export interface ProfileImage {
  id: string;
  url: string;
  key?: string;
  uploaded_at?: string;
}

export interface SelectedProfileImage {
  id: string;
  file: File;
  previewUrl: string;
}

export function formatProfileImageSize(bytes: number): string {
  return `${Math.round(bytes / 1024 / 1024)}MB`;
}

export function getProfileImageExtension(file: File): string {
  const extension = file.name.split(".").pop();
  return extension ? extension.toLowerCase() : "";
}

function isAllowedProfileImageFile(file: File): boolean {
  const mimeType = file.type.toLowerCase();
  const extension = getProfileImageExtension(file);

  return (
    (!!mimeType && ALLOWED_PROFILE_IMAGE_TYPES.has(mimeType)) ||
    (!!extension && ALLOWED_PROFILE_IMAGE_EXTENSIONS.has(extension))
  );
}

export function canPreviewProfileImage(file: File): boolean {
  const mimeType = file.type.toLowerCase();
  const extension = getProfileImageExtension(file);

  return (
    !NON_PREVIEWABLE_PROFILE_IMAGE_TYPES.has(mimeType) &&
    !NON_PREVIEWABLE_PROFILE_IMAGE_EXTENSIONS.has(extension)
  );
}

function isSameProfileImageFile(a: File, b: File): boolean {
  return (
    a.name === b.name &&
    a.size === b.size &&
    a.lastModified === b.lastModified
  );
}

export function validateProfileImageFiles({
  files,
  currentCount,
  currentFiles = [],
}: {
  files: File[];
  currentCount: number;
  currentFiles?: File[];
}): string | null {
  if (currentCount + files.length > PROFILE_IMAGE_LIMIT) {
    return `You can upload up to ${PROFILE_IMAGE_LIMIT} images in total.`;
  }

  const duplicate = files.find(
    (file, index) =>
      currentFiles.some((existing) => isSameProfileImageFile(existing, file)) ||
      files.some((other, otherIndex) => otherIndex < index && isSameProfileImageFile(other, file))
  );
  if (duplicate) {
    return `"${duplicate.name}" has already been added.`;
  }

  const invalidType = files.find(
    (file) => !isAllowedProfileImageFile(file)
  );
  if (invalidType) {
    return `"${invalidType.name}" is not a supported profile photo. Please upload ${PROFILE_IMAGE_FORMAT_LABEL} files.`;
  }

  const oversized = files.find((file) => file.size > PROFILE_IMAGE_MAX_SIZE);
  if (oversized) {
    return `"${oversized.name}" is too large. Each profile photo must be ${formatProfileImageSize(PROFILE_IMAGE_MAX_SIZE)} or smaller.`;
  }

  const totalSize = [...currentFiles, ...files].reduce(
    (sum, file) => sum + file.size,
    0
  );
  if (totalSize > PROFILE_IMAGE_TOTAL_MAX_SIZE) {
    return `Your selected profile photos are ${formatProfileImageSize(totalSize)} total. Please keep all new profile photos under ${formatProfileImageSize(PROFILE_IMAGE_TOTAL_MAX_SIZE)} combined.`;
  }

  return null;
}

export function appendProfileFields(formData: FormData, data: object) {
  Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    formData.append(key, String(value));
  });
}
