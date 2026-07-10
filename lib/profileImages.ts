export const PROFILE_IMAGE_LIMIT = 6;
export const PROFILE_IMAGE_MAX_SIZE = 10 * 1024 * 1024;
export const PROFILE_IMAGE_FORMAT_LABEL =
  "JPG, JPEG, PNG, WEBP, GIF, AVIF, BMP, HEIC, HEIF, or TIFF";

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

export function validateProfileImageFiles({
  files,
  currentCount,
}: {
  files: File[];
  currentCount: number;
}): string | null {
  if (currentCount + files.length > PROFILE_IMAGE_LIMIT) {
    return `You can upload up to ${PROFILE_IMAGE_LIMIT} images in total.`;
  }

  const invalidType = files.find(
    (file) => !isAllowedProfileImageFile(file)
  );
  if (invalidType) {
    return `"${invalidType.name}" is not a supported profile photo. Please upload ${PROFILE_IMAGE_FORMAT_LABEL} files.`;
  }

  const oversized = files.find((file) => file.size > PROFILE_IMAGE_MAX_SIZE);
  if (oversized) {
    return `"${oversized.name}" is too large. Each profile photo must be 10MB or smaller.`;
  }

  return null;
}

export function appendProfileFields(formData: FormData, data: object) {
  Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    formData.append(key, String(value));
  });
}
