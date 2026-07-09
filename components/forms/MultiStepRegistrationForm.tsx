"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import ComplianceStep from "./ComplianceStep";
import {
  checkRegistrationEmail,
  registerMember,
  RegistrationCheckError,
  RegisterPayload,
  RegisterResponse,
} from "@/lib/services/register";

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
    | "toggle";
  required?: boolean;
  colSpan?: 1 | 2;
  placeholder?: string;
  options?: { label: string; value: string }[];
  icon?: React.ReactNode;
  requiredMessage?: string;
  invalidMessage?: string;
}

export interface CustomStep {
  key: string;
  label: string;
  img: string;
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
}

const COMPLIANCE_STEP = {
  key: "compliance" as const,
  label: "Legal Compliance",
  img: "/assets/images/sea-spa-elements-close-up.jpeg",
};

const COMPLIANCE_ERROR_MESSAGES: Record<string, string> = {
  isRealityShow:
    "You must confirm you understand Casa de Bloom is a community-centered Reality Show.",
  photoReleaseAccepted:
    "You must confirm you understand photos and videos will be taken.",
  positiveExperience:
    "You must agree to help create a positive experience for everyone.",
  ageConfirmed: "You must confirm you are at least 21 years old.",
  guidelinesAccepted:
    "You must confirm you have read the Community Guidelines & Terms.",
};

const fieldGroupClass =
  "relative border-b border-ui-border py-0.5 flex items-center group mb-2.5 transition-colors focus-within:border-brand-primary";
const inputClass =
  "peer w-full bg-transparent text-ui-text-main text-sm focus:outline-none pr-8 pt-4 pb-1 placeholder-transparent";
const labelClass =
  "absolute left-0 top-4 text-ui-text-muted text-sm transition-all duration-200 pointer-events-none origin-left peer-focus:top-0 peer-focus:text-xs peer-focus:text-brand-primary peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-brand-primary";
const selectLabelClass =
  "absolute left-0 top-0 text-ui-text-muted text-xs pointer-events-none";
const selectClass =
  "w-full bg-transparent text-ui-text-main text-sm focus:outline-none pr-8 pt-4 pb-1 appearance-none cursor-pointer";

const hasFieldValue = (value: RegistrationFormValue): boolean =>
  value !== undefined &&
  value !== null &&
  value !== "" &&
  (typeof value !== "string" || !!value.trim());

