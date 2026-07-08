"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ComplianceStepProps {
  formData: Record<string, any>;
  errors: Record<string, string>;
  onFieldChange: (name: string, value: any) => void;
}

const CHECKBOX_ITEMS = [
  {
    id: "isRealityShow",
    label: "I understand Casa de Bloom is a community-centered Reality Show. *",
  },
  {
    id: "photoReleaseAccepted",
    label: "I understand photos and videos will be taken. *",
  },
  {
    id: "positiveExperience",
    label: "I agree to help create a positive experience for everyone. *",
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

const ACCORDION_SECTIONS = [
  {
    id: "reality_show",
    title: "Community-Centered Reality Show",
    intro: "Learn about our community-centered filming environment.",
    details: "Casa de Bloom is a filmed community experience. By registering and attending, you understand that photos, videos, and audio recordings may be taken throughout the property and used for community, social media, marketing, and promotional purposes.",
  },
  {
    id: "potluck",
    title: "Potluck Community Table & Grill",
    intro: "Bring a favorite dish and a beverage to share.",
    details: "Casa de Bloom events are community-style potluck gatherings. Please bring both: a favorite dish or snack to share, and a beverage to share. Together we create one beautiful table. A community grill is available if you would like to bring something to grill.",
  },
  {
    id: "give_take",
    title: "Give & Take Community Table",
    intro: "Share small items in the spirit of generosity.",
    details: "Guests are encouraged to bring small items they no longer use and would love to share (books, accessories, beauty products, small gifts). General guideline: bring one, take one. The goal is to keep the table balanced while giving beautiful things a new home.",
  },
  {
    id: "name_tag",
    title: "Name Tags & Drink Tags",
    intro: "Wear a visible name tag and identify your drink.",
    details: "All guests are required to wear a visible name tag with their First and Last Name. Please also bring a small marker, ribbon, charm, sticker, or tag for your cup or glass to identify your own drink and reduce waste.",
  },
  {
    id: "business",
    title: "Business Owners & Connections",
    intro: "Showcase your business and share your story.",
    details: "We welcome businesses, brands, sponsors, and community partners. To keep the focus on enjoying the event, we encourage guests to showcase their business or services on the Casa de Bloom Marketplace, or share a short 1–2 minute introduction video.",
  },
  {
    id: "donations",
    title: "Optional Donations & Support",
    intro: "Learn about support options and Kiwi Love.",
    details: "Registration donations help cover event preparation, refreshments, guest gifts, and Kiwi Spa experiences. We also support KIWI Love, our official nonprofit initiative for dog rescue and shelters. Giving is entirely optional, and 100% of Kiwi Love donations go directly to the animals.",
  },
  {
    id: "values",
    title: "Community Values",
    intro: "Respect the space, host, and other guests.",
    details: "Be kind. Be respectful. Be generous. Be honest. Support one another. Respect the home. Respect the community. Respect each other’s belongings. Most importantly, enjoy the experience.",
  },
];

export default function ComplianceStep({
  formData,
  errors,
  onFieldChange,
}: ComplianceStepProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-5">
      
      {/* Warm Rebrand Tagline / Intro */}
      <div className="rounded-2xl bg-brand-light/20 border border-brand-primary/10 p-5 text-left space-y-2">
        <p className="text-sm font-semibold text-brand-dark uppercase tracking-wider">
          Before You Arrive
        </p>
        <p className="text-xs sm:text-sm text-ui-text-main leading-relaxed italic">
          "Casa de Bloom is a community-centered Reality Show where transformation, creativity, generosity, and meaningful human connection come together through shared experiences."
        </p>
      </div>

      {/* Accordions */}
      <div className="space-y-3">
        {ACCORDION_SECTIONS.map((sec) => {
          const isOpen = !!expanded[sec.id];
          return (
            <div
              key={sec.id}
              className="border border-ui-border rounded-xl bg-white/60 overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggleSection(sec.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left focus:outline-none hover:bg-brand-light/5 transition-colors cursor-pointer"
              >
                <div>
                  <h4 className="text-sm font-bold text-ui-text-main">
                    {sec.title}
                  </h4>
                  <p className="text-xs text-ui-text-muted mt-0.5 font-medium">
                    {sec.intro}
                  </p>
                </div>
                {isOpen ? (
                  <ChevronUp size={16} className="text-brand-primary" />
                ) : (
                  <ChevronDown size={16} className="text-ui-text-muted" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-ui-text-main leading-relaxed border-t border-ui-border bg-white/45 text-left">
                  {sec.details}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Link to Page B Guidelines */}
      <div className="pt-2 text-center">
        <a
          href="/register/guidelines"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-brand-primary hover:text-brand-dark underline transition-colors inline-flex items-center gap-1"
        >
          Read the full Community Guidelines & Terms
        </a>
      </div>

      {/* Checkboxes */}
      <div className="space-y-4 pt-4 border-t border-ui-border">
        {CHECKBOX_ITEMS.map((item) => (
          <div key={item.id}>
            <label className="flex items-start gap-3 text-sm font-medium text-ui-text-main cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!!formData[item.id]}
                onChange={(e) => onFieldChange(item.id, e.target.checked)}
                className="mt-1 self-start shrink-0 accent-brand-primary h-4 w-4 rounded cursor-pointer"
              />
              <span>{item.label}</span>
            </label>
            {errors[item.id] && (
              <p className="text-xs text-danger-500 mt-1 pl-7 font-medium text-left">
                {errors[item.id]}
              </p>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
