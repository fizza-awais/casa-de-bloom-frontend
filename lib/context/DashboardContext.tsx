"use client";

import { createContext, useContext, useState } from "react";
import type { MemberProfile } from "@/lib/services/auth";

interface DashboardContextValue {
  profile: MemberProfile;
  setProfile: (profile: MemberProfile) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({
  profile,
  children,
}: {
  profile: MemberProfile;
  children: React.ReactNode;
}) {
  const [currentProfile, setCurrentProfile] = useState(profile);

  return (
    <DashboardContext.Provider
      value={{ profile: currentProfile, setProfile: setCurrentProfile }}
    >
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

export function useDashboardProfileActions() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboardProfileActions must be used inside <DashboardProvider>");
  }
  return { setProfile: ctx.setProfile };
}
