"use client";

import { ImagePlus, Trash2, Undo2, X } from "lucide-react";
import {
  canPreviewProfileImage,
  getProfileImageExtension,
  formatProfileImageSize,
  PROFILE_IMAGE_ACCEPT,
  PROFILE_IMAGE_FORMAT_LABEL,
  PROFILE_IMAGE_LIMIT,
  PROFILE_IMAGE_TOTAL_MAX_SIZE,
  ProfileImage,
  SelectedProfileImage,
} from "@/lib/profileImages";

interface ProfileImageUploaderProps {
  existingImages?: ProfileImage[];
  removedImageIds?: string[];
  selectedImages: SelectedProfileImage[];
  error?: string | null;
  disabled?: boolean;
  onSelectFiles: (files: FileList | null) => void;
  onRemoveSelected: (id: string) => void;
  onToggleExistingRemoval?: (id: string) => void;
}

export default function ProfileImageUploader({
  existingImages = [],
  removedImageIds = [],
  selectedImages,
  error,
  disabled = false,
  onSelectFiles,
  onRemoveSelected,
  onToggleExistingRemoval,
}: ProfileImageUploaderProps) {
  const removedIds = new Set(removedImageIds);
  const activeExistingCount = existingImages.filter(
    (image) => !removedIds.has(image.id),
  ).length;
  const currentCount = activeExistingCount + selectedImages.length;
  const remainingSlots = Math.max(PROFILE_IMAGE_LIMIT - currentCount, 0);
  const isInputDisabled = disabled || remainingSlots === 0;

  return (
    <section className="rounded-2xl border border-ui-border bg-white/35 p-3 shadow-none backdrop-blur-sm sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-light text-brand-primary">
              <ImagePlus size={16} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-ui-text-main">
                Your Photos
              </h3>
              <p className="text-xs font-medium text-ui-text-muted">
                Upload at least 1 clear photo. You may add up to 6 total.
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-ui-text-muted">
                Supports {PROFILE_IMAGE_FORMAT_LABEL}. Keep new uploads under{" "}
                {formatProfileImageSize(PROFILE_IMAGE_TOTAL_MAX_SIZE)} combined.
              </p>
            </div>
          </div>
        </div>

        <label
          className={[
            "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all sm:text-sm",
            isInputDisabled
              ? "cursor-not-allowed bg-ui-border text-ui-text-muted"
              : "border border-brand-primary/30 bg-brand-light text-brand-dark hover:-translate-y-0.5 hover:bg-brand-primary hover:text-white",
          ].join(" ")}
        >
          <ImagePlus size={16} />
          Add Photos
          <input
            type="file"
            accept={PROFILE_IMAGE_ACCEPT}
            multiple
            disabled={isInputDisabled}
            className="sr-only"
            onChange={(event) => {
              onSelectFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold">
        <span className="rounded-full border border-brand-accent/20 bg-brand-accent/10 px-3 py-1 text-brand-accent">
          {currentCount}/{PROFILE_IMAGE_LIMIT} photos selected
        </span>
      </div>

      {error && (
        <p className="mt-3 rounded-2xl border border-danger-500/25 bg-danger-500/10 px-3 py-2 text-xs font-semibold text-danger-600">
          {error}
        </p>
      )}

      {(existingImages.length > 0 || selectedImages.length > 0) && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {existingImages.map((image) => {
            const isRemoved = removedIds.has(image.id);

            return (
              <div
                key={image.id}
                className={[
                  "group relative aspect-square overflow-hidden rounded-xl border bg-ui-bg-page shadow-sm transition-all",
                  isRemoved
                    ? "border-danger-500/40 opacity-60"
                  : "border-ui-border hover:-translate-y-1 hover:shadow-md",
                ].join(" ")}
              >
                <img
                  src={image.url}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {isRemoved && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/65 text-xs font-extrabold text-danger-600">
                    Remove on save
                  </div>
                )}
                {onToggleExistingRemoval && (
                  <button
                    type="button"
                    onClick={() => onToggleExistingRemoval(image.id)}
                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ui-text-main shadow-sm transition-colors hover:bg-brand-light hover:text-brand-primary"
                    aria-label={
                      isRemoved
                        ? "Keep existing profile image"
                        : "Remove existing profile image"
                    }
                  >
                    {isRemoved ? <Undo2 size={15} /> : <Trash2 size={15} />}
                  </button>
                )}
              </div>
            );
          })}

          {selectedImages.map((image) => {
            const canPreview = canPreviewProfileImage(image.file);
            const extension = getProfileImageExtension(image.file).toUpperCase();

            return (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-xl border border-brand-primary/20 bg-ui-bg-page shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                {canPreview ? (
                  <img
                    src={image.previewUrl}
                    alt="New profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-brand-light/70 p-3 text-center">
                    <ImagePlus size={22} className="text-brand-primary" />
                    <span className="text-xs font-extrabold text-ui-text-main">
                      {extension || "Image"}
                    </span>
                    <span className="max-w-full truncate text-[10px] font-semibold text-ui-text-muted">
                      Preview after upload
                    </span>
                  </div>
                )}
                <span className="absolute left-1.5 top-1.5 rounded-full bg-brand-primary px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white">
                  New
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveSelected(image.id)}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ui-text-main shadow-sm transition-colors hover:bg-danger-500 hover:text-white"
                  aria-label="Remove selected profile image"
                >
                  <X size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
