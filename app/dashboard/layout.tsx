import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchMemberMe } from "@/lib/services/auth";
import { Sidebar } from "@/components/Sidebar";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { DashboardProvider } from "@/lib/context/DashboardContext";

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
      <div className="min-h-screen bg-ui-bg-page flex flex-col lg:flex-row gap-6 p-4 md:p-6 lg:p-8">
        {/* Sidebar uses its own internal DEFAULT_NAV — no icon props crossing the server/client boundary */}
        <Sidebar role={profile.participant_type} />

        <div className="flex-1 w-full max-w-7xl mx-auto space-y-6">
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
