"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import ComplianceStep from "./ComplianceStep";
import { registerMember, RegisterPayload, RegisterResponse } from "@/lib/services/register";

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "url" | "password" | "number" | "select" | "textarea" | "toggle";
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

interface MultiStepRegistrationFormProps {
  title: string;
  participantType: "guest" | "volunteer";
  steps: CustomStep[];
  initialFormData: Record<string, any>;
  onSubmit?: (formData: Record<string, any>) => void; // optional override
  onRegistrationComplete?: (result: RegisterResponse, formData: Record<string, any>) => void;
}

const COMPLIANCE_STEP = {
  key: "compliance" as const,
  label: "Legal Compliance",
  img: "/assets/images/sea-spa-elements-close-up.jpeg",
};

const fieldGroupClass =
  "relative border-b border-ui-border py-1 flex items-center group mb-4 transition-colors focus-within:border-brand-primary";
const inputClass =
  "peer w-full bg-transparent text-ui-text-main text-sm focus:outline-none pr-8 pt-5 pb-1 placeholder-transparent";
const labelClass =
  "absolute left-0 top-5 text-ui-text-muted text-sm transition-all duration-200 pointer-events-none origin-left peer-focus:top-0 peer-focus:text-xs peer-focus:text-brand-primary peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-brand-primary";
const selectLabelClass =
  "absolute left-0 top-0 text-ui-text-muted text-xs pointer-events-none";
const selectClass =
  "w-full bg-transparent text-ui-text-main text-sm focus:outline-none pr-8 pt-5 pb-1 appearance-none cursor-pointer";

