"use client";

import { useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  Briefcase,
  Building,
  FileText,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  Share2,
  Sparkles,
  User,
  UserCheck,
} from "lucide-react";
import {
  useDashboardProfile,
  useDashboardProfileActions,
} from "@/lib/context/DashboardContext";
import FormComponent, { FormField, FormComponentRef } from "@/components/forms/FormComponent";
import {
  buildMemberProfileFormData,
  patchMemberProfile,
} from "@/lib/services/auth";
import ProfileImageUploader from "@/components/forms/ProfileImageUploader";
import {
  SelectedProfileImage,
  validateProfileImageFiles,
} from "@/lib/profileImages";

export default function ProfilePage() {
  const profile = useDashboardProfile();
  const { setProfile } = useDashboardProfileActions();
  const latestReg = profile?.registrations?.[0] || {};
  const fullName = `${profile?.first_name || ""} ${
    profile?.last_name || ""
  }`.trim();
  const initials =
    `${profile?.first_name?.[0] ?? ""}${profile?.last_name?.[0] ?? ""}`.toUpperCase() ||
    "CB";

  const profileFormRef = useRef<FormComponentRef>(null);
  const socialsFormRef = useRef<FormComponentRef>(null);
  const [globalSaving, setGlobalSaving] = useState(false);
  const [selectedImages, setSelectedImages] = useState<SelectedProfileImage[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const selectedImagesRef = useRef<SelectedProfileImage[]>([]);

  useEffect(() => {
    selectedImagesRef.current = selectedImages;
  }, [selectedImages]);

  useEffect(() => {
    return () => {
      selectedImagesRef.current.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, []);

  // --- 1. PROFILE CONFIG ---
  const profileInitialData = {
    email: profile?.email || "",
    age_range: profile?.age_range || "",
    gender: profile?.gender || "",
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    phone: profile?.phone || "",
    city: profile?.city || "",
    profession: profile?.profession || "",
    business_name: profile?.business_name || "",
    emergency_contact: latestReg.emergency_contact || "",
    dietary_restrictions: latestReg.food_allergies || "",
  };

  const profileFields: FormField[] = [
    { 
      name: "email", 
      label: "Account Email", 
      type: "email", 
      isEditable: false, 
      colSpan: 2 
    },
    { 
      name: "first_name", 
      label: "First Name", 
      type: "text", 
      required: true, 
      placeholder: "First Name",
      icon: <User size={16} />,
      requiredMessage: "First name is required."
    },
    { 
      name: "last_name", 
      label: "Last Name", 
      type: "text", 
      required: true, 
      placeholder: "Last Name",
      icon: <User size={16} />,
      requiredMessage: "Last name is required."
    },
    { 
      name: "age_range", 
      label: "Age Range", 
      type: "select", 
      placeholder: "-- Select Age Range --",
      options: [
        { label: "21-29", value: "21-29" },
        { label: "31-39", value: "31-39" },
        { label: "41-49", value: "41-49" },
        { label: "51-59", value: "51-59" }
      ]
    },
    { 
      name: "gender", 
      label: "Gender", 
      type: "select", 
      placeholder: "-- Select Gender --",
      options: [
        { label: "Female", value: "Female" },
        { label: "Male", value: "Male" },
        { label: "Non-Binary", value: "Non-Binary" },
        { label: "Prefer not to say", value: "Prefer not to say" }
      ]
    },
    { 
      name: "phone", 
      label: "Phone Number", 
      type: "tel", 
      placeholder: "e.g. +1 555-0199",
      icon: <Phone size={16} />
    },
    { 
      name: "city", 
      label: "Current City", 
      type: "text", 
      placeholder: "e.g. San Diego, CA",
      icon: <MapPin size={16} />
    },
    { 
      name: "profession", 
      label: "Profession", 
      type: "text", 
      placeholder: "e.g. Designer",
      icon: <Briefcase size={16} />
    },
    { 
      name: "business_name", 
      label: "Business Name", 
      type: "text", 
      placeholder: "e.g. Design Studio",
      icon: <Building size={16} />
    },
    { 
      name: "emergency_contact", 
      label: "Emergency Contact", 
      type: "text", 
      placeholder: "Name & Phone", 
      colSpan: 2,
      icon: <ShieldAlert size={16} />
    },
    { 
      name: "dietary_restrictions", 
      label: "Dietary Restrictions", 
      type: "textarea", 
      placeholder: "Allergies / Diets", 
      colSpan: 2,
      icon: <FileText size={16} />
    },
  ];

  // --- 2. SOCIALS CONFIG ---
  const socialsInitialData = {
    instagram: profile?.instagram || "",
    linkedin: profile?.linkedin || "",
    facebook: profile?.facebook || "",
    website: profile?.website || "",
  };

  const socialsFields: FormField[] = [
    { 
      name: "instagram", 
      label: "Instagram", 
      type: "text", 
      placeholder: "@handle", 
      colSpan: 1,
      icon: <img src="/instagram-logo.svg" alt="Instagram" className="w-4 h-4 object-contain opacity-70" />
    },
    { 
      name: "linkedin", 
      label: "LinkedIn", 
      type: "url", 
      placeholder: "LinkedIn URL", 
      colSpan: 1,
      icon: <img src="/linkedin.svg" alt="LinkedIn" className="w-4 h-4 object-contain opacity-70" />,
      invalidMessage: "Please provide a valid URL for your LinkedIn profile."
    },
    { 
      name: "facebook", 
      label: "Facebook", 
      type: "text", 
      placeholder: "Facebook Profile", 
      colSpan: 1,
      icon: <img src="/facebook.svg" alt="Facebook" className="w-4 h-4 object-contain opacity-70" />
    },
    { 
      name: "website", 
      label: "Website", 
      type: "url", 
      placeholder: "https://...", 
      colSpan: 1,
      icon: <img src="/website.svg" alt="Website" className="w-4 h-4 object-contain opacity-70" />,
      invalidMessage: "Please provide a valid URL."
    },
  ];

  const handleSelectImages = (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []);
    if (files.length === 0) return;

    const existingActiveCount = (profile.images ?? []).filter(
      (image) => !removedImageIds.includes(image.id),
    ).length;
    const validationError = validateProfileImageFiles({
      files,
      currentCount: existingActiveCount + selectedImages.length,
    });

    if (validationError) {
      setImageError(validationError);
      return;
    }

    setImageError(null);
    setSelectedImages((prev) => [
      ...prev,
      ...files.map((file) => ({
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
  };

  const handleRemoveSelectedImage = (id: string) => {
    setSelectedImages((prev) => {
      const image = prev.find((item) => item.id === id);
      if (image) URL.revokeObjectURL(image.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
    setImageError(null);
  };

  const handleToggleExistingImageRemoval = (id: string) => {
    setRemovedImageIds((prev) =>
      prev.includes(id) ? prev.filter((imageId) => imageId !== id) : [...prev, id],
    );
    setImageError(null);
  };

  const handleGlobalSave = async () => {
    if (!profileFormRef.current || !socialsFormRef.current) return;

    const isProfileValid = profileFormRef.current.validate();
    const isSocialsValid = socialsFormRef.current.validate();

    if (!isProfileValid || !isSocialsValid) return; 

    setGlobalSaving(true);
    profileFormRef.current.setExternalApiError(null);
    socialsFormRef.current.setExternalApiError(null);
    profileFormRef.current.setExternalSuccess(false);
    socialsFormRef.current.setExternalSuccess(false);

    try {
      const profileData = profileFormRef.current.getData();
      const socialsData = socialsFormRef.current.getData();

      const updatedProfile = await patchMemberProfile(
        buildMemberProfileFormData({
          data: {
            ...profileData,
            ...socialsData,
          },
          images: selectedImages.map((image) => image.file),
          removeImageIds: removedImageIds,
        }),
      );

      selectedImages.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
      setSelectedImages([]);
      setRemovedImageIds([]);
      setImageError(null);
      setProfile(updatedProfile);

      profileFormRef.current.setExternalSuccess(true);
      socialsFormRef.current.setExternalSuccess(true);
    } catch (err: unknown) {
      const fallbackMsg =
        err instanceof Error
          ? err.message
          : "Failed to save profile structural updates.";
      profileFormRef.current.setExternalApiError(fallbackMsg);
      socialsFormRef.current.setExternalApiError(fallbackMsg);
    } finally {
      setGlobalSaving(false);
    }
  };

  return (
    <div className="mx-auto flex w-full flex-col gap-5 pb-6">
      <section className="dashboard-reveal dashboard-shine overflow-hidden rounded-3xl border border-brand-primary/20 bg-gradient-to-br from-brand-light via-white to-brand-accent/10 p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="dashboard-float-icon flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-xl font-extrabold text-brand-primary shadow-sm ring-1 ring-brand-primary/15">
              {initials}
            </div>
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-sunshine/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
                <Sparkles size={14} />
                Member profile
              </div>
              <h1 className="text-2xl font-extrabold leading-tight text-ui-text-main md:text-3xl">
                {fullName || "Casa de Bloom Member"}
              </h1>
              <p className="mt-1 text-sm font-semibold leading-6 text-ui-text-muted">
                Keep your details fresh so check-in, invitations, and community
                connections feel effortless.
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[28rem]">
            <div className="dashboard-interactive-card rounded-2xl border border-brand-primary/15 bg-white/75 p-3">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                Member ID
              </p>
              <p className="mt-1 truncate text-sm font-extrabold text-ui-text-main">
                {profile?.cb_id || "-"}
              </p>
            </div>
            <div className="dashboard-interactive-card rounded-2xl border border-brand-accent/20 bg-white/75 p-3">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                Email
              </p>
              <p className="mt-1 truncate text-sm font-extrabold text-ui-text-main">
                {profile?.email || "-"}
              </p>
            </div>
            <div className="dashboard-interactive-card rounded-2xl border border-brand-secondary/25 bg-white/75 p-3">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-secondary">
                Type
              </p>
              <p className="mt-1 capitalize text-sm font-extrabold text-ui-text-main">
                {profile?.participant_type || "guest"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="dashboard-reveal dashboard-interactive-card rounded-3xl border border-ui-border bg-white/80 p-5 shadow-sm backdrop-blur-md md:p-7">
          <FormComponent
            ref={profileFormRef}
            title={
              <>
                <span className="dashboard-float-icon flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light text-brand-primary">
                  <UserCheck size={18} />
                </span>
                Personal Details
              </>
            }
            subtitle="Manage the information used for invitations, check-in, and event communication."
            fields={profileFields}
            initialData={profileInitialData}
            submitLabel={null} 
            successMessage="Personal details updated successfully!"
            onSubmit={() => {}}
          />
        </section>

        <div className="flex flex-col gap-5">
          <section
            className="dashboard-reveal dashboard-interactive-card rounded-3xl border border-ui-border bg-white/80 p-5 shadow-sm backdrop-blur-md md:p-7"
            style={{ "--dashboard-delay": "120ms" } as React.CSSProperties}
          >
            <FormComponent
              ref={socialsFormRef}
              title={
                <>
                  <span className="dashboard-float-icon flex h-9 w-9 items-center justify-center rounded-xl bg-brand-accent/10 text-brand-accent">
                    <Share2 size={18} />
                  </span>
                  Social Links
                </>
              }
              subtitle="Connect online handles and websites so the community can find you."
              fields={socialsFields}
              initialData={socialsInitialData}
              submitLabel={null}
              successMessage="Social profiles updated successfully!"
              onSubmit={() => {}}
            />
          </section>

          <section
            className="dashboard-reveal dashboard-shine rounded-3xl border border-brand-secondary/30 bg-brand-secondary/5 p-5 shadow-sm md:p-6"
            style={{ "--dashboard-delay": "220ms" } as React.CSSProperties}
          >
            <div className="flex items-start gap-3">
              <div className="dashboard-float-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-secondary shadow-sm">
                <BadgeCheck size={20} />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-ui-text-main">
                  Profile polish
                </h2>
                <p className="mt-1 text-sm font-medium leading-6 text-ui-text-muted">
                  Complete profiles help Casa de Bloom prepare better welcomes,
                  invitations, name checks, and community introductions.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              <ProfileHint icon={<Mail size={15} />} label="Email stays locked to protect your account." />
              <ProfileHint icon={<Phone size={15} />} label="Phone helps with event-day coordination." />
              <ProfileHint icon={<Globe size={15} />} label="Social links make collaboration easier." />
            </div>
          </section>

          <div
            className="dashboard-reveal"
            style={{ "--dashboard-delay": "320ms" } as React.CSSProperties}
          >
            <ProfileImageUploader
              existingImages={profile.images ?? []}
              removedImageIds={removedImageIds}
              selectedImages={selectedImages}
              error={imageError}
              disabled={globalSaving}
              onSelectFiles={handleSelectImages}
              onRemoveSelected={handleRemoveSelectedImage}
              onToggleExistingRemoval={handleToggleExistingImageRemoval}
            />
          </div>
        </div>
      </div>

      <div className="sticky bottom-4 z-30 flex justify-end pt-2">
        <button
          type="button"
          disabled={globalSaving}
          onClick={handleGlobalSave}
          className="dashboard-shine flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary px-8 py-3.5 font-semibold text-white shadow-lg shadow-brand-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {globalSaving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving Profile Updates...
            </>
          ) : (
            "Save Profile Details"
          )}
        </button>
      </div>
    </div>
  );
}

function ProfileHint({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="dashboard-interactive-card flex items-center gap-2 rounded-2xl border border-ui-border bg-white/70 px-3 py-2 text-xs font-semibold text-ui-text-muted">
      <span className="text-brand-primary">{icon}</span>
      {label}
    </div>
  );
}
