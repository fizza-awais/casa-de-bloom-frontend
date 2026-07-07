"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Suspense, useState } from "react";
import Button from "@/components/ui/Button";

const QR_METHODS = [
  {
    key: "venmo" as const,
    label: "Venmo",
    src: "/assets/images/Venmo.jpeg",
    color: "#6D1ED4",
    bg: "#F3EEFF",
  },
  {
    key: "zelle" as const,
    label: "Zelle",
    src: "/assets/images/Zelle.jpg",
    color: "#6D1ED4",
    bg: "#F3EEFF",
  },
  {
    key: "paypal" as const,
    label: "PayPal",
    src: "/assets/images/PayPal.jpg",
    color: "#6D1ED4",
    bg: "#F3EEFF",
  },
];

function DonationContent() {
  const params = useSearchParams();
  const router = useRouter();

  const invitationNumber = params.get("invitationNumber") ?? "";
  const cbId = params.get("cbId") ?? "";
  const name = params.get("name") ?? "";
  const eventDate = params.get("eventDate") ?? "";
  const participantType = params.get("participantType") ?? "";
  const recordType = params.get("recordType") ?? "";
  const recordId = params.get("recordId") ?? "";

  const [selectedMethod, setSelectedMethod] = useState<"venmo" | "zelle" | "paypal" | null>("venmo");

  const handleContinue = () => {
    const query = new URLSearchParams({
      invitationNumber,
      cbId,
      name,
      eventDate,
      participantType,
      recordType,
      recordId,
      registrationId: params.get("registrationId") ?? "",
      volunteerId: params.get("volunteerId") ?? "",
    });
    router.push(`/register/confirmation?${query.toString()}`);
  };

  const currentMethodDetails = QR_METHODS.find((m) => m.key === selectedMethod);

  return (
    // 1. Reduced vertical layout padding from py-12 to lg:py-4 to prevent pushing things out of view
    <main className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-x-hidden px-4 py-8 lg:py-4">
      
      {/* Background System */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/assets/images/bg_image.png"
          alt="Casa de Bloom Event Vibe backdrop"
          fill
          priority
          className="object-cover object-center pointer-events-none brightness-[0.8] scale-105"
        />
        <div className="absolute inset-0 bg-transparent">
          <div className="absolute -top-1/4 -left-1/4 w-[80%] h-[80%] rounded-full bg-brand-light/40 blur-[130px]" />
          <div className="absolute -bottom-1/4 -right-1/4 w-[75%] h-[75%] rounded-full bg-brand-accent/10 blur-[120px]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35 mix-blend-multiply" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* 2. Tightened outer modal padding down to p-6 on desktop screens */}
        <div className="bg-white/88 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 lg:p-6 shadow-[0_32px_64px_rgba(31,27,36,0.18)] border border-white/70">
          {/* 3. Reduced gap sizes inside the grid */}
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-[0.95fr_1.05fr] items-stretch">
            
            {/* Left Column */}
            {/* 4. Reduced gap-6 to lg:gap-4 for tighter text distribution */}
            <section className="flex flex-col gap-4 lg:gap-3.5">
              <div className="space-y-3 lg:space-y-2">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-brand-primary uppercase tracking-[0.25em]">
                    Support Casa de Bloom
                  </h4>
                  <h1 className="text-2xl sm:text-3xl lg:text-2xl font-extrabold text-ui-text-main tracking-tight leading-tight max-w-xl">
                    Help us grow the community
                  </h1>
                </div>
                <p className="max-w-xl text-xs sm:text-sm text-ui-text-muted leading-relaxed">
                  Registration donations help us cover event setup, refreshments,
                  staffing, guest gifts, and Kiwi Spa experiences. Giving is always
                  optional, and you can continue without donating.
                </p>
              </div>

              <div className="rounded-2xl border border-brand-primary/20 bg-brand-light/25 p-4 lg:p-3.5">
                <p className="text-xs font-semibold text-brand-dark uppercase tracking-wide">
                  Registration donations are non-refundable.
                </p>
                <p className="mt-1 text-xs sm:text-sm text-ui-text-main leading-relaxed">
                  You can choose any method on the right, or skip this step and go straight
                  to your invitation ticket.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-brand-secondary/35 bg-brand-secondary/5 p-4 lg:p-3.5 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">🐾</span>
                  <div>
                    <p className="text-xs font-bold text-brand-secondary uppercase tracking-widest">
                      Optional - Kiwi Love Nonprofit
                    </p>
                    <p className="text-[10px] text-ui-text-muted">
                      Dog rescue and local shelter support
                    </p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-ui-text-main leading-relaxed">
                  KIWI Love supports local dog rescue organizations and shelters. This
                  is a separate optional donation, and 100% goes directly to the animals.
                </p>
              </div>

              <div className="space-y-2 pt-2 mt-auto">
                <Button
                  type="button"
                  variant="primary"
                  rounded="xl"
                  fullWidth
                  size="md"
                  onClick={handleContinue}
                >
                  Skip
                </Button>
                <p className="text-[10px] text-ui-text-muted text-left leading-relaxed max-w-md">
                  Donation is completely voluntary. You can scan the code above to support us, or simply skip to view your invitation ticket.
                </p>
              </div>
            </section>

            {/* Right Column */}
            <section className="flex flex-col gap-4">
              <div className="rounded-3xl border border-ui-border bg-ui-bg/20 p-4 lg:p-3.5">
                <p className="text-xs font-bold text-ui-text-muted uppercase tracking-wider mb-3">
                  Select a payment method
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {QR_METHODS.map((method) => {
                    const isSelected = selectedMethod === method.key;
                    return (
                      <button
                        key={method.key}
                        type="button"
                        onClick={() => setSelectedMethod(method.key)}
                        className={[
                          "flex items-center justify-center py-2.5 px-4 rounded-xl border-2 transition-all duration-200 focus:outline-none cursor-pointer text-center font-bold text-xs",
                          isSelected
                            ? "border-brand-primary shadow-md scale-[1.02] ring-2 ring-brand-primary/15"
                            : "border-ui-border hover:border-brand-primary/40",
                        ].join(" ")}
                        style={{ background: method.bg, color: method.color }}
                      >
                        {method.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Reduced min-h from 420px down to lg:min-h-[340px] */}
              <div className="flex-1 rounded-[2rem] border border-ui-border bg-white/75 p-4 flex flex-col items-center justify-center min-h-[360px] lg:min-h-[330px]">
                {currentMethodDetails ? (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-ui-text-muted text-center">
                      Scan QR code to pay via {currentMethodDetails.label}
                    </p>

                    {/* 6. Scaled down the QR image size wrapper on desktop to safely prevent overflows */}
                    <div className="relative w-64 h-64 lg:w-60 lg:h-60 rounded-[1.75rem] overflow-hidden shadow-lg border-4 border-white bg-white">
                      <Image
                        src={currentMethodDetails.src}
                        alt={`${currentMethodDetails.label} QR Code`}
                        fill
                        sizes="(max-width: 640px) 256px, 240px"
                        className="object-contain p-3"
                        priority
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-ui-text-muted">Please select a payment method above</p>
                )}
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}

export default function DonationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <DonationContent />
    </Suspense>
  );
}
