export const PROFILE_IMAGE_LIMIT = 6;
export const PROFILE_IMAGE_MAX_SIZE = 10 * 1024 * 1024;
export const PROFILE_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

const ALLOWED_PROFILE_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
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
    (file) => !ALLOWED_PROFILE_IMAGE_TYPES.has(file.type)
  );
  if (invalidType) {
    return "Profile images must be JPG, PNG, or WEBP files.";
  }

  const oversized = files.find((file) => file.size > PROFILE_IMAGE_MAX_SIZE);
  if (oversized) {
    return "Each profile image must be 10MB or smaller.";
  }

  return null;
}

export function appendProfileFields(formData: FormData, data: object) {
  Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    formData.append(key, String(value));
  });
}
