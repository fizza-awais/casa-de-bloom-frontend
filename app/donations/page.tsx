"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Info } from "lucide-react";
import { CasaMonogram } from "@/components/branding/CasaBranding";
import ResponsiveEventBackdrop from "@/components/ui/ResponsiveEventBackdrop";

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

type DonationMethod = (typeof QR_METHODS)[number]["key"];

export default function DonationsPage() {
  const [selectedMethod, setSelectedMethod] = useState<DonationMethod>("venmo");
  const currentMethod = QR_METHODS.find((method) => method.key === selectedMethod)!;

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden px-4 py-8 font-sans sm:py-10 lg:py-12">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <ResponsiveEventBackdrop
          alt="Casa de Bloom event backdrop"
          className="brightness-[0.8]"
        />
        <div className="absolute inset-0 bg-transparent">
          <div className="absolute -top-1/4 -left-1/4 h-[80%] w-[80%] rounded-full bg-brand-light/40 blur-[130px]" />
          <div className="absolute -bottom-1/4 -right-1/4 h-[75%] w-[75%] rounded-full bg-brand-accent/10 blur-[120px]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35 mix-blend-multiply" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl items-center">
        <div className="w-full rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-[0_32px_64px_rgba(31,27,36,0.18)] backdrop-blur-xl sm:p-7 md:rounded-[2.5rem] md:p-10">
          <header className="mx-auto max-w-2xl text-center">
            <CasaMonogram className="mx-auto h-20 w-20 drop-shadow-sm" />
            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-secondary">
              <Heart size={16} fill="currentColor" />
              Optional Support
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-primary sm:text-4xl">
              Casa de Bloom Donations
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-6 text-ui-text-main sm:text-base">
              Your support helps cover event setup, cleanup, complimentary Kiwi Spa
              services, and the little details that make each Casa de Bloom gathering
              feel special. Giving is always optional.
            </p>
          </header>

          <section className="mt-8 space-y-4 rounded-3xl border border-brand-primary/10 bg-brand-light/10 p-4 transition-all duration-300 sm:p-6">
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-ui-border bg-white/60 p-2">
              {QR_METHODS.map((method) => {
                const isSelected = selectedMethod === method.key;

                return (
                  <button
                    key={method.key}
                    type="button"
                    onClick={() => setSelectedMethod(method.key)}
                    className={[
                      "flex min-h-11 items-center justify-center rounded-xl border px-2 py-2 text-center text-xs font-extrabold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 sm:text-sm",
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

            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-ui-border bg-white/75 p-5">
              <p className="text-center text-xs font-bold uppercase tracking-wider text-ui-text-muted">
                Scan to support via {currentMethod.label}
              </p>
              <div className="relative mt-4 h-56 w-56 overflow-hidden rounded-3xl border-2 border-white bg-white shadow-sm sm:h-64 sm:w-64">
                <Image
                  src={currentMethod.src}
                  alt={`${currentMethod.label} QR Code`}
                  fill
                  sizes="(max-width: 640px) 224px, 256px"
                  className="object-contain p-3"
                  priority
                />
              </div>
              <p className="mt-3 max-w-full truncate text-center text-sm font-semibold text-ui-text-muted">
                {currentMethod.handle}
              </p>
            </div>
          </section>

          <section className="mt-5 flex flex-col items-center gap-5 rounded-3xl border-2 border-dashed border-brand-secondary/35 bg-brand-secondary/5 p-5 sm:flex-row sm:p-6">
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-brand-secondary">
                KIWI Love Optional Donation
              </h2>
              <p className="text-sm font-medium leading-6 text-ui-text-main">
                KIWI Love supports local dog rescue organizations and shelters. This
                is separate from Casa de Bloom event support, and 100% goes directly
                to the animals.
              </p>
            </div>
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-sm">
              <Image
                src="/assets/images/kiwi_love_qr.webp"
                alt="KIWI Love Dog Rescue QR Code"
                fill
                sizes="128px"
                className="object-contain p-2"
              />
            </div>
          </section>

          <footer className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] font-medium text-ui-text-muted/80">
            <Info size={14} />
            Optional donations are non-refundable.
          </footer>
        </div>
      </div>
    </main>
  );
}
