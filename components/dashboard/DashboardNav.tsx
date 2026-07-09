"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/services/auth";

interface DashboardNavProps {
  firstName: string;
  lastName: string;
  cbId: string;
}

export default function DashboardNav({ firstName, lastName, cbId }: DashboardNavProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav className="w-full bg-white/60 backdrop-blur-md border border-ui-border rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        {/* <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-primary font-bold shadow-inner">
          {firstName[0]?.toUpperCase() || <User size={20} />}
        </div> */}
        <div>
          <h2 className="text-sm font-bold text-ui-text-main leading-tight flex items-center gap-1.5">
            Welcome, <span className="text-brand-primary">{firstName} {lastName}</span>
          </h2>
          <span className="text-xs text-ui-text-muted font-semibold tracking-wider bg-brand-light/50 px-2 py-0.5 rounded-full inline-block mt-0.5">
            ID: {cbId}
          </span>
        </div>
      </div>
    </nav>
  );
}
