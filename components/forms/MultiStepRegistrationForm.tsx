"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  RotateCcw,
} from "lucide-react";
import ComplianceStep from "./ComplianceStep";
import CommunityGuidelinesContent from "./CommunityGuidelinesContent";
import ProfileImageUploader from "./ProfileImageUploader";
import { RegistrationRedirectLoader } from "@/components/ui/PageLoader";
import { CasaMonogram } from "@/components/branding/CasaBranding";
import {
  ProfileImage,
  SelectedProfileImage,
  validateProfileImageFiles,
} from "@/lib/profileImages";
import {
  checkRegistrationEmail,
  fetchRegistrationQuota,
  registerMember,
  RegistrationApiError,
  RegistrationCheckError,
  RegistrationQuotaResponse,
  RegisterPayload,
  RegisterResponse,
} from "@/lib/services/register";
import { REGISTRATION_CELEBRATION_KEY } from "@/lib/registrationCelebration";
import {
  REGISTRATION_GENDER_ERROR,
  normalizeRegistrationGender,
} from "@/lib/registrationGender";
import {
  clearRegistrationDraft,
  loadRegistrationDraft,
  loadRegistrationDraftPhotos,
  saveRegistrationDraft,
  saveRegistrationDraftPhotos,
} from "@/lib/registrationDraft";

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "url"
    | "password"
    | "number"
    | "select"
    | "textarea"
    | "toggle"
    | "binary-choice";
  required?: boolean;
  colSpan?: 1 | 2;
  placeholder?: string;
  options?: { label: string; value: string; eventId?: string }[];
  icon?: React.ReactNode;
  requiredMessage?: string;
  invalidMessage?: string;
  helperText?: string;
  visibleWhen?: {
    field: string;
    equals: RegistrationFormValue;
  };
}

export interface CustomStep {
  key: string;
  label: string;
  subtitle?: string;
  img: string;
  desktopImg?: string;
  fields: FormField[];
}

export type RegistrationFormValue =
  | string
  | number
  | boolean
  | null
  | undefined;
export type RegistrationFormData = Record<string, RegistrationFormValue>;

interface MultiStepRegistrationFormProps {
  title: string;
  participantType: "guest" | "volunteer";
  steps: CustomStep[];
  initialFormData: RegistrationFormData;
  onSubmit?: (formData: RegistrationFormData) => void;
  onRegistrationComplete?: (
    result: RegisterResponse,
    formData: RegistrationFormData
  ) => void;
  initialProfileImages?: ProfileImage[];
  finalSubmitLabel?: string;
  isSpecialInvite?: boolean;
  lockedFields?: string[];
}

const COMPLIANCE_STEP = {
  key: "compliance" as const,
  label: "Final Confirmations",
  subtitle: "Confirm the essentials before we save your place.",
  img: "/assets/images/WhatsApp Image 2026-06-16 at 2.56.56 AM (3).webp",
  desktopImg: "/assets/images/registration_desktop_confirmations.webp",
};

const COMPLIANCE_ERROR_MESSAGES: Record<string, string> = {
  reality_show_understood:
    "You must confirm you understand Casa de Bloom is a community-centered Reality Show.",
  photoReleaseAccepted:
    "You must confirm you understand photos and videos will be taken.",
  positive_experience_agreed:
    "You must agree to help create a positive experience for everyone.",
  ageConfirmed: "You must confirm you are at least 21 years old.",
  guidelinesAccepted:
    "You must confirm you have read the Community Guidelines & Terms.",
};

const fieldGroupClass =
  "relative border-b border-ui-border py-0.5 flex items-center group mb-2.5 transition-colors focus-within:border-brand-primary";
const inputClass =
  "peer w-full bg-transparent text-ui-text-main text-sm focus:outline-none pr-8 pt-4 pb-1 placeholder-transparent";
const textareaClass =
  "peer w-full bg-transparent text-ui-text-main text-sm focus:outline-none pr-8 pt-8 pb-2 placeholder-transparent min-h-20 resize-none";
const labelClass =
  "absolute left-0 top-4 text-ui-text-muted text-sm transition-all duration-200 pointer-events-none origin-left peer-focus:top-0 peer-focus:text-xs peer-focus:text-brand-primary peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-brand-primary";
const textareaLabelClass =
  "absolute left-0 top-2 text-ui-text-muted text-sm transition-all duration-200 pointer-events-none origin-left peer-focus:top-0 peer-focus:text-xs peer-focus:text-brand-primary peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-brand-primary";
const selectLabelClass =
  "absolute left-0 top-0 text-ui-text-muted text-xs pointer-events-none";
const selectClass =
  "w-full bg-transparent text-ui-text-main text-sm focus:outline-none pr-8 pt-4 pb-1 appearance-none cursor-pointer";

const hasFieldValue = (value: RegistrationFormValue): boolean =>
  value !== undefined &&
  value !== null &&
  value !== "" &&
  (typeof value !== "string" || !!value.trim());

const isFieldVisible = (
  field: FormField,
  data: RegistrationFormData,
): boolean =>
  !field.visibleWhen ||
  data[field.visibleWhen.field] === field.visibleWhen.equals;

const MIN_EXACT_AGE = 21;
const MAX_EXACT_AGE = 120;
const EXACT_AGE_ERROR =
  "Exact age must be a whole number between 21 and 120.";
const REGISTRATION_CLOSED_MESSAGE = "Registration is closed for this event.";
const GENDER_QUOTA_UNAVAILABLE_MESSAGE =
  "This gender cannot register because its quota is full.";

function quotaGenderKey(gender: string): "male" | "female" | null {
  const normalized = normalizeRegistrationGender(gender);

  if (normalized === "Male") return "male";
  if (normalized === "Female") return "female";

  return null;
}

