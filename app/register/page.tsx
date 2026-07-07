"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sparkles, HeartHandshake } from "lucide-react";
import Button from "@/components/ui/Button";

export default function RegisterLandingPage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center font-sans selection:bg-brand-primary/20 overflow-x-hidden px-4 py-8 md:py-12">
      
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

        {/* Depth & Contrast Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35 mix-blend-multiply" />
      </div>

      {/* --- REGISTRATION CARD --- */}
      <div className="relative z-10 w-full max-w-[420px] bg-white/75 backdrop-blur-xl rounded-[28px] p-6 md:p-8 text-center shadow-[0_24px_50px_rgba(31,27,36,0.12)] border border-white/60">
        
        {/* Context Tag using Casa de Bloom "Sunshine" Highlight */}
        <span className="text-[11px] font-bold text-ui-text-main uppercase tracking-widest bg-brand-sunshine px-3 py-1 rounded-full inline-block mb-4 shadow-sm">
          Join the Bloom
        </span>
        
        <h1 className="text-base md:text-[18px] font-semibold text-ui-text-main tracking-tight mb-6">
          How would you like to participate?
        </h1>

        <div className="space-y-3">
          
          <Button
            variant="primary"
            size="md"
            rounded="xl"
            fullWidth
            icon={<Sparkles size={16} strokeWidth={2.5} />}
            onClick={() => router.push("/register/guest")}
          >
            Join as a Guest
          </Button>

          <Button
            variant="ghost"
            size="md"
            rounded="xl"
            fullWidth
            icon={<HeartHandshake size={16} strokeWidth={2.5} />}
            onClick={() => router.push("/register/volunteer")}
          >
            Volunteer
          </Button>
          
        </div>
      </div>
      <div className="relative z-10 mt-8 text-center text-white/90 drop-shadow-md pointer-events-none">
        <p className="font-serif italic text-base md:text-lg opacity-90 tracking-wide">
          “Where connections become opportunities.”
        </p>
      </div>
    </main>
  );
}