"use client";

import { createContext, useContext } from "react";
import type { MemberProfile } from "@/lib/services/auth";

interface DashboardContextValue {
  profile: MemberProfile;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({
  profile,
  children,
}: {
  profile: MemberProfile;
  children: React.ReactNode;
}) {
  return (
    <DashboardContext.Provider value={{ profile }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardProfile(): MemberProfile {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboardProfile must be used inside <DashboardProvider>");
  }
  return ctx.profile;
}
