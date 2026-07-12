"use client";

import React, { useState, useImperativeHandle, forwardRef } from "react";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "url" | "password" | "select" | "textarea" | "toggle" | "binary-choice";
  required?: boolean;
  isEditable?: boolean; 
  colSpan?: 1 | 2;
  placeholder?: string;
  options?: { label: string; value: string }[];
  icon?: React.ReactNode;
  requiredMessage?: string;
  invalidMessage?: string;
  helperText?: string;
  visibleWhen?: {
    field: string;
    equals: unknown;
  };
}

interface FormComponentProps {
  title?: React.ReactNode; // Accepts text or a layout structure with inline icons
  subtitle?: string;
  fields: FormField[];
  initialData?: Record<string, any>;
  submitLabel?: string | null;
  onSubmit: (formData: Record<string, any>) => Promise<void> | void;
  successMessage?: string;
}

export interface FormComponentRef {
  validate: () => boolean;
  getData: () => Record<string, any>;
  setSubmittingStatus: (status: boolean) => void;
  setExternalApiError: (error: string | null) => void;
  setExternalSuccess: (show: boolean) => void;
}

const fieldGroupClass =
  "relative border-b border-ui-border py-1 flex items-center group mb-4 transition-colors focus-within:border-brand-primary";
const inputClass =
  "peer w-full bg-transparent text-ui-text-main text-sm focus:outline-none pr-8 pt-5 pb-1 placeholder-transparent";
const labelClass =
  "absolute left-0 top-5 text-ui-text-muted text-sm transition-all duration-200 pointer-events-none origin-left peer-focus:top-0 peer-focus:text-xs peer-focus:text-brand-primary peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-brand-primary";
const selectLabelClass = "absolute left-0 top-0 text-ui-text-muted text-xs pointer-events-none";
const selectClass =
  "w-full bg-transparent text-ui-text-main text-sm focus:outline-none pr-8 pt-5 pb-1 appearance-none cursor-pointer";

const isFieldEditable = (field: FormField) => field.isEditable !== false;
const isFieldVisible = (field: FormField, data: Record<string, any>) =>
  !field.visibleWhen || data[field.visibleWhen.field] === field.visibleWhen.equals;

