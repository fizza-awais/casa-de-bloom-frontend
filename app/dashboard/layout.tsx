import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchMemberMe } from "@/lib/services/auth";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { DashboardProvider } from "@/lib/context/DashboardContext";
import CasaVillaBackdrop from "@/components/ui/CasaVillaBackdrop";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const profile = await fetchMemberMe(cookieHeader);
  if (!profile) redirect("/login");

  return (
    <DashboardProvider profile={profile}>
      <div className="relative min-h-dvh overflow-hidden bg-ui-bg-page p-4 md:p-6">
        <div className="fixed inset-0 z-0">
          <CasaVillaBackdrop className="brightness-[0.92] saturate-[0.9]" priority />
          <div className="absolute inset-0 bg-[#fff8fb]/88 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-4">
          <DashboardNav
            firstName={profile.first_name}
            lastName={profile.last_name}
            cbId={profile.cb_id}
          />
          {children}
        </div>
      </div>
    </DashboardProvider>
  );
}
