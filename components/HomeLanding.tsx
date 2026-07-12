"use client";

import ResponsiveEventBackdrop from "@/components/ui/ResponsiveEventBackdrop";
import Link from "next/link";
import { HeartHandshake, Sparkles } from "lucide-react";

interface HomeLandingProps {
  onGuest?: () => void;
  onVolunteer?: () => void;
}

export default function HomeLanding({ onGuest, onVolunteer }: HomeLandingProps = {}) {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center font-sans selection:bg-brand-primary/20 overflow-x-hidden px-4 py-8 md:py-12">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <ResponsiveEventBackdrop
          alt="Casa de Bloom Event Vibe backdrop"
          className="brightness-[0.8]"
        />

        <div className="absolute inset-0 bg-transparent">
          <div className="absolute -top-1/4 -left-1/4 w-[80%] h-[80%] rounded-full bg-brand-light/40 blur-[130px]" />
          <div className="absolute -bottom-1/4 -right-1/4 w-[75%] h-[75%] rounded-full bg-brand-accent/10 blur-[120px]" />
        </div>

        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/35 mix-blend-multiply" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] bg-white/75 backdrop-blur-xl rounded-[28px] p-6 md:p-8 text-center shadow-[0_24px_50px_rgba(31,27,36,0.12)] border border-white/60">
        <span className="text-[11px] font-bold text-ui-text-main uppercase tracking-widest bg-brand-sunshine px-3 py-1 rounded-full inline-block mb-4 shadow-sm">
          Join the Bloom
        </span>

        <h1 className="text-base md:text-[18px] font-semibold text-ui-text-main tracking-tight mb-6">
          How would you like to participate?
        </h1>

        <div className="space-y-3">
          <button
            type="button"
            onClick={onGuest}
            className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-hover"
          >
            <Sparkles size={16} strokeWidth={2.5} />
            <span>Join as a Guest</span>
          </button>

          <button
            type="button"
            onClick={onVolunteer}
            className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand-primary bg-transparent px-4 py-2 text-base font-medium text-brand-primary transition duration-200 hover:bg-brand-light"
          >
            <HeartHandshake size={16} strokeWidth={2.5} />
            <span>Volunteer</span>
          </button>
        </div>

        <div className="text-center mt-6 text-xs text-ui-text-muted">
          Already registered for an event?{" "}
          <Link
            href="/login"
            className="inline-flex items-center gap-1 rounded-xl px-2 py-1 font-bold text-brand-primary hover:underline"
          >
            <span>Login</span>
          </Link>
        </div>
      </div>

      <div className="relative z-10 mt-8 text-center text-white/90 drop-shadow-md pointer-events-none">
        <p className="font-serif text-base italic tracking-wide opacity-90 md:text-lg">
          &ldquo;Where connections become opportunities.&rdquo;
        </p>
      </div>
    </main>
  );
}