export default function MultiStepRegistrationForm({
  title,
  participantType,
  steps,
  initialFormData,
  onSubmit,
  onRegistrationComplete,
}: MultiStepRegistrationFormProps) {
  const router = useRouter();
  const [visiblePasswords, setVisiblePasswords] = useState<
    Record<string, boolean>
  >({});

  // Full step sequence: custom steps → compliance → submit
  const allSteps = [...steps, COMPLIANCE_STEP];

  const [formData, setFormData] = useState<RegistrationFormData>({
    isRealityShow: false,
    photoReleaseAccepted: false,
    positiveExperience: false,
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
  const [apiError, setApiError] = useState<string | null>(null);

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
      field.type === "email" &&
      textValue &&
      !/\S+@\S+\.\S+/.test(textValue)
    ) {
      return field.invalidMessage || "Valid email is required.";
    }

    if (field.type === "number" && textValue && Number(textValue) < 21) {
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

  const handleFieldChange = (name: string, value: RegistrationFormValue) => {
    if (name === "email" || name === "eventDate") {
      setCheckedEmail(null);
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Perform real-time validation updates
      setErrors((prevErrors) => {
        const nextErrors = { ...prevErrors };

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

    if (key === "compliance") {
      Object.entries(COMPLIANCE_ERROR_MESSAGES).forEach(([name, message]) => {
        if (!formData[name]) {
          errs[name] = message;
        }
      });
    } else {
      const stepObj = steps.find((s) => s.key === key);
      if (stepObj) {
        stepObj.fields.forEach((field) => {
          const fieldError = getFieldError(field, formData);
          if (fieldError) {
            errs[field.name] = fieldError;
          }
        });
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStepWithPreflight = async (key: string): Promise<boolean> => {
    const isValid = validateStep(key);
    if (!isValid) return false;

    const stepObj = steps.find((s) => s.key === key);
    const hasEmailField = stepObj?.fields.some((field) => field.name === "email");
    const hasPasswordField = stepObj?.fields.some((field) => field.name === "password");
    const email = getStringValue("email").trim().toLowerCase();
    const eventDate = getStringValue("eventDate").trim();

    if (!hasEmailField || !hasPasswordField || !email || !eventDate) return true;

    if (checkedEmail?.email === email && checkedEmail.eventDate === eventDate) {
      if (!checkedEmail.emailExists && !checkedEmail.isRegistered) return true;

      setErrors((prev) => ({
        ...prev,
        email: checkedEmail.isRegistered
          ? "This email already has an account. Please log in or use a different email."
          : "This email already has an account. Please log in or use a different email.",
      }));
      return false;
    }

    setIsCheckingEmail(true);
    try {
      const result = await checkRegistrationEmail(email, eventDate, participantType);
      setCheckedEmail({
        email,
        eventDate,
        emailExists: result.emailExists,
        isRegistered: result.isRegistered,
      });

      if (result.isRegistered || result.emailExists) {
        setErrors((prev) => ({
          ...prev,
          email: result.isRegistered
            ? "This email already has an account. Please log in or use a different email."
            : "This email already has an account. Please log in or use a different email.",
        }));
        return false;
      }

      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors.email;
        return nextErrors;
      });
      return true;
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
      gender: getOptionalStringValue("gender"),
      event_date: getStringValue("eventDate"),
      community_guidelines_accepted: !!formData.guidelinesAccepted,
      community_guidelines_version: "1.0",
      photo_video_release_accepted: !!formData.photoReleaseAccepted,
      age_confirmed_21_plus: !!formData.ageConfirmed,
    };

    if (participantType === "guest") {
      base.how_heard = getOptionalStringValue("hearAboutUs");
      base.why_attend = getOptionalStringValue("whyAttend");
      base.attending_as = getOptionalStringValue("attendanceMode");
      base.emergency_contact = getOptionalStringValue("emergencyContact");
      base.food_allergies = getOptionalStringValue("foodAllergies");
      base.bringing_to_grill = getOptionalStringValue("communityGrill");
      base.willing_to_share_social = !!formData.spreadTheWord;
    } else {
      base.availability = getOptionalStringValue("availabilityTime");
      base.skills_offered = getOptionalStringValue("skillsContribution");
      base.can_capture_media = !!formData.takePhotos;
    }

    return base;
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedContinue(true);
    setApiError(null);
    const currentKey = allSteps[currentIndex].key;

    if (!(await validateStepWithPreflight(currentKey))) {
      window.requestAnimationFrame(() => {
        document
          .getElementById("form-errors")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }

    const isLastStep = currentIndex === allSteps.length - 1;

    if (!isLastStep) {
      setHasAttemptedContinue(false);
      setCurrentIndex(currentIndex + 1);
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      const result = await registerMember(payload);

      if (onRegistrationComplete) {
        onRegistrationComplete(result, formData);
        return;
      }

      // Build confirmation URL with registration details
      const query = new URLSearchParams({
        invitationNumber: result.invitation_number,
        cbId: result.cb_id,
        name: `${getStringValue("firstName")} ${getStringValue(
          "lastName"
        )}`.trim(),
        participantType: result.participant_type,
        recordType: result.record_type,
        recordId: result.record_id,
      });
      router.push(`/register/donation?${query.toString()}`);
    } catch (err: unknown) {
      setApiError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      document
        .getElementById("api-error")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setErrors({});
    setApiError(null);
    setHasAttemptedContinue(false);
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const isStepValid = (key: string): boolean => {
    if (key === "compliance") {
      return Object.keys(COMPLIANCE_ERROR_MESSAGES).every(
        (name) => !!formData[name]
      );
    }

    const stepObj = steps.find((s) => s.key === key);
    if (!stepObj) return true;

    return stepObj.fields.every((field) => {
      return !getFieldError(field, formData);
    });
  };

  const renderField = (field: FormField) => {
    const fieldIcon = field.icon && (
      <span className="w-4 h-4 text-ui-text-muted absolute right-1 bottom-1.5 group-focus-within:text-brand-primary transition-colors flex items-center justify-center">
        {field.icon}
      </span>
    );

    switch (field.type) {
      case "select":
        return (
          <div className={fieldGroupClass}>
            <label className={selectLabelClass}>
              {field.label} {field.required ? "*" : ""}
            </label>
            <select
              id={field.name}
              className={selectClass}
              value={getStringValue(field.name)}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
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
          <div className={fieldGroupClass}>
            <textarea
              id={field.name}
              placeholder=" "
              value={getStringValue(field.name)}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={`${inputClass} min-h-11 resize-none`}
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
      case "password": {
        const isVisible = !!visiblePasswords[field.name];
        return (
          <div className={fieldGroupClass}>
            <input
              type={isVisible ? "text" : "password"}
              id={field.name}
              placeholder=" "
              value={getStringValue(field.name)}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={inputClass}
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
          <div className={fieldGroupClass}>
            <input
              type="number"
              id={field.name}
              placeholder={field.placeholder || " "}
              value={getStringValue(field.name)}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={inputClass}
              min={21}
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
          <div className={fieldGroupClass}>
            <input
              type={field.type}
              id={field.name}
              placeholder={field.placeholder || " "}
              value={getStringValue(field.name)}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={inputClass}
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
  const currentKey = allSteps[currentIndex].key;
  const isLastStep = currentIndex === allSteps.length - 1;
  const isCurrentStepValid = isStepValid(currentKey);
  const isContinueDisabled = isSubmitting || isCheckingEmail;
  const showValidationPrompt =
    hasAttemptedContinue && !isCurrentStepValid && errorList.length === 0;
  const validationPrompt =
    currentKey === "compliance"
      ? "Confirm each required item before submitting."
      : "Complete the required fields before continuing.";

  return (
    <main className="min-h-dvh overflow-x-hidden p-3 font-sans sm:p-4 lg:h-dvh lg:overflow-hidden lg:p-6">
      <div className="mx-auto flex w-full max-w-6xl lg:h-full lg:max-h-[calc(100dvh-3rem)]">
        <div className="relative flex w-full min-h-0 flex-col overflow-hidden rounded-[2rem] border-2 border-white/50 bg-ui-card/30 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-2xl lg:h-full lg:flex-row">
          <div className="relative h-44 w-full shrink-0 overflow-hidden bg-ui-text-main sm:h-52 lg:hidden">
            {allSteps.map((s, index) => (
              <div
                key={`mobile-${s.key}`}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  currentIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
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

          <div className="relative z-10 flex min-h-0 w-full flex-col overflow-y-auto p-5 sm:p-7 lg:w-[58%] lg:p-6 xl:p-8 custom-scrollbar">
            <form
              onSubmit={handleNext}
              className="my-auto flex min-h-0 w-full flex-col gap-4"
            >
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

              <div className="text-left">
                <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-brand-dark to-brand-primary bg-clip-text text-transparent">
                  {allSteps[currentIndex].label}
                </h2>
                <p className="text-xs text-ui-text-muted mt-1 font-medium">
                  Please enter your details to continue.
                </p>
              </div>

              <div className="min-h-0 space-y-3">
                {currentKey === "compliance" ? (
                  <ComplianceStep
                    formData={formData}
                    errors={errors}
                    onFieldChange={handleFieldChange}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
                    {(allSteps[currentIndex] as CustomStep).fields.map(
                      (field) => {
                        const isFullWidth =
                          field.colSpan === 2 ||
                          field.type === "textarea" ||
                          field.type === "toggle";
                        return (
                          <div
                            key={field.name}
                            className={isFullWidth ? "sm:col-span-2" : ""}
                          >
                            {renderField(field)}
                            {errors[field.name] && (
                              <p
                                id={`${field.name}-error`}
                                className="text-xs text-danger-500 -mt-2 pl-1 font-medium mb-2"
                              >
                                {errors[field.name]}
                              </p>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>


              {showValidationPrompt && (
                <div
                  id="form-validation-hint"
                  aria-live="polite"
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

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2">
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
                    errorList.length > 0
                      ? "form-errors"
                      : showValidationPrompt
                      ? "form-validation-hint"
                      : undefined
                  }
                >
                  {isSubmitting || isCheckingEmail ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      {isCheckingEmail ? "Checking email..." : "Submitting…"}
                    </span>
                  ) : isLastStep ? (
                    "I'm Ready for Casa de Bloom."
                  ) : (
                    "Continue"
                  )}
                </Button>
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
                  src={s.img}
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