export default function MultiStepRegistrationForm({
  title,
  participantType,
  steps,
  initialFormData,
  onSubmit,
  onRegistrationComplete,
}: MultiStepRegistrationFormProps) {
  const router = useRouter();
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  
  // Full step sequence: custom steps → compliance → submit
  const allSteps = [...steps, COMPLIANCE_STEP];

  const [formData, setFormData] = useState<Record<string, any>>({
    isRealityShow: false,
    photoReleaseAccepted: false,
    positiveExperience: false,
    ageConfirmed: false,
    guidelinesAccepted: false,
    ...initialFormData,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Perform real-time validation updates
      setErrors((prevErrors) => {
        const nextErrors = { ...prevErrors };
        
        // 1. Password validation
        if (name === "password") {
          if (value && value.length < 6) {
            nextErrors.password = "Password must be at least 6 characters.";
          } else {
            delete nextErrors.password;
          }
          
          // Re-validate confirmPassword when password changes
          if (updated.confirmPassword) {
            if (value !== updated.confirmPassword) {
              nextErrors.confirmPassword = "Passwords do not match.";
            } else {
              delete nextErrors.confirmPassword;
            }
          }
        }
        
        // 2. Confirm Password validation
        if (name === "confirmPassword") {
          if (value && value !== updated.password) {
            nextErrors.confirmPassword = "Passwords do not match.";
          } else {
            delete nextErrors.confirmPassword;
          }
        }
        
        // 3. Clear regular required errors when typed into
        if (name !== "password" && name !== "confirmPassword") {
          if (value !== undefined && value !== null && value !== "" && (typeof value !== "string" || value.trim())) {
            delete nextErrors[name];
          }
        }
        
        return nextErrors;
      });

      return updated;
    });
  };

  const validateStep = (key: string): boolean => {
    let errs: Record<string, string> = {};

    if (key === "compliance") {
      if (!formData.isRealityShow)
        errs.isRealityShow = "You must confirm you understand Casa de Bloom is a community-centered Reality Show.";
      if (!formData.photoReleaseAccepted)
        errs.photoReleaseAccepted = "You must confirm you understand photos and videos will be taken.";
      if (!formData.positiveExperience)
        errs.positiveExperience = "You must agree to help create a positive experience for everyone.";
      if (!formData.ageConfirmed)
        errs.ageConfirmed = "You must confirm you are at least 21 years old.";
      if (!formData.guidelinesAccepted)
        errs.guidelinesAccepted = "You must confirm you have read the Community Guidelines & Terms.";
    } else {
      const stepObj = steps.find((s) => s.key === key);
      if (stepObj) {
        stepObj.fields.forEach((field) => {
          const val = formData[field.name];
          if (
            field.required &&
            (val === undefined ||
              val === null ||
              val === "" ||
              (typeof val === "string" && !val.trim()))
          ) {
            errs[field.name] = field.requiredMessage || `${field.label} is required.`;
          } else if (field.type === "email" && val && !/\S+@\S+\.\S+/.test(val)) {
            errs[field.name] = field.invalidMessage || "Valid email is required.";
          } else if (field.type === "number" && val && Number(val) < 21) {
            errs[field.name] = field.invalidMessage || "You must be at least 21 years old.";
          } else if (field.name === "password" && val && val.length < 6) {
            errs[field.name] = "Password must be at least 6 characters.";
          } else if (field.name === "confirmPassword" && val && val !== formData.password) {
            errs[field.name] = "Passwords do not match.";
          }
        });
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const buildPayload = (): RegisterPayload => {
    const base: RegisterPayload = {
      participant_type: participantType,
      first_name: formData.firstName ?? "",
      last_name: formData.lastName ?? "",
      email: formData.email ?? "",
      phone: formData.phone || undefined,
      password: formData.password || undefined,
      facebook: formData.facebook || undefined,
      instagram: formData.instagram || undefined,
      linkedin: formData.linkedin || undefined,
      website: formData.website || undefined,
      profession: formData.profession || undefined,
      business_name: formData.businessName || undefined,
      city: formData.city || undefined,
      age_range: formData.ageRange || undefined,
      exact_age: formData.exactAge ? Number(formData.exactAge) : undefined,
      gender: formData.gender || undefined,
      event_date: formData.eventDate ?? "",
      community_guidelines_accepted: !!formData.guidelinesAccepted,
      community_guidelines_version: "1.0",
      photo_video_release_accepted: !!formData.photoReleaseAccepted,
      age_confirmed_21_plus: !!formData.ageConfirmed,
    };

    if (participantType === "guest") {
      base.how_heard = formData.hearAboutUs || undefined;
      base.why_attend = formData.whyAttend || undefined;
      base.attending_as = formData.attendanceMode || undefined;
      base.emergency_contact = formData.emergencyContact || undefined;
      base.food_allergies = formData.foodAllergies || undefined;
      base.bringing_to_grill = formData.communityGrill || undefined;
      base.willing_to_share_social = !!formData.spreadTheWord;
    } else {
      base.availability = formData.availabilityTime || undefined;
      base.skills_offered = formData.skillsContribution || undefined;
      base.can_capture_media = !!formData.takePhotos;
    }

    return base;
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const currentKey = allSteps[currentIndex].key;

    if (!validateStep(currentKey)) {
      document.getElementById("form-errors")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const isLastStep = currentIndex === allSteps.length - 1;

    if (!isLastStep) {
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
        name: `${formData.firstName ?? ""} ${formData.lastName ?? ""}`.trim(),
        participantType: result.participant_type,
        recordType: result.record_type,
        recordId: result.record_id,
      });
      router.push(`/register/donation?${query.toString()}`);
    } catch (err: any) {
      setApiError(err?.message ?? "Something went wrong. Please try again.");
      document.getElementById("api-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setErrors({});
    setApiError(null);
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const isStepValid = (key: string): boolean => {
    if (key === "compliance") {
      return (
        !!formData.isRealityShow &&
        !!formData.photoReleaseAccepted &&
        !!formData.positiveExperience &&
        !!formData.ageConfirmed &&
        !!formData.guidelinesAccepted
      );
    }

    const stepObj = steps.find((s) => s.key === key);
    if (!stepObj) return true;

    return stepObj.fields.every((field) => {
      const val = formData[field.name];

      if (field.required) {
        const isEmpty =
          val === undefined ||
          val === null ||
          val === "" ||
          (typeof val === "string" && !val.trim());

        if (isEmpty) return false;
      }

      if (field.type === "email" && val && !/\S+@\S+\.\S+/.test(val)) {
        return false;
      }

      if (field.type === "number" && val && Number(val) < 21) {
        return false;
      }

      if (field.name === "password" && val && val.length < 6) {
        return false;
      }

      if (field.name === "confirmPassword" && val && val !== formData.password) {
        return false;
      }

      return true;
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
              className={selectClass}
              value={formData[field.name] || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
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
              value={formData[field.name] || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={`${inputClass} min-h-[50px] resize-none`}
            />
            <label htmlFor={field.name} className={labelClass}>
              {field.label} {field.required ? "*" : ""}
            </label>
            {fieldIcon}
          </div>
        );
      case "toggle":
        return (
          <div className="flex items-center justify-between py-3 border-b border-ui-border mt-6">
            <span className="text-sm text-ui-text-main font-medium pr-4">{field.label}</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs ${!formData[field.name] ? "text-ui-text-main font-semibold" : "text-ui-text-muted"}`}>
                No
              </span>
              <button
                type="button"
                onClick={() => handleFieldChange(field.name, !formData[field.name])}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${formData[field.name] ? "bg-brand-primary" : "bg-ui-border"
                  }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData[field.name] ? "translate-x-4" : "translate-x-0"
                    }`}
                />
              </button>
              <span className={`text-xs ${formData[field.name] ? "text-ui-text-main font-semibold" : "text-ui-text-muted"}`}>
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
              value={formData[field.name] || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={inputClass}
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
              value={formData[field.name] || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={inputClass}
              min={21}
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
              value={formData[field.name] || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={inputClass}
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
  const isContinueDisabled = isSubmitting || !isCurrentStepValid;

  return (
    <main className="min-h-screen font-sans pb-24 pt-12 lg:py-16 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-7xl">
        <div className="relative w-full bg-ui-card/30 backdrop-blur-2xl border-2 border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[2.5rem] flex flex-col lg:flex-row min-h-[580px] overflow-hidden lg:overflow-visible">
          <div className="lg:hidden relative w-full h-64 shrink-0 overflow-hidden bg-ui-text-main">
            {allSteps.map((s, index) => (
              <div
                key={`mobile-${s.key}`}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${currentIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
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

          <div className="w-full lg:w-[55%] p-8 sm:p-12 md:p-14 lg:pt-16 relative z-10 flex flex-col justify-center">
            <form onSubmit={handleNext} className="space-y-8 w-full">
              <div className="space-y-5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ui-text-main">
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
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300",
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
                              i < currentIndex ? "bg-brand-primary" : "bg-ui-border",
                            ].join(" ")}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

                  <div className="text-left">
                    <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-brand-dark to-brand-primary bg-clip-text text-transparent">
                      {allSteps[currentIndex].label}
                    </h2>
                    <p className="text-sm text-ui-text-muted mt-1 font-medium">
                      Please enter your details to continue.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {currentKey === "compliance" ? (
                      <ComplianceStep
                        formData={formData}
                        errors={errors}
                        onFieldChange={handleFieldChange}
                      />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        {(allSteps[currentIndex] as CustomStep).fields.map((field) => {
                          const isFullWidth =
                            field.colSpan === 2 ||
                            field.type === "textarea" ||
                            field.type === "toggle";
                          return (
                            <div key={field.name} className={isFullWidth ? "sm:col-span-2" : ""}>
                              {renderField(field)}
                              {errors[field.name] && (
                                <p className="text-xs text-danger-500 -mt-3 pl-1 font-medium mb-3">
                                  {errors[field.name]}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Validation errors */}
                  {errorList.length > 0 && (
                    <div
                      id="form-errors"
                      className="flex items-start gap-3 bg-danger-500/10 backdrop-blur-sm border border-danger-500/30 text-danger-600 rounded-2xl p-4 text-sm shadow-sm"
                    >
                      <AlertCircle size={18} className="shrink-0 mt-0.5 text-danger-500" />
                      <div className="space-y-1">
                        <p className="font-bold">Please complete your validations:</p>
                        <ul className="list-disc list-inside text-xs opacity-90 space-y-0.5">
                          {errorList.map((msg, i) => (
                            <li key={i}>{msg}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* API error */}
                  {apiError && (
                    <div
                      id="api-error"
                      className="flex items-start gap-3 bg-danger-500/10 backdrop-blur-sm border border-danger-500/30 text-danger-600 rounded-2xl p-4 text-sm shadow-sm"
                    >
                      <AlertCircle size={18} className="shrink-0 mt-0.5 text-danger-500" />
                      <div>
                        <p className="font-bold">Registration error</p>
                        <p className="text-xs opacity-90 mt-0.5">{apiError}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-4">
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
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          Submitting…
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

          <div className="hidden lg:block absolute z-20 w-[45%] -top-8 -bottom-8 left-[55%] rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden bg-ui-text-main">
            {allSteps.map((s, index) => (
              <div
                key={`desktop-${s.key}`}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${currentIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
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