function genderCannotRegister(
  quota: RegistrationQuotaResponse | null,
  gender: string,
): boolean {
  const key = quotaGenderKey(gender);
  if (!quota || !key) return false;

  const unavailable = quota.unavailable_genders?.some(
    (item) => item.toLowerCase() === key,
  );

  return unavailable || quota[key]?.can_register === false;
}

function allRegistrationGendersUnavailable(
  quota: RegistrationQuotaResponse | null,
): boolean {
  return (
    genderCannotRegister(quota, "Male") &&
    genderCannotRegister(quota, "Female")
  );
}

export default function MultiStepRegistrationForm({
  title,
  participantType,
  steps,
  initialFormData,
  onSubmit,
  onRegistrationComplete,
  initialProfileImages = [],
  finalSubmitLabel = "I'm Ready for Casa de Bloom.",
  isSpecialInvite = false,
  lockedFields = [],
}: MultiStepRegistrationFormProps) {
  const router = useRouter();
  const [visiblePasswords, setVisiblePasswords] = useState<
    Record<string, boolean>
  >({});

  // Full step sequence: custom steps → compliance → submit
  const allSteps = [...steps, COMPLIANCE_STEP];

  const [formData, setFormData] = useState<RegistrationFormData>({
    reality_show_understood: false,
    photoReleaseAccepted: false,
    positive_experience_agreed: false,
    ageConfirmed: false,
    guidelinesAccepted: false,
    ...initialFormData,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  const [checkedEmail, setCheckedEmail] = useState<{
    email: string;
    eventDate: string;
    emailExists: boolean;
    isRegistered: boolean;
  } | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [quota, setQuota] = useState<RegistrationQuotaResponse | null>(null);
  const [quotaEventDate, setQuotaEventDate] = useState("");
  const [isCheckingQuota, setIsCheckingQuota] = useState(false);
  const [selectedImages, setSelectedImages] = useState<SelectedProfileImage[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [draftReady, setDraftReady] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [draftPhotoWarning, setDraftPhotoWarning] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const formScrollRef = useRef<HTMLDivElement | null>(null);
  const previousStepIndexRef = useRef(currentIndex);
  const selectedImagesRef = useRef<SelectedProfileImage[]>([]);
  const formDataRef = useRef(formData);
  const draftResumeIndexRef = useRef(0);
  const draftSavingPausedRef = useRef(false);

  formDataRef.current = formData;

  const scrollToRegistrationError = (targetId?: string) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const container = formScrollRef.current;
        const target = targetId
          ? document.getElementById(targetId)
          : container?.querySelector<HTMLElement>(
              '[data-registration-error="true"]',
            );

        if (!target) return;

        target.scrollIntoView({ behavior: "smooth", block: "center" });
        const fieldName = target.dataset.field;
        if (fieldName) {
          document.getElementById(fieldName)?.focus({ preventScroll: true });
        }
      });
    });
  };

  useEffect(() => {
    selectedImagesRef.current = selectedImages;
  }, [selectedImages]);

  useEffect(() => {
    let active = true;
    const restoreDraft = async () => {
      const draft = loadRegistrationDraft(participantType);
      const photoFiles = await loadRegistrationDraftPhotos(participantType);
      if (!active) return;

      if (draft) {
        setFormData((current) => ({
          ...current,
          ...draft.formData,
          password: "",
          confirmPassword: "",
          reality_show_understood: false,
          photoReleaseAccepted: false,
          positive_experience_agreed: false,
          ageConfirmed: false,
          guidelinesAccepted: false,
        }));
        const savedIndex = Math.min(
          Math.max(draft.currentIndex, 0),
          allSteps.length - 1,
        );
        const requiresPassword = steps[0]?.fields.some(
          (field) => field.name === "password",
        );
        if (requiresPassword && savedIndex > 0) {
          draftResumeIndexRef.current = savedIndex;
          setCurrentIndex(0);
        } else {
          setCurrentIndex(savedIndex);
        }
      }

      if (photoFiles.length) {
        setSelectedImages(
          photoFiles.map((file) => ({
            id:
              typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : `${file.name}-${file.lastModified}-${Math.random()}`,
            file,
            previewUrl: URL.createObjectURL(file),
          })),
        );
      }
      setDraftRestored(Boolean(draft || photoFiles.length));
      setDraftReady(true);
    };
    restoreDraft();
    return () => {
      active = false;
    };
    // Draft restoration must run only once for this registration role.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantType]);

  useEffect(() => {
    if (!draftReady || isRedirecting || draftSavingPausedRef.current) return;
    const timer = window.setTimeout(() => {
      saveRegistrationDraft(participantType, formData, currentIndex);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [currentIndex, draftReady, formData, isRedirecting, participantType]);

  useEffect(() => {
    if (!draftReady || isRedirecting || draftSavingPausedRef.current) return;
    const timer = window.setTimeout(() => {
      saveRegistrationDraftPhotos(
        participantType,
        selectedImages.map((image) => image.file),
      ).then((saved) => setDraftPhotoWarning(!saved && selectedImages.length > 0));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [draftReady, isRedirecting, participantType, selectedImages]);

  useEffect(() => {
    if (!draftReady) return;
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      if (isRedirecting || draftSavingPausedRef.current) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [draftReady, isRedirecting]);

  useEffect(() => {
    if (previousStepIndexRef.current === currentIndex) return;

    previousStepIndexRef.current = currentIndex;
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      formScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, [currentIndex]);

  useEffect(() => {
    return () => {
      selectedImagesRef.current.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, []);

  useEffect(() => {
    const selectedEventDate =
      typeof formData.eventDate === "string" ? formData.eventDate.trim() : "";
    const eventDateField = steps
      .flatMap((step) => step.fields)
      .find((field) => field.name === "eventDate");
    const selectedEventId = eventDateField?.options?.find(
      (option) => option.value === selectedEventDate,
    )?.eventId;

    if (!selectedEventDate) {
      setQuota(null);
      setQuotaEventDate("");
      setIsCheckingQuota(false);
      return;
    }

    const controller = new AbortController();
    setQuota(null);
    setQuotaEventDate(selectedEventDate);
    setIsCheckingQuota(true);

    fetchRegistrationQuota(
      { eventId: selectedEventId, eventDate: selectedEventDate },
      { signal: controller.signal },
    )
      .then((result) => {
        setQuota(result);
        const selectedGender =
          typeof formDataRef.current.gender === "string"
            ? formDataRef.current.gender
            : "";

        setErrors((prev) => {
          const nextErrors = { ...prev };
          delete nextErrors.eventDate;
          delete nextErrors.gender;

          if (isSpecialInvite) {
            return nextErrors;
          }

          if (
            result.registration_closed ||
            allRegistrationGendersUnavailable(result)
          ) {
            nextErrors.eventDate = REGISTRATION_CLOSED_MESSAGE;
          } else if (genderCannotRegister(result, selectedGender)) {
            nextErrors.gender = GENDER_QUOTA_UNAVAILABLE_MESSAGE;
          }

          return nextErrors;
        });
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setQuota(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsCheckingQuota(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [formData.eventDate, isSpecialInvite, steps]);

  const getStringValue = (name: string): string => {
    const value = formData[name];
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    return "";
  };

  const getOptionalStringValue = (name: string): string | undefined => {
    const value = getStringValue(name);
    return value || undefined;
  };

  const getStringValueFromData = (
    data: RegistrationFormData,
    name: string
  ): string => {
    const value = data[name];
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    return "";
  };

  const getFieldError = (
    field: FormField,
    data: RegistrationFormData
  ): string | null => {
    const val = data[field.name];
    const textValue = getStringValueFromData(data, field.name);

    if (field.required && !hasFieldValue(val)) {
      return field.requiredMessage || `${field.label} is required.`;
    }

    if (
      field.name === "eventDate" &&
      !isSpecialInvite &&
      textValue &&
      quotaEventDate === textValue &&
      (quota?.registration_closed || allRegistrationGendersUnavailable(quota))
    ) {
      return REGISTRATION_CLOSED_MESSAGE;
    }

    if (field.name === "gender" && textValue) {
      if (!normalizeRegistrationGender(textValue)) {
        return REGISTRATION_GENDER_ERROR;
      }

      if (!isSpecialInvite && genderCannotRegister(quota, textValue)) {
        return GENDER_QUOTA_UNAVAILABLE_MESSAGE;
      }
    } else if (
      field.type === "select" &&
      textValue &&
      field.options?.length &&
      !field.options.some((option) => option.value === textValue)
    ) {
      return field.invalidMessage || `Choose a valid ${field.label}.`;
    }

    if (
      field.type === "email" &&
      textValue &&
      !/\S+@\S+\.\S+/.test(textValue)
    ) {
      return field.invalidMessage || "Valid email is required.";
    }

    if (field.name === "exactAge" && textValue) {
      const age = Number(textValue);
      if (
        !Number.isInteger(age) ||
        age < MIN_EXACT_AGE ||
        age > MAX_EXACT_AGE
      ) {
        return field.invalidMessage || EXACT_AGE_ERROR;
      }
    } else if (field.type === "number" && textValue && Number(textValue) < 21) {
      return field.invalidMessage || "You must be at least 21 years old.";
    }

    if (field.name === "password" && textValue && textValue.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (
      field.name === "confirmPassword" &&
      textValue &&
      textValue !== getStringValueFromData(data, "password")
    ) {
      return "Passwords do not match.";
    }

    return null;
  };

  const isFieldLocked = (name: string) => lockedFields.includes(name);

  const handleFieldChange = (name: string, value: RegistrationFormValue) => {
    if (isFieldLocked(name)) return;
    draftSavingPausedRef.current = false;

    if (name === "email" || name === "eventDate") {
      setCheckedEmail(null);
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      steps.flatMap((step) => step.fields).forEach((field) => {
        if (field.visibleWhen && !isFieldVisible(field, updated)) {
          updated[field.name] = null;
        }
      });

      // Perform real-time validation updates
      setErrors((prevErrors) => {
        const nextErrors = { ...prevErrors };

        steps.flatMap((step) => step.fields).forEach((field) => {
          if (!isFieldVisible(field, updated)) {
            delete nextErrors[field.name];
          }
        });

        // 1. Password validation
        if (name === "password") {
          const passwordValue = typeof value === "string" ? value : "";

          if (passwordValue && passwordValue.length < 6) {
            nextErrors.password = "Password must be at least 6 characters.";
          } else {
            delete nextErrors.password;
          }

          // Re-validate confirmPassword when password changes
          const confirmPasswordValue =
            typeof updated.confirmPassword === "string"
              ? updated.confirmPassword
              : "";
          if (confirmPasswordValue) {
            if (passwordValue !== confirmPasswordValue) {
              nextErrors.confirmPassword = "Passwords do not match.";
            } else {
              delete nextErrors.confirmPassword;
            }
          }
        }

        // 2. Confirm Password validation
        if (name === "confirmPassword") {
          const confirmPasswordValue = typeof value === "string" ? value : "";
          const passwordValue =
            typeof updated.password === "string" ? updated.password : "";

          if (confirmPasswordValue && confirmPasswordValue !== passwordValue) {
            nextErrors.confirmPassword = "Passwords do not match.";
          } else {
            delete nextErrors.confirmPassword;
          }
        }

        // 3. Clear regular required errors when typed into
        if (name !== "password" && name !== "confirmPassword") {
          if (hasFieldValue(value)) {
            delete nextErrors[name];
          }
        }

        if (name === "eventDate") {
          delete nextErrors.gender;
        }

        if (name === "gender") {
          const genderField = steps
            .flatMap((step) => step.fields)
            .find((field) => field.name === "gender");
          const genderError = genderField
            ? getFieldError(genderField, updated)
            : null;

          if (genderError) {
            nextErrors.gender = genderError;
          } else {
            delete nextErrors.gender;
          }
        }

        if (hasAttemptedContinue) {
          const changedField = steps
            .flatMap((step) => step.fields)
            .find((field) => field.name === name);
          const changedFieldError = changedField
            ? getFieldError(changedField, updated)
            : COMPLIANCE_ERROR_MESSAGES[name] && !updated[name]
            ? COMPLIANCE_ERROR_MESSAGES[name]
            : null;

          if (changedFieldError) {
            nextErrors[name] = changedFieldError;
          } else {
            delete nextErrors[name];
          }
        }

        return nextErrors;
      });

      return updated;
    });
  };

  const validateStep = (key: string): boolean => {
    const errs: Record<string, string> = {};
    let profileImageError: string | null = null;

    if (key === "compliance") {
      Object.entries(COMPLIANCE_ERROR_MESSAGES).forEach(([name, message]) => {
        if (!formData[name]) {
          errs[name] = message;
        }
      });
    } else {
      const stepObj = steps.find((s) => s.key === key);
      if (stepObj) {
        stepObj.fields
          .filter((field) => isFieldVisible(field, formData))
          .forEach((field) => {
            const fieldError = getFieldError(field, formData);
            if (fieldError) {
              errs[field.name] = fieldError;
            }
          });
      }

      if (key === steps[0]?.key && initialProfileImages.length + selectedImages.length === 0) {
        profileImageError = "Upload at least 1 profile photo to continue.";
      }
    }

    setErrors(errs);
    setImageError(profileImageError);
    return Object.keys(errs).length === 0 && !profileImageError;
  };

  const validateStepWithPreflight = async (key: string): Promise<boolean> => {
    const stepObj = steps.find((s) => s.key === key);
    const hasEmailField = stepObj?.fields.some((field) => field.name === "email");
    const hasPasswordField = stepObj?.fields.some((field) => field.name === "password");
    const email = getStringValue("email").trim().toLowerCase();
    const eventDate = getStringValue("eventDate").trim();

    if (hasEmailField && hasPasswordField && email && eventDate) {
      const cachedResult =
        checkedEmail?.email === email && checkedEmail.eventDate === eventDate
          ? checkedEmail
          : null;

      if (cachedResult?.emailExists || cachedResult?.isRegistered) {
        setErrors((prev) => ({
          ...prev,
          email: "This email already has an account. Please log in or use a different email.",
        }));
        setImageError(null);
        return false;
      }

      if (!cachedResult) {
        setIsCheckingEmail(true);
        try {
          const result = await checkRegistrationEmail(email, eventDate, participantType);
          setCheckedEmail({ email, eventDate, ...result });
          if (result.isRegistered || result.emailExists) {
            setErrors((prev) => ({
              ...prev,
              email: "This email already has an account. Please log in or use a different email.",
            }));
            setImageError(null);
            return false;
          }
        } catch (err: unknown) {
          const field = err instanceof RegistrationCheckError && err.field ? err.field : "email";
          setErrors((prev) => ({
            ...prev,
            [field]:
              err instanceof Error
                ? err.message
                : "Unable to check registration availability right now. Please try again.",
          }));
          return false;
        } finally {
          setIsCheckingEmail(false);
        }
      }
    }

    return validateStep(key);
  };

  const buildPayload = (): RegisterPayload => {
    const exactAge = getStringValue("exactAge");
    const base: RegisterPayload = {
      participant_type: participantType,
      first_name: getStringValue("firstName"),
      last_name: getStringValue("lastName"),
      email: getStringValue("email"),
      phone: getOptionalStringValue("phone"),
      password: getOptionalStringValue("password"),
      facebook: getOptionalStringValue("facebook"),
      instagram: getOptionalStringValue("instagram"),
      linkedin: getOptionalStringValue("linkedin"),
      website: getOptionalStringValue("website"),
      profession: getOptionalStringValue("profession"),
      business_name: getOptionalStringValue("businessName"),
      city: getOptionalStringValue("city"),
      age_range: getOptionalStringValue("ageRange"),
      exact_age: exactAge ? Number(exactAge) : undefined,
      gender: normalizeRegistrationGender(getStringValue("gender")) || undefined,
      event_date: getStringValue("eventDate"),
      reality_show_understood: !!formData.reality_show_understood,
      community_guidelines_accepted: !!formData.guidelinesAccepted,
      community_guidelines_version: "1.0",
      photo_video_release_accepted: !!formData.photoReleaseAccepted,
      positive_experience_agreed: !!formData.positive_experience_agreed,
      age_confirmed_21_plus: !!formData.ageConfirmed,
      special_invite: isSpecialInvite ? true : undefined,
    };

    if (participantType === "guest") {
      base.how_heard = getOptionalStringValue("hearAboutUs");
      base.why_attend = getOptionalStringValue("whyAttend");
      base.attending_as = getOptionalStringValue("attendanceMode");
      base.emergency_contact = getOptionalStringValue("emergencyContact");
      base.food_allergies = getOptionalStringValue("foodAllergies");
      base.bringing_to_grill = getOptionalStringValue("communityGrill");
      base.service_offering = getOptionalStringValue("serviceOffering");
      base.business_name =
        formData.ownsBusiness === true
          ? getOptionalStringValue("businessName")
          : undefined;
      base.owns_business =
        typeof formData.ownsBusiness === "boolean"
          ? formData.ownsBusiness
          : undefined;
      base.interested_in_business_podcast =
        formData.ownsBusiness === true &&
        typeof formData.interestedInBusinessPodcast === "boolean"
          ? formData.interestedInBusinessPodcast
          : undefined;
      base.willing_to_share_social = !!formData.spreadTheWord;
    } else {
      base.availability = getOptionalStringValue("availabilityTime");
      base.skills_offered = getOptionalStringValue("skillsContribution");
      base.can_capture_media = !!formData.takePhotos;
    }

    return base;
  };

  const handleSelectImages = (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []);
    if (files.length === 0) {
      setImageError(
        "We couldn't read the selected photo(s). Please try again, or pick different photos.",
      );
      return;
    }
    draftSavingPausedRef.current = false;

    const validationError = validateProfileImageFiles({
      files,
      currentCount: initialProfileImages.length + selectedImages.length,
      currentFiles: selectedImages.map((image) => image.file),
    });
    if (validationError) {
      setImageError(validationError);
      return;
    }

    const newImages: typeof selectedImages = [];
    try {
      for (const file of files) {
        newImages.push({
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `${file.name}-${file.lastModified}-${Math.random()}`,
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }
      setImageError(null);
      setSelectedImages((prev) => [...prev, ...newImages]);
    } catch {
      newImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
      setImageError(
        "We couldn't process the selected photo(s). Please try again, or pick different photos.",
      );
    }
  };

  const handleRemoveSelectedImage = (id: string) => {
    setSelectedImages((prev) => {
      const image = prev.find((item) => item.id === id);
      if (image) URL.revokeObjectURL(image.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
    setImageError(null);
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    draftSavingPausedRef.current = false;
    setHasAttemptedContinue(true);
    setApiError(null);
    const currentKey = allSteps[currentIndex].key;

    if (!(await validateStepWithPreflight(currentKey))) {
      scrollToRegistrationError();
      return;
    }

    const isLastStep = currentIndex === allSteps.length - 1;

    if (!isLastStep) {
      setHasAttemptedContinue(false);
      if (currentIndex === 0 && draftResumeIndexRef.current > 0) {
        const resumeIndex = draftResumeIndexRef.current;
        draftResumeIndexRef.current = 0;
        setCurrentIndex(resumeIndex);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
      return;
    }

    setIsSubmitting(true);
    let keepLoading = false;
    try {
      const payload = buildPayload();
      const result = await registerMember(payload, {
        images: selectedImages.map((image) => image.file),
      });

      await clearRegistrationDraft(participantType);
      keepLoading = true;
      setIsRedirecting(true);
      window.sessionStorage.setItem(REGISTRATION_CELEBRATION_KEY, "1");
      if (onRegistrationComplete) {
        onRegistrationComplete(result, formData);
        return;
      }

      const query = new URLSearchParams({
        invitationNumber: result.invitation_number,
        cbId: result.cb_id,
        name: `${getStringValue("firstName")} ${getStringValue("lastName")}`.trim(),
        eventDate: getStringValue("eventDate"),
        participantType,
        recordType: result.record_type,
        recordId: result.record_id,
        registrationId: result.registration_id ?? "",
        volunteerId: result.volunteer_id ?? "",
        email: getStringValue("email"),
        phone: getStringValue("phone"),
      });
      router.push(`/register/confirmation?${query.toString()}`);
    } catch (err: unknown) {
      keepLoading = false;
      setIsRedirecting(false);
      if (err instanceof RegistrationApiError && err.fieldErrors.gender) {
        const genderStepIndex = steps.findIndex((step) =>
          step.fields.some((field) => field.name === "gender")
        );
        setErrors({ gender: err.fieldErrors.gender });
        setApiError(null);
        setHasAttemptedContinue(true);
        if (genderStepIndex >= 0) {
          setCurrentIndex(genderStepIndex);
        }
        scrollToRegistrationError("gender-error");
        return;
      }
      setApiError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      scrollToRegistrationError("api-error");
    } finally {
      if (!keepLoading) {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    setErrors({});
    setApiError(null);
    setHasAttemptedContinue(false);
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleStartOver = async () => {
    draftSavingPausedRef.current = true;
    await clearRegistrationDraft(participantType);
    selectedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setSelectedImages([]);
    setFormData({
      reality_show_understood: false,
      photoReleaseAccepted: false,
      positive_experience_agreed: false,
      ageConfirmed: false,
      guidelinesAccepted: false,
      ...initialFormData,
    });
    setCurrentIndex(0);
    draftResumeIndexRef.current = 0;
    setDraftRestored(false);
    setDraftPhotoWarning(false);
    setErrors({});
    setApiError(null);
    setCheckedEmail(null);
  };

  const handleExistingAccountLogin = async () => {
    saveRegistrationDraft(participantType, formData, currentIndex);
    await saveRegistrationDraftPhotos(
      participantType,
      selectedImages.map((image) => image.file),
    );
    const params = new URLSearchParams({
      returnTo: "/dashboard#events",
      registrationDraft: participantType,
    });
    router.push(`/login?${params.toString()}`);
  };

  const handleUseDifferentEmail = () => {
    handleFieldChange("email", "");
    setCheckedEmail(null);
    setErrors((current) => {
      const next = { ...current };
      delete next.email;
      return next;
    });
    window.requestAnimationFrame(() => document.getElementById("email")?.focus());
  };

  const isStepValid = (key: string): boolean => {
    if (key === "compliance") {
      return Object.keys(COMPLIANCE_ERROR_MESSAGES).every(
        (name) => !!formData[name]
      );
    }

    const stepObj = steps.find((s) => s.key === key);
    if (!stepObj) return true;

    return stepObj.fields
      .filter((field) => isFieldVisible(field, formData))
      .every((field) => !getFieldError(field, formData));
  };

  const renderField = (field: FormField) => {
    const isLocked = isFieldLocked(field.name);
    const groupClass = `${fieldGroupClass} ${
      isLocked
        ? "rounded-xl border border-ui-border bg-slate-100/80 px-3 opacity-80"
        : ""
    }`;
    const lockedControlClass =
      "cursor-not-allowed text-ui-text-muted disabled:opacity-100";
    const fieldIcon = field.icon && (
      <span className="w-4 h-4 text-ui-text-muted absolute right-1 bottom-1.5 group-focus-within:text-brand-primary transition-colors flex items-center justify-center">
        {field.icon}
      </span>
    );

    switch (field.type) {
      case "select":
        return (
          <div className={groupClass}>
            <label className={selectLabelClass}>
              {field.label} {field.required ? "*" : ""}
            </label>
            <select
              id={field.name}
              className={`${selectClass} ${isLocked ? lockedControlClass : ""}`}
              value={getStringValue(field.name)}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              disabled={isLocked}
              aria-invalid={!!errors[field.name]}
              aria-describedby={
                errors[field.name] ? `${field.name}-error` : undefined
              }
            >
              <option value="" disabled>
                {field.placeholder || "-- Select Option --"}
              </option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {fieldIcon}
          </div>
        );
      case "textarea":
        return (
          <div className={`${groupClass} pt-2 pb-1`}>
            <textarea
              id={field.name}
              placeholder=" "
              value={getStringValue(field.name)}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={`${textareaClass} ${isLocked ? lockedControlClass : ""}`}
              readOnly={isLocked}
              aria-invalid={!!errors[field.name]}
              aria-describedby={
                errors[field.name] ? `${field.name}-error` : undefined
              }
            />
            <label htmlFor={field.name} className={textareaLabelClass}>
              {field.label} {field.required ? "*" : ""}
            </label>
            {fieldIcon}
          </div>
        );
      case "toggle":
        return (
          <div className="flex items-center justify-between py-2 border-b border-ui-border mt-3">
            <span className="text-sm text-ui-text-main font-medium pr-4">
              {field.label}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`text-xs ${
                  !formData[field.name]
                    ? "text-ui-text-main font-semibold"
                    : "text-ui-text-muted"
                }`}
              >
                No
              </span>
              <button
                type="button"
                onClick={() =>
                  handleFieldChange(field.name, !formData[field.name])
                }
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                  formData[field.name] ? "bg-brand-primary" : "bg-ui-border"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    formData[field.name] ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`text-xs ${
                  formData[field.name]
                    ? "text-ui-text-main font-semibold"
                    : "text-ui-text-muted"
                }`}
              >
                Yes
              </span>
            </div>
          </div>
        );
      case "binary-choice": {
        const selectedValue = formData[field.name];
        return (
          <fieldset
            id={field.name}
            tabIndex={-1}
            className="border-b border-ui-border py-3 mt-2"
            aria-describedby={
              errors[field.name] ? `${field.name}-error` : undefined
            }
          >
            <legend className="text-sm text-ui-text-main font-medium">
              {field.label} {field.required ? "*" : ""}
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-2" role="group">
              {[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ].map((option) => {
                const isSelected = selectedValue === option.value;
                return (
                  <button
                    key={option.label}
                    type="button"
                    aria-pressed={isSelected}
                    disabled={isLocked}
                    onClick={() => handleFieldChange(field.name, option.value)}
                    className={`h-10 rounded-lg border px-4 text-sm font-semibold transition-colors ${
                      isSelected
                        ? "border-brand-primary bg-brand-primary text-white shadow-sm"
                        : "border-ui-border bg-white/70 text-ui-text-main hover:border-brand-primary/60"
                    } ${isLocked ? lockedControlClass : ""}`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      }
      case "password": {
        const isVisible = !!visiblePasswords[field.name];
        return (
          <div className={groupClass}>
            <input
              type={isVisible ? "text" : "password"}
              id={field.name}
              placeholder=" "
              value={getStringValue(field.name)}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={`${inputClass} ${isLocked ? lockedControlClass : ""}`}
              readOnly={isLocked}
              aria-invalid={!!errors[field.name]}
              aria-describedby={
                errors[field.name] ? `${field.name}-error` : undefined
              }
            />
            <label htmlFor={field.name} className={labelClass}>
              {field.label} {field.required ? "*" : ""}
            </label>
            <button
              type="button"
              tabIndex={-1}
              onClick={() =>
                setVisiblePasswords((prev) => ({
                  ...prev,
                  [field.name]: !prev[field.name],
                }))
              }
              className="w-4 h-4 text-ui-text-muted absolute right-1 bottom-1.5 hover:text-brand-primary transition-colors flex items-center justify-center"
              aria-label={isVisible ? "Hide password" : "Show password"}
            >
              {isVisible ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        );
      }
      case "number":
        return (
          <div className={groupClass}>
            <input
              type="number"
              id={field.name}
              placeholder={field.placeholder || " "}
              value={getStringValue(field.name)}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={`${inputClass} ${isLocked ? lockedControlClass : ""}`}
              readOnly={isLocked}
              min={field.name === "exactAge" ? MIN_EXACT_AGE : 21}
              max={field.name === "exactAge" ? MAX_EXACT_AGE : undefined}
              step={field.name === "exactAge" ? 1 : undefined}
              aria-invalid={!!errors[field.name]}
              aria-describedby={
                errors[field.name] ? `${field.name}-error` : undefined
              }
            />
            <label htmlFor={field.name} className={labelClass}>
              {field.label} {field.required ? "*" : ""}
            </label>
            {fieldIcon}
          </div>
        );
      default:
        return (
          <div className={groupClass}>
            <input
              type={field.type}
              id={field.name}
              placeholder={field.placeholder || " "}
              value={getStringValue(field.name)}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={`${inputClass} ${isLocked ? lockedControlClass : ""}`}
              readOnly={isLocked}
              aria-invalid={!!errors[field.name]}
              aria-describedby={
                errors[field.name] ? `${field.name}-error` : undefined
              }
            />
            <label htmlFor={field.name} className={labelClass}>
              {field.label} {field.required ? "*" : ""}
            </label>
            {fieldIcon}
          </div>
        );
    }
  };

  const errorList = Object.values(errors);
  const firstErrorName = Object.keys(errors)[0];
  const currentKey = allSteps[currentIndex].key;
  const showExistingAccountActions =
    Boolean(checkedEmail?.emailExists) && currentIndex === 0;
  const currentStep = allSteps[currentIndex] as CustomStep;
  const isLastStep = currentIndex === allSteps.length - 1;
  const isCurrentStepValid = isStepValid(currentKey);
  const selectedEventDate = getStringValue("eventDate").trim();
  const quotaIsForSelectedEvent =
    !!selectedEventDate && quotaEventDate === selectedEventDate;
  const isRegistrationClosed =
    !isSpecialInvite &&
    quotaIsForSelectedEvent &&
    (!!quota?.registration_closed || allRegistrationGendersUnavailable(quota));
  const isSelectedGenderUnavailable =
    !isSpecialInvite &&
    quotaIsForSelectedEvent &&
    genderCannotRegister(quota, getStringValue("gender"));
  const isQuotaBlockingCurrentStep =
    !isSpecialInvite &&
    currentKey === steps[0]?.key &&
    (isCheckingQuota || isRegistrationClosed || isSelectedGenderUnavailable);
  const isContinueDisabled =
    isSubmitting ||
    isCheckingEmail ||
    isRedirecting ||
    isQuotaBlockingCurrentStep;
  const showValidationPrompt =
    hasAttemptedContinue && !isCurrentStepValid && errorList.length === 0;
  const validationPrompt =
    currentKey === "compliance"
      ? "Confirm each required item before submitting."
      : "Complete the required fields before continuing.";

  return (
    <main className="h-dvh overflow-hidden p-3 font-sans sm:p-4 lg:p-6">
      {isRedirecting && <RegistrationRedirectLoader />}
      {isGuidelinesOpen && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-white" role="dialog" aria-modal="true" aria-label="Community Guidelines and Terms">
          <div className="flex shrink-0 items-center justify-between border-b border-ui-border bg-white px-4 py-3 shadow-sm sm:px-6">
            <div>
              <p className="text-sm font-extrabold text-ui-text-main">Community Guidelines & Terms</p>
              <p className="text-xs text-ui-text-muted">Your registration is safely waiting behind this window.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsGuidelinesOpen(false)}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-brand-primary/20 bg-brand-light/40 px-3 py-2 text-sm font-bold text-brand-primary transition hover:border-brand-primary/35 hover:bg-brand-light"
            >
              <ArrowLeft size={17} />
              Go back to registration
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <CommunityGuidelinesContent />
          </div>
        </div>
      )}
      <div className="mx-auto flex h-full w-full max-w-6xl">
        <div className="relative flex h-full w-full min-h-0 flex-col overflow-hidden rounded-[2rem] border-2 border-white/50 bg-ui-card/30 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-2xl lg:flex-row">
          <div
            className="relative z-10 flex min-h-0 w-full flex-1 flex-col overflow-hidden lg:w-[58%] lg:flex-none"
          >
            <form
              onSubmit={handleNext}
              className="flex h-full min-h-0 w-full flex-col"
            >
              <div
                ref={formScrollRef}
                className="custom-scrollbar min-h-0 flex-1 overflow-y-auto"
              >
                <div className="relative h-40 w-full shrink-0 overflow-hidden bg-ui-text-main sm:h-48 lg:hidden">
                  {allSteps.map((s, index) => (
                    <div
                      key={`mobile-${s.key}`}
                      className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-in-out ${
                        currentIndex === index
                          ? "z-10 opacity-100"
                          : "z-0 opacity-0"
                      }`}
                    >
                      <Image
                        src={s.img}
                        alt={s.label}
                        fill
                        sizes="(max-width: 1023px) calc(100vw - 2rem), 45vw"
                        priority={index === 0}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex w-full flex-col gap-4 px-5 py-5 sm:px-7 sm:py-7 lg:min-h-full lg:justify-center lg:px-6 lg:py-6 xl:px-8 xl:py-8">
                  {draftRestored && (
                    <div className="flex items-start justify-between gap-3 rounded-2xl border border-status-active/25 bg-status-active/10 p-3 text-sm text-ui-text-main">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-status-active" />
                        <div>
                          <p className="font-bold">Welcome back. We restored your progress.</p>
                          {draftResumeIndexRef.current > 0 && <p className="mt-0.5 text-xs text-ui-text-muted">Re-enter your password, then we&apos;ll return you to your saved step.</p>}
                        </div>
                      </div>
                      <button type="button" onClick={handleStartOver} className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-brand-primary hover:underline">
                        <RotateCcw size={13} /> Start over
                      </button>
                    </div>
                  )}
                  {draftPhotoWarning && (
                    <div role="status" className="rounded-xl border border-brand-sunshine/60 bg-brand-sunshine/20 p-3 text-xs font-semibold text-ui-text-main">
                      Your answers are saved, but this browser could not preserve the selected photos. Please attach them again before submitting.
                    </div>
                  )}
                  <div className="space-y-3">
                <h1 className="text-xl font-extrabold tracking-tight text-ui-text-main sm:text-2xl">
                  {title}
                </h1>

                <div className="flex items-center">
                  {allSteps.map((s, i) => {
                    const isActive = i === currentIndex;
                    const isComplete = i < currentIndex;

                    return (
                      <React.Fragment key={s.key}>
                        <div
                          className={[
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                            isActive || isComplete
                              ? "bg-brand-primary text-white shadow-sm"
                              : "border border-ui-border bg-white text-ui-text-muted",
                          ].join(" ")}
                        >
                          {i + 1}
                        </div>
                        {i < allSteps.length - 1 && (
                          <div
                            className={[
                              "h-0.5 flex-1 transition-colors duration-300",
                              i < currentIndex
                                ? "bg-brand-primary"
                                : "bg-ui-border",
                            ].join(" ")}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3 text-left">
                {isLastStep && (
                  <CasaMonogram
                    decorative
                    className="h-14 w-14 shrink-0 drop-shadow-sm"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-brand-dark to-brand-primary bg-clip-text text-transparent">
                    {currentStep.label}
                  </h2>
                  <p className="text-xs text-ui-text-muted mt-1 font-medium">
                    {currentStep.subtitle || "Please enter your details to continue."}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {currentKey === "compliance" ? (
                  <ComplianceStep
                    formData={formData}
                    errors={errors}
                    onFieldChange={handleFieldChange}
                    onOpenGuidelines={() => setIsGuidelinesOpen(true)}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
                    {(allSteps[currentIndex] as CustomStep).fields
                      .filter((field) => isFieldVisible(field, formData))
                      .map((field) => {
                        const isFullWidth =
                          field.colSpan === 2 ||
                          field.type === "textarea" ||
                          field.type === "toggle" ||
                          field.type === "binary-choice";
                        return (
                          <div
                            key={field.name}
                            className={isFullWidth ? "sm:col-span-2" : ""}
                          >
                            {renderField(field)}
                            {errors[field.name] && (
                              <p
                                id={`${field.name}-error`}
                                data-registration-error="true"
                                data-field={field.name}
                                className="text-xs text-danger-500 -mt-2 pl-1 font-medium mb-2"
                              >
                                {errors[field.name]}
                              </p>
                            )}
                            {field.helperText && !errors[field.name] && (
                              <p className="text-[11px] leading-5 text-ui-text-muted -mt-1 mb-2 pl-1">
                                {field.helperText}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    {currentIndex === 0 && (
                      <div className="sm:col-span-2">
                        <ProfileImageUploader
                          existingImages={initialProfileImages}
                          selectedImages={selectedImages}
                          error={imageError}
                          disabled={isSubmitting || !draftReady}
                          onSelectFiles={handleSelectImages}
                          onRemoveSelected={handleRemoveSelectedImage}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isRegistrationClosed && currentKey === steps[0]?.key && (
                <div
                  id="quota-error"
                  role="alert"
                  data-registration-error="true"
                  data-field="eventDate"
                  className="flex items-start gap-2 rounded-xl border border-danger-500/30 bg-danger-500/10 p-3 text-xs font-semibold text-danger-600"
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{REGISTRATION_CLOSED_MESSAGE}</p>
                </div>
              )}


              {showValidationPrompt && (
                <div
                  id="form-validation-hint"
                  aria-live="polite"
                  data-registration-error="true"
                  className="flex items-start gap-2 rounded-xl border border-brand-sunshine/60 bg-brand-sunshine/20 p-3 text-xs font-semibold text-ui-text-main"
                >
                  <AlertCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-brand-dark"
                  />
                  <p>{validationPrompt}</p>
                </div>
              )}

              {/* API error */}
              {apiError && (
                <div
                  id="api-error"
                  role="alert"
                  data-registration-error="true"
                  className="flex items-start gap-3 bg-danger-500/10 backdrop-blur-sm border border-danger-500/30 text-danger-600 rounded-2xl p-4 text-sm shadow-sm"
                >
                  <AlertCircle
                    size={18}
                    className="shrink-0 mt-0.5 text-danger-500"
                  />
                  <div>
                    <p className="font-bold">Registration error</p>
                    <p className="text-xs opacity-90 mt-0.5">{apiError}</p>
                  </div>
                </div>
              )}

              {checkedEmail?.emailExists && currentIndex === 0 && (
                <div className="rounded-2xl border border-brand-primary/25 bg-brand-light/35 p-4">
                  <p className="text-sm font-extrabold text-ui-text-main">You already have a Casa de Bloom account.</p>
                  <p className="mt-1 text-xs leading-relaxed text-ui-text-muted">Log in to register for this event from your member dashboard.</p>
                </div>
              )}

                  </div>
                </div>

              {/* Actions stay visible while the current step scrolls. */}
              <div className="relative z-20 shrink-0 border-t border-white/60 bg-white/85 px-5 py-3 shadow-[0_-10px_30px_rgba(70,35,55,0.08)] backdrop-blur-xl sm:px-7 lg:px-6 xl:px-8">
                {showExistingAccountActions ? (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleExistingAccountLogin}
                      className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-hover"
                    >
                      <LogIn size={16} /> Log In to Continue
                    </button>
                    <button
                      type="button"
                      onClick={handleUseDifferentEmail}
                      className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-ui-border bg-white/80 px-4 py-2.5 text-sm font-bold text-ui-text-main transition hover:bg-brand-light/40 sm:min-w-44"
                    >
                      Use a Different Email
                    </button>
                  </div>
                ) : (
                <div className="flex items-center gap-4">
                  {currentIndex > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      rounded="2xl"
                      size="lg"
                      className="cursor-pointer"
                      onClick={handleBack}
                      disabled={isSubmitting}
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="primary"
                    rounded="2xl"
                    fullWidth
                    size="lg"
                    disabled={isContinueDisabled}
                    aria-describedby={
                      firstErrorName
                        ? `${firstErrorName}-error`
                        : imageError
                        ? "profile-images-error"
                        : showValidationPrompt
                        ? "form-validation-hint"
                        : undefined
                    }
                  >
                    {isSubmitting || isCheckingEmail || isRedirecting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        {isRedirecting
                          ? "Preparing invitation..."
                          : isCheckingEmail
                          ? "Checking email..."
                          : isCheckingQuota
                          ? "Checking availability..."
                          : "Submitting..."}
                      </span>
                    ) : isLastStep ? (
                      finalSubmitLabel
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </div>
                )}
              </div>
            </form>
          </div>

          <div className="absolute inset-y-4 right-4 left-[58%] z-20 hidden overflow-hidden rounded-[2rem] bg-ui-text-main shadow-[0_20px_50px_rgba(0,0,0,0.28)] lg:block">
            {allSteps.map((s, index) => (
              <div
                key={`desktop-${s.key}`}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  currentIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <Image
                  src={s.desktopImg ?? s.img}
                  alt={s.label}
                  fill
                  sizes="45vw"
                  priority={index === 0}
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ui-text-main/60 via-transparent to-ui-text-main/10 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
