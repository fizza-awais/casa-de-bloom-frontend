"use client";

import React, { useState } from "react";
import Image from "next/image";

interface DonationStepProps {
  /** Called when user picks a method (for tracking which method_shown to send to API) */
  onMethodSelect?: (method: "venmo" | "zelle" | "paypal" | null) => void;
  selectedMethod?: "venmo" | "zelle" | "paypal" | null;
}

const QR_METHODS = [
  {
    key: "venmo" as const,
    label: "Venmo",
    src: "/assets/images/Venmo.jpeg",
    handle: "@CasaDeBloomSD",
    color: "#3D95CE",
    bg: "#E8F4FD",
  },
  {
    key: "zelle" as const,
    label: "Zelle",
    src: "/assets/images/Zelle.jpg",
    handle: "casadebloomsd@gmail.com",
    color: "#6D1ED4",
    bg: "#F3EEFF",
  },
  {
    key: "paypal" as const,
    label: "PayPal",
    src: "/assets/images/PayPal.jpg",
    handle: "@CasaDeBloom",
    color: "#003087",
    bg: "#E8EEF8",
  },
];

export default function DonationStep({
  onMethodSelect,
  selectedMethod,
}: DonationStepProps) {
  const [enlarged, setEnlarged] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-brand-primary uppercase tracking-widest">
          Support Casa de Bloom
        </h4>
        <p className="text-sm text-ui-text-muted leading-relaxed">
          Registration donations help us cover event setup, refreshments,
          staffing, guest gifts, and Kiwi Spa experiences. Scan any code below
          to give — entirely at your own discretion.
        </p>
        <p className="text-[11px] font-semibold text-brand-dark uppercase tracking-wide">
          ⚠ Registration donations are non-refundable.
        </p>
      </div>

      {/* QR Grid */}
      <div className="grid grid-cols-3 gap-3">
        {QR_METHODS.map((method) => {
          const isSelected = selectedMethod === method.key;
          return (
            <button
              key={method.key}
              type="button"
              onClick={() => {
                onMethodSelect?.(isSelected ? null : method.key);
                setEnlarged(isSelected ? null : method.key);
              }}
              className={[
                "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 focus:outline-none",
                isSelected
                  ? "border-brand-primary shadow-lg scale-[1.03]"
                  : "border-ui-border hover:border-brand-primary/40 hover:shadow-md",
              ].join(" ")}
              style={{ background: method.bg }}
            >
              {/* QR Image */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-sm">
                <Image
                  src={method.src}
                  alt={`${method.label} QR Code`}
                  fill
                  sizes="(max-width: 640px) 30vw, 150px"
                  className="object-cover"
                />
              </div>
              {/* Label */}
              <span
                className="text-xs font-bold tracking-tight"
                style={{ color: method.color }}
              >
                {method.label}
              </span>
              <span className="text-[10px] text-ui-text-muted font-medium truncate w-full text-center">
                {method.handle}
              </span>
              {isSelected && (
                <span className="text-[10px] font-bold text-brand-primary bg-brand-light px-2 py-0.5 rounded-full">
                  Selected ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Enlarged QR lightbox */}
      {enlarged && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
          onClick={() => setEnlarged(null)}
        >
          <div
            className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-xs w-full flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-56 h-56 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={QR_METHODS.find((m) => m.key === enlarged)!.src}
                alt={`${enlarged} QR`}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm font-semibold text-ui-text-main">
              Scan with your phone camera
            </p>
            <button
              type="button"
              onClick={() => setEnlarged(null)}
              className="text-xs text-ui-text-muted hover:text-ui-text-main transition-colors"
            >
              Tap anywhere to close
            </button>
          </div>
        </div>
      )}

      {/* Divider */}
      <hr className="border-ui-border" />

      {/* Kiwi Love Section */}
      <div className="rounded-2xl border-2 border-dashed border-brand-secondary/40 bg-brand-secondary/5 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🐾</span>
          <div>
            <p className="text-xs font-bold text-brand-secondary uppercase tracking-widest">
              Optional — Kiwi Love Nonprofit
            </p>
            <p className="text-[11px] text-ui-text-muted">
              Dog rescue & local shelter support
            </p>
          </div>
        </div>
        <p className="text-[12px] text-ui-text-main leading-relaxed">
          KIWI Love supports local dog rescue organizations and shelters. This
          is a completely separate and optional donation — 100% goes directly to
          the animals. QR code available at the event check-in table.
        </p>
        <div className="flex items-center gap-2 bg-white/60 rounded-xl px-3 py-2 border border-brand-secondary/20">
          <span className="text-brand-secondary text-sm">🌿</span>
          <p className="text-[11px] text-ui-text-muted font-medium">
            Kiwi Love QR will be available at the event. Your support is deeply
            appreciated by the animals we help.
          </p>
        </div>
      </div>

      {/* Skip note */}
      <p className="text-[11px] text-ui-text-muted text-center">
        Donation is voluntary. You may skip and complete registration without
        donating.
      </p>
    </div>
  );
}
