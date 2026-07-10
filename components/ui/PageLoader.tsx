"use client";

import { ImagePlus, Loader2, Sparkles } from "lucide-react";

interface PageLoaderProps {
  title?: string;
  message?: string;
  fullscreen?: boolean;
}

export default function PageLoader({
  title = "Preparing Casa de Bloom",
  message = "Loading your experience...",
  fullscreen = true,
}: PageLoaderProps) {
  return (
    <div
      className={[
        "flex items-center justify-center bg-ui-bg-page p-6",
        fullscreen ? "min-h-dvh" : "min-h-[20rem]",
      ].join(" ")}
    >
      <div className="dashboard-reveal relative w-full max-w-sm overflow-hidden rounded-3xl border border-brand-primary/15 bg-white/85 p-6 text-center shadow-xl shadow-brand-primary/10 backdrop-blur-md">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary" />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light text-brand-primary shadow-sm">
          <Loader2 size={28} className="animate-spin" />
        </div>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-sunshine/35 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-dark">
          <Sparkles size={13} />
          Casa de Bloom
        </div>
        <h1 className="mt-3 text-xl font-extrabold text-ui-text-main">
          {title}
        </h1>
        <p className="mt-2 text-sm font-medium leading-6 text-ui-text-muted">
          {message}
        </p>
        <div className="mt-5 flex justify-center gap-2">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="h-2 w-2 rounded-full bg-brand-primary"
              style={{
                animation: "dashboard-soft-pulse 1.2s ease-in-out infinite",
                animationDelay: `${index * 160}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function RegistrationRedirectLoader() {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ui-bg-page/85 p-6 backdrop-blur-md">
      <div className="dashboard-reveal w-full max-w-md rounded-3xl border border-white/70 bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light text-brand-primary">
          <ImagePlus size={28} />
        </div>
        <h2 className="mt-4 text-xl font-extrabold text-ui-text-main">
          Preparing your dashboard
        </h2>
        <p className="mt-2 text-sm font-medium leading-6 text-ui-text-muted">
          Your registration is complete. We&apos;re loading your profile,
          images, and event details now.
        </p>
        <div className="mt-5 flex items-center justify-center gap-2 text-sm font-bold text-brand-primary">
          <Loader2 size={17} className="animate-spin" />
          Almost there...
        </div>
      </div>
    </div>
  );
}
