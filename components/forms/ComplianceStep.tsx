"use client";

import Link from "next/link";
import type { RegistrationFormData, RegistrationFormValue } from "./MultiStepRegistrationForm";

interface ComplianceStepProps {
  formData: RegistrationFormData;
  errors: Record<string, string>;
  onFieldChange: (name: string, value: RegistrationFormValue) => void;
}

const CHECKBOX_ITEMS = [
  {
    id: "reality_show_understood",
    label: "I understand Casa de Bloom is a community-centered reality show experience. *",
  },
  {
    id: "photoReleaseAccepted",
    label: "I understand photos and videos may be captured during the event. *",
  },
  {
    id: "positive_experience_agreed",
    label: "I agree to help create a welcoming, respectful, and positive experience. *",
  },
  {
    id: "ageConfirmed",
    label: "I am at least 21 years old. *",
  },
  {
    id: "guidelinesAccepted",
    label: "I have read the Community Guidelines & Terms. *",
  },
];

export default function ComplianceStep({
  formData,
  errors,
  onFieldChange,
}: ComplianceStepProps) {
  const allChecked = CHECKBOX_ITEMS.every((item) => !!formData[item.id]);

  const handleSelectAll = (checked: boolean) => {
    CHECKBOX_ITEMS.forEach((item) => onFieldChange(item.id, checked));
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-brand-primary/10 bg-brand-light/20 p-5 text-left space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-dark">
          Final Confirmations
        </p>
        <p className="text-xs sm:text-sm leading-relaxed text-ui-text-main">
          A few final promises before we create your invitation. The full Community Guidelines & Terms stay available{" "}
          <Link
            href="/comminut-guidelines"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-primary underline underline-offset-2"
          >
            here
          </Link>
          .
        </p>
      </div>

      <div className="space-y-3 border-t border-ui-border pt-4">
        <div className="space-y-3">
          {CHECKBOX_ITEMS.map((item) => (
            <div key={item.id}>
              <label className="flex items-start gap-3 text-sm font-medium text-ui-text-main cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!formData[item.id]}
                  onChange={(e) => onFieldChange(item.id, e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded accent-brand-primary"
                />
                <span>{item.label}</span>
              </label>
              {errors[item.id] && (
                <p className="mt-1 pl-7 text-left text-xs font-medium text-danger-500">
                  {errors[item.id]}
                </p>
              )}
            </div>
          ))}
        </div>

        <label className="flex cursor-pointer select-none items-start gap-3 border-t border-ui-border pt-3 text-sm font-semibold text-ui-text-main">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded accent-brand-primary"
          />
          <span>Accept all confirmations</span>
        </label>
      </div>
    </div>
  );
}