export const FormComponent = forwardRef<FormComponentRef, FormComponentProps>(function FormComponent(
  {
    title,
    subtitle,
    fields,
    initialData = {},
    submitLabel = null,
    onSubmit,
    successMessage = "Saved successfully.",
  },
  ref
) {
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      fields.forEach((field) => {
        if (field.visibleWhen && !isFieldVisible(field, updated)) {
          updated[field.name] = null;
        }
      });
      return updated;
    });
    setShowSuccess(false);
    setErrors((prev) => {
      const nextErrors = { ...prev };
      const updated = { ...formData, [name]: value };
      delete nextErrors[name];
      fields.forEach((field) => {
        if (!isFieldVisible(field, updated)) {
          delete nextErrors[field.name];
        }
      });
      return nextErrors;
    });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    fields.filter((field) => isFieldVisible(field, formData)).forEach((field) => {
      if (!isFieldEditable(field)) return;
      const val = formData[field.name];
      if (
        field.required &&
        (val === undefined || val === null || val === "" || (typeof val === "string" && !val.trim()))
      ) {
        errs[field.name] = field.requiredMessage || `${field.label} is required.`;
      } else if (field.type === "email" && val && !/\S+@\S+\.\S+/.test(val)) {
        errs[field.name] = field.invalidMessage || "Valid email is required.";
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  useImperativeHandle(ref, () => ({
    validate,
    getData: () => formData,
    setSubmittingStatus: (status: boolean) => setIsSubmitting(status),
    setExternalApiError: (error: string | null) => setApiError(error),
    setExternalSuccess: (show: boolean) => setShowSuccess(show)
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setShowSuccess(false);

    if (!validate()) {
      document.getElementById("form-errors")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setShowSuccess(true);
    } catch (err: any) {
      setApiError(err?.message ?? "Something went wrong. Please try again.");
      document.getElementById("api-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const isEditable = isFieldEditable(field);
    const disabledClass = !isEditable ? "opacity-50 cursor-not-allowed" : "";
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
              className={`${selectClass} ${disabledClass}`}
              value={formData[field.name] || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              disabled={!isEditable}
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
              className={`${inputClass} min-h-[50px] resize-none ${disabledClass}`}
              disabled={!isEditable}
            />
            <label htmlFor={field.name} className={labelClass}>
              {field.label} {field.required ? "*" : ""}
            </label>
            {fieldIcon}
          </div>
        );
      case "toggle":
        return (
          <div className={`flex items-center justify-between py-3 border-b border-ui-border mt-6 ${disabledClass}`}>
            <span className="text-sm text-ui-text-main font-medium pr-4">{field.label}</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs ${!formData[field.name] ? "text-ui-text-main font-semibold" : "text-ui-text-muted"}`}>No</span>
              <button
                type="button"
                disabled={!isEditable}
                onClick={() => handleFieldChange(field.name, !formData[field.name])}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                  formData[field.name] ? "bg-brand-primary" : "bg-ui-border"
                } ${!isEditable ? "cursor-not-allowed" : ""}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData[field.name] ? "translate-x-4" : "translate-x-0"}`} />
              </button>
              <span className={`text-xs ${formData[field.name] ? "text-ui-text-main font-semibold" : "text-ui-text-muted"}`}>Yes</span>
            </div>
          </div>
        );
      case "binary-choice": {
        const selectedValue = formData[field.name];
        return (
          <fieldset className={`border-b border-ui-border py-3 mt-2 ${disabledClass}`}>
            <legend className="text-sm font-medium text-ui-text-main">
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
                    disabled={!isEditable}
                    onClick={() => handleFieldChange(field.name, option.value)}
                    className={`h-10 rounded-lg border px-4 text-sm font-semibold transition-colors ${
                      isSelected
                        ? "border-brand-primary bg-brand-primary text-white shadow-sm"
                        : "border-ui-border bg-white/70 text-ui-text-main hover:border-brand-primary/60"
                    }`}
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
          <div className={fieldGroupClass}>
            <input
              type={isVisible ? "text" : "password"}
              id={field.name}
              placeholder=" "
              value={formData[field.name] || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={`${inputClass} ${disabledClass}`}
              disabled={!isEditable}
            />
            <label htmlFor={field.name} className={labelClass}>
              {field.label} {field.required ? "*" : ""}
            </label>
            <button
              type="button"
              tabIndex={-1}
              disabled={!isEditable}
              onClick={() => setVisiblePasswords((prev) => ({ ...prev, [field.name]: !prev[field.name] }))}
              className="w-4 h-4 text-ui-text-muted absolute right-1 bottom-1.5 hover:text-brand-primary transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isVisible ? "Hide password" : "Show password"}
            >
              {isVisible ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        );
      }
      default:
        return (
          <div className={fieldGroupClass}>
            <input
              type={field.type}
              id={field.name}
              placeholder={field.placeholder || " "}
              value={formData[field.name] || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={`${inputClass} ${disabledClass}`}
              disabled={!isEditable}
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

  return (
    <div className="w-full">
      {/* Dynamic Header Block inside the component */}
      {(title || subtitle) && (
        <div className="mb-6 text-left">
          {title && (
            <h3 className="text-lg font-bold text-ui-text-main flex items-center gap-2">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs text-ui-text-muted mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
          {fields.filter((field) => isFieldVisible(field, formData)).map((field) => {
            const isFullWidth = field.colSpan === 2 || field.type === "textarea" || field.type === "toggle" || field.type === "binary-choice";
            return (
              <div key={field.name} className={isFullWidth ? "sm:col-span-2" : ""}>
                {renderField(field)}
                {errors[field.name] && (
                  <p className="text-xs text-danger-600 -mt-3 pl-1 font-medium mb-3">{errors[field.name]}</p>
                )}
                {field.helperText && !errors[field.name] && (
                  <p className="-mt-1 mb-3 pl-1 text-xs leading-5 text-ui-text-muted">
                    {field.helperText}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {errorList.length > 0 && (
          <div id="form-errors" className="flex items-start gap-3 bg-danger-500/10 backdrop-blur-sm border border-danger-500/30 text-danger-600 rounded-2xl p-4 text-sm shadow-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-danger-500" />
            <div className="space-y-1">
              <p className="font-bold">Please complete validations:</p>
              <ul className="list-disc list-inside text-xs opacity-90 space-y-0.5">
                {errorList.map((msg, i) => <li key={i}>{msg}</li>)}
              </ul>
            </div>
          </div>
        )}

        {apiError && (
          <div id="api-error" className="flex items-start gap-3 bg-danger-500/10 backdrop-blur-sm border border-danger-500/30 text-danger-600 rounded-2xl p-4 text-sm shadow-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-danger-500" />
            <div>
              <p className="font-bold">Something went wrong</p>
              <p className="text-xs opacity-90 mt-0.5">{apiError}</p>
            </div>
          </div>
        )}

        {showSuccess && !apiError && (
          <div className="flex items-center gap-3 bg-status-active/10 border border-status-active/30 text-ui-text-main rounded-2xl p-4 text-sm shadow-sm">
            <CheckCircle2 size={18} className="shrink-0 text-status-active" />
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

        {submitLabel && (
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-brand-primary text-white font-semibold shadow-md hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitLabel}
            </button>
          </div>
        )}
      </form>
    </div>
  );
});

export default FormComponent;
