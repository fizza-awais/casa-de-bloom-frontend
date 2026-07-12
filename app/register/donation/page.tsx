"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Suspense, useState, useRef } from "react";
import Button from "@/components/ui/Button";
import { Info } from "lucide-react";
import { RegistrationFlowDetails } from "@/lib/registrationFlow";

const QR_METHODS = [
  {
    key: "venmo" as const,
    label: "Venmo",
    src: "/assets/images/Venmo.webp",
    color: "#6D1ED4",
    bg: "#F3EEFF",
  },
  {
    key: "zelle" as const,
    label: "Zelle",
    src: "/assets/images/Zelle.webp",
    color: "#6D1ED4",
    bg: "#F3EEFF",
  },
  {
    key: "paypal" as const,
    label: "PayPal",
    src: "/assets/images/PayPal.webp",
    color: "#6D1ED4",
    bg: "#F3EEFF",
  },
];

interface DonationViewProps {
  details: RegistrationFlowDetails;
  onContinue?: (details: RegistrationFlowDetails) => void;
}

export function DonationView({ details, onContinue }: DonationViewProps) {
  const router = useRouter();
  const supportSectionRef = useRef<HTMLDivElement>(null);

  const [selectedMethod, setSelectedMethod] = useState<
    "venmo" | "zelle" | "paypal" | null
  >("venmo");

  const handleContinue = () => {
    if (onContinue) {
      onContinue(details);
      return;
    }

    const query = new URLSearchParams({
      invitationNumber: details.invitationNumber,
      cbId: details.cbId,
      name: details.name,
      eventDate: details.eventDate ?? "",
      participantType: details.participantType,
      recordType: details.recordType,
      recordId: details.recordId,
      registrationId: details.registrationId ?? "",
      volunteerId: details.volunteerId ?? "",
      email: details.email ?? "",
      phone: details.phone ?? "",
    });
    router.push(`/register/confirmation?${query.toString()}`);
  };

  const scrollToSupport = () => {
    supportSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const currentMethodDetails = QR_METHODS.find((method) => method.key === selectedMethod);

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-x-hidden px-4 py-8 lg:py-12">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/assets/images/bg_image_sunset_2026.webp"
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

      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white/88 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 shadow-[0_32px_64px_rgba(31,27,36,0.18)] border border-white/70 space-y-8">
          <header className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold text-brand-primary tracking-tight">
              You're In!
            </h1>
            <p className="text-base sm:text-lg text-ui-text-main font-medium max-w-xl mx-auto leading-relaxed">
              Welcome to Casa de Bloom. We're so excited to spend the day with you.
            </p>
          </header>

          <section
            ref={supportSectionRef}
            className="space-y-4 rounded-3xl border border-brand-primary/10 bg-brand-light/10 p-5 md:p-6 transition-all duration-300"
          >
            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold text-brand-primary">
                How donations help
              </h2>
              <p className="mx-auto max-w-md text-xs leading-relaxed text-ui-text-muted">
                Donations are welcome. Your support helps us cover event setup,
                cleanup, complimentary Kiwi Spa services, and create an amazing
                experience for all. Giving is always optional.
              </p>
            </div>

            <div className="rounded-2xl border border-ui-border bg-white/50 p-2">
              <div className="grid grid-cols-3 gap-2">
                {QR_METHODS.map((method) => {
                  const isSelected = selectedMethod === method.key;
                  return (
                    <button
                      key={method.key}
                      type="button"
                      onClick={() => setSelectedMethod(method.key)}
                      className={[
                        "flex items-center justify-center py-2 px-3 rounded-lg border transition-all duration-200 focus:outline-none cursor-pointer text-center font-bold text-xs",
                        isSelected
                          ? "border-brand-primary shadow-sm scale-[1.01] ring-2 ring-brand-primary/10"
                          : "border-ui-border hover:border-brand-primary/20 bg-white",
                      ].join(" ")}
                      style={isSelected ? { background: method.bg, color: method.color } : {}}
                    >
                      {method.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-ui-border bg-white/70 p-4 flex flex-col items-center justify-center min-h-[260px]">
              {currentMethodDetails ? (
                <div className="flex flex-col items-center gap-2.5 w-full">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ui-text-muted text-center">
                    Scan to support via {currentMethodDetails.label}
                  </p>
                  <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-sm border-2 border-white bg-white">
                    <Image
                      src={currentMethodDetails.src}
                      alt={`${currentMethodDetails.label} QR Code`}
                      fill
                      sizes="192px"
                      className="object-contain p-2"
                      priority
                    />
                  </div>
                </div>
              ) : (
                <p className="text-xs text-ui-text-muted">Please select a payment method above</p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border-2 border-dashed border-brand-secondary/30 bg-brand-secondary/5 p-5 md:p-6 flex flex-col sm:flex-row items-center gap-5 md:gap-6">
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-lg font-extrabold text-brand-secondary">KIWI</span>
                <h3 className="text-xs font-bold text-brand-secondary uppercase tracking-widest">
                  Kiwi Love Optional Donation
                </h3>
              </div>
              <p className="text-xs text-ui-text-main leading-relaxed">
                KIWI Love supports local dog rescue organizations and shelters. This
                is a separate optional donation, and 100% goes directly to the animals.
              </p>
            </div>

            <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-sm border-2 border-white bg-white flex-shrink-0">
              <Image
                src="/assets/images/kiwi_love_qr.webp"
                alt="Kiwi Love Dog Rescue QR Code"
                fill
                sizes="112px"
                className="object-contain p-2"
              />
            </div>
          </section>

          <div className="space-y-4 pt-2">
            <Button
              type="button"
              variant="primary"
              rounded="xl"
              fullWidth
              size="lg"
              onClick={handleContinue}
              disabled={!details.invitationNumber}
            >
              Continue to My Invitation
            </Button>

            <div className="text-center">
              <Button
                type="button"
                onClick={scrollToSupport}
                variant="outline"
                rounded="xl"
                size="md"
              >
                Support Casa de Bloom (Optional)
              </Button>
            </div>
          </div>

          <footer className="text-center">
            <p className="text-[10px] text-ui-text-muted/70 flex items-center gap-2 justify-center">
              <Info size={14} />Optional donations are non-refundable.
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}

function DonationContent() {
  const params = useSearchParams();
  const recordType = (params.get("recordType") ??
    (params.get("participantType") === "volunteer" ? "volunteer" : "registration")) as
    | "registration"
    | "volunteer";

  return (
    <DonationView
      details={{
        invitationNumber: params.get("invitationNumber") ?? "",
        cbId: params.get("cbId") ?? "",
        name: params.get("name") ?? "",
        eventDate: params.get("eventDate") ?? "",
        participantType: params.get("participantType") ?? "",
        recordType,
        recordId:
          params.get("recordId") ??
          params.get("registrationId") ??
          params.get("volunteerId") ??
          "",
        registrationId: params.get("registrationId") ?? "",
        volunteerId: params.get("volunteerId") ?? "",
        email: params.get("email") ?? "",
        phone: params.get("phone") ?? "",
      }}
    />
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
