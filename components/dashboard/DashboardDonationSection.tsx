"use client";

import { useState } from "react";
import { Gift } from "lucide-react";
import DonationStep from "@/components/forms/DonationStep";

interface DashboardDonationSectionProps {
  participantType?: "guest" | "volunteer";
}

export default function DashboardDonationSection({
  participantType = "guest",
}: DashboardDonationSectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<
    "venmo" | "zelle" | "paypal" | null
  >("venmo");
  const isVolunteer = participantType === "volunteer";

  return (
    <section className="dashboard-interactive-card dashboard-shine rounded-3xl border border-ui-border bg-white/80 p-5 shadow-sm backdrop-blur-md md:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-ui-text-main">
            <Gift size={20} className="dashboard-float-icon text-brand-primary" />
            {isVolunteer ? "Optional Support" : "Donations"}
          </h2>
          <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-ui-text-muted">
            {isVolunteer
              ? "Your time and contribution are already deeply appreciated. If you'd also like to support Casa de Bloom, donations are welcome but never expected."
              : "If you would like to support our community, registration gifts help cover event setup, refreshments, guest gifts, Kiwi Spa experiences, and future Casa de Bloom programs."}
          </p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full bg-brand-light px-3 py-1 text-xs font-bold text-brand-primary">
          Optional
        </span>
      </div>

      <DonationStep
        selectedMethod={selectedMethod}
        onMethodSelect={setSelectedMethod}
        showHeader={false}
        showSkipNote={false}
        layout="dashboard"
      />
    </section>
  );
}
