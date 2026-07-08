"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Info } from "lucide-react";

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

export default function DonationPage() {
  const router = useRouter();
  const supportSectionRef = useRef<HTMLDivElement>(null);
  const [selectedMethod, setSelectedMethod] = useState<"venmo" | "zelle" | "paypal" | null>("venmo");

  const handleContinue = () => {
    router.push("/register/confirmation");
  };

  const scrollToSupport = () => {
    supportSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const currentMethodDetails = QR_METHODS.find((m) => m.key === selectedMethod);

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-x-hidden px-4 py-8 lg:py-12">
      
      {/* <div className="absolute inset-0 z-0 overflow-hidden">
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
      </div> */}

      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white/88 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 shadow-[0_32px_64px_rgba(31,27,36,0.18)] border border-white/70 space-y-8">
          
          {/* Welcome Header */}
          <header className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold text-brand-primary tracking-tight">
              You're In!
            </h1>
            <p className="text-base sm:text-lg text-ui-text-main font-medium max-w-xl mx-auto leading-relaxed">
              Welcome to Casa de Bloom. We're so excited to spend the day with you.
            </p>
          </header>

          {/* Optional Support Section */}
          <section ref={supportSectionRef} className="space-y-4 rounded-3xl border border-brand-primary/10 bg-brand-light/10 p-5 md:p-6 transition-all duration-300">
            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold text-brand-primary">
                Support Casa de Bloom
              </h2>
              <p className="text-xs text-ui-text-muted max-w-md mx-auto leading-relaxed">
                If you would like to support our community, registration gifts help cover event setup, refreshments, guest gifts, and Kiwi Spa experiences. Giving is entirely optional.
              </p>
            </div>

            {/* Payment Method Tabs */}
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

            {/* QR Code Container */}
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

          {/* Kiwi Love Section */}
          <section className="rounded-3xl border-2 border-dashed border-brand-secondary/30 bg-brand-secondary/5 p-5 md:p-6 flex flex-col sm:flex-row items-center gap-5 md:gap-6">
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-lg">🐾</span>
                <h3 className="text-xs font-bold text-brand-secondary uppercase tracking-widest">
                  Kiwi Love Optional Donation
                </h3>
              </div>
              <p className="text-xs text-ui-text-main leading-relaxed">
                KIWI Love supports local dog rescue organizations and shelters. This is a separate optional donation, and 100% goes directly to the animals.
              </p>
            </div>
            
            {/* Kiwi Love QR Code */}
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-sm border-2 border-white bg-white flex-shrink-0">
              <Image
                src="/assets/images/kiwi_love_qr.png"
                alt="Kiwi Love Dog Rescue QR Code"
                fill
                sizes="112px"
                className="object-contain p-2"
              />
            </div>
          </section>

          {/* Action Buttons */}
          <div className="space-y-4 pt-2">
            <Button
              type="button"
              variant="primary"
              rounded="xl"
              fullWidth
              size="lg"
              onClick={handleContinue}
            >
              Continue to My Invitation
            </Button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={scrollToSupport}
                className="text-xs font-semibold text-ui-text-muted hover:text-brand-primary transition-colors cursor-pointer border-b border-dashed border-ui-text-muted/40 hover:border-brand-primary pb-0.5"
              >
                Support Casa de Bloom (Optional)
              </button>
            </div>
          </div>

          {/* Low-priority non-refundable notice */}
          <footer className="text-center">
            <p className="text-[10px] text-ui-text-muted/70 flex items-center gap-2 justify-center">
              <Info size={14} />Registration donations are non-refundable.
            </p>
          </footer>

        </div>
      </div>
    </main>
  );
}