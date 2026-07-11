"use client";

import React, { useState } from "react";
import Image from "next/image";

interface DonationStepProps {
  /** Called when user picks a method for tracking which method_shown to send to API. */
  onMethodSelect?: (method: "venmo" | "zelle" | "paypal" | null) => void;
  selectedMethod?: "venmo" | "zelle" | "paypal" | null;
  showHeader?: boolean;
  showSkipNote?: boolean;
  layout?: "grid" | "dashboard";
}

const QR_METHODS = [
  {
    key: "venmo" as const,
    label: "Venmo",
    src: "/assets/images/Venmo.webp",
    handle: "@CasaDeBloomSD",
    color: "#FF3F82",
    bg: "#FFE3EE",
  },
  {
    key: "zelle" as const,
    label: "Zelle",
    src: "/assets/images/Zelle.webp",
    handle: "casadebloomsd@gmail.com",
    color: "#33C9DC",
    bg: "#E9FBFA",
  },
  {
    key: "paypal" as const,
    label: "PayPal",
    src: "/assets/images/PayPal.webp",
    handle: "@CasaDeBloom",
    color: "#99CC00",
    bg: "#F5FBE8",
  },
];

export default function DonationStep({
  onMethodSelect,
  selectedMethod,
  showHeader = true,
  showSkipNote = true,
  layout = "grid",
}: DonationStepProps) {
  const [enlarged, setEnlarged] = useState<string | null>(null);
  const currentMethod = QR_METHODS.find((method) => method.key === selectedMethod);

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-brand-primary uppercase tracking-widest">
            Support Casa de Bloom
          </h4>
          <p className="text-sm text-ui-text-muted leading-relaxed">
            Donations are welcome. Your support helps us cover event setup,
            cleanup, complimentary Kiwi Spa services, and create an amazing
            experience for all. Scan any code below to give at your own
            discretion.
          </p>
          <p className="text-[11px] font-semibold text-brand-dark uppercase tracking-wide">
            Optional donations are non-refundable.
          </p>
        </div>
      )}

      {layout === "dashboard" ? (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="dashboard-interactive-card rounded-2xl border border-brand-primary/15 bg-brand-light/20 p-4">
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-ui-border bg-white/70 p-2">
              {QR_METHODS.map((method) => {
                const isSelected = selectedMethod === method.key;
                return (
                  <button
                    key={method.key}
                    type="button"
                    onClick={() => onMethodSelect?.(method.key)}
                    className={[
                      "dashboard-shine rounded-xl border px-3 py-2 text-sm font-extrabold transition-all hover:-translate-y-0.5",
                      isSelected
                        ? "border-brand-primary shadow-sm"
                        : "border-ui-border bg-white text-ui-text-muted hover:border-brand-primary/30 hover:text-brand-primary",
                    ].join(" ")}
                    style={isSelected ? { background: method.bg, color: method.color } : undefined}
                  >
                    {method.label}
                  </button>
                );
              })}
            </div>

            <div className="dashboard-shine mt-4 flex min-h-64 items-center justify-center rounded-2xl border border-ui-border bg-white/80 p-4">
              {currentMethod && (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-center text-xs font-bold uppercase tracking-wider text-ui-text-muted">
                    Scan to support via {currentMethod.label}
                  </p>
                  <div className="dashboard-float-icon relative h-48 w-48 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-sm">
                    <Image
                      src={currentMethod.src}
                      alt={`${currentMethod.label} QR Code`}
                      fill
                      sizes="192px"
                      className="object-contain p-2"
                    />
                  </div>
                  <p className="max-w-full truncate text-center text-xs font-semibold text-ui-text-muted">
                    {currentMethod.handle}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-interactive-card flex flex-col justify-between gap-4 rounded-2xl border-2 border-dashed border-brand-secondary/35 bg-brand-secondary/5 p-4">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-brand-secondary">
                KIWI Love Optional Donation
              </h3>
              <p className="mt-2 text-sm font-medium leading-6 text-ui-text-main">
                KIWI Love supports local rescue organizations and shelters. This
                is separate from Casa de Bloom event support.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="dashboard-float-icon relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-sm">
                <Image
                  src="/assets/images/kiwi_love_qr.webp"
                  alt="KIWI Love donation QR Code"
                  fill
                  sizes="112px"
                  className="object-contain p-2"
                />
              </div>
              <p className="text-xs font-semibold leading-5 text-ui-text-muted">
                Participation is entirely optional and deeply appreciated.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
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
                    "dashboard-shine flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 focus:outline-none hover:-translate-y-0.5",
                    isSelected
                      ? "border-brand-primary shadow-lg scale-[1.03]"
                      : "border-ui-border hover:border-brand-primary/40 hover:shadow-md",
                  ].join(" ")}
                  style={{ background: method.bg }}
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-sm">
                    <Image
                      src={method.src}
                      alt={`${method.label} QR Code`}
                      fill
                      sizes="(max-width: 640px) 30vw, 150px"
                      className="object-cover"
                    />
                  </div>
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
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

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
                src={QR_METHODS.find((method) => method.key === enlarged)!.src}
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

      {layout === "grid" && (
        <>
          <hr className="border-ui-border" />

          <div className="rounded-2xl border-2 border-dashed border-brand-secondary/40 bg-brand-secondary/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold text-brand-secondary">KIWI</span>
              <div>
                <p className="text-xs font-bold text-brand-secondary uppercase tracking-widest">
                  Optional - Kiwi Love Nonprofit
                </p>
                <p className="text-[11px] text-ui-text-muted">
                  Dog rescue & local shelter support
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p className="text-[12px] text-ui-text-main leading-relaxed sm:flex-1">
                KIWI Love supports local dog rescue organizations and shelters. This
                is a completely separate and optional donation, and 100% goes directly
                to the animals.
              </p>
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-sm">
                <Image
                  src="/assets/images/kiwi_love_qr.webp"
                  alt="KIWI Love donation QR Code"
                  fill
                  sizes="112px"
                  className="object-contain p-2"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {showSkipNote && (
        <p className="text-[11px] text-ui-text-muted text-center">
          Donation is voluntary. You may skip and complete registration without
          donating.
        </p>
      )}
    </div>
  );
}
