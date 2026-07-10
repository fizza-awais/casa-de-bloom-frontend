"use client";

import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Heart,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/services/auth";

interface DashboardNavProps {
  firstName: string;
  lastName: string;
  cbId: string;
}

const NAV_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "events",
    label: "My Events",
    icon: CalendarDays,
  },
  {
    id: "donations",
    label: "Donations",
    icon: Heart,
  },
];

export default function DashboardNav({
  firstName,
  lastName,
}: DashboardNavProps) {
  const router = useRouter();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isProfileMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const clickedInsideMobile = mobileMenuRef.current?.contains(target);
      const clickedInsideDesktop = desktopMenuRef.current?.contains(target);

      if (!clickedInsideMobile && !clickedInsideDesktop) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isProfileMenuOpen]);

  const goToDashboardSection = (id: string) => {
    const section = document.getElementById(id);

    if (!section) {
      router.push(`/dashboard#${id}`);
      setIsProfileMenuOpen(false);
      return;
    }

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setIsProfileMenuOpen(false);
  };

  const goToProfile = () => {
    router.push("/dashboard/profile");
    setIsProfileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  const initials =
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "CB";

  return (
    <nav className="sticky top-4 z-40 w-full rounded-2xl border border-ui-border bg-white/85 px-4 py-3 shadow-sm backdrop-blur-md md:px-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => goToDashboardSection("overview")}
            className="text-left text-xl font-extrabold tracking-tight"
          >
            <span className="text-brand-primary">Casa de</span>
            <span className="text-brand-secondary"> Bloom</span>
          </button>

          <div className="lg:hidden" ref={mobileMenuRef}>
            <ProfileMenuButton
              initials={initials}
              isOpen={isProfileMenuOpen}
              onToggle={() => setIsProfileMenuOpen((open) => !open)}
              onEditProfile={goToProfile}
              onLogout={handleLogout}
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar lg:justify-center lg:overflow-visible lg:pb-0">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => goToDashboardSection(item.id)}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-ui-text-muted transition-colors hover:bg-brand-light/70 hover:text-brand-primary"
              >
                <Icon size={16} className="text-brand-accent" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="text-right">
            <p className="text-sm font-bold leading-tight text-ui-text-main">
              Welcome,{" "}
              <span className="text-brand-primary">
                {firstName} {lastName}
              </span>
            </p>
          </div>

          <div ref={desktopMenuRef}>
            <ProfileMenuButton
              initials={initials}
              isOpen={isProfileMenuOpen}
              onToggle={() => setIsProfileMenuOpen((open) => !open)}
              onEditProfile={goToProfile}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

function ProfileMenuButton({
  initials,
  isOpen,
  onToggle,
  onEditProfile,
  onLogout,
}: {
  initials: string;
  isOpen: boolean;
  onToggle: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-sm font-extrabold text-brand-primary shadow-sm ring-1 ring-brand-primary/10 transition-colors hover:bg-brand-primary hover:text-white"
        aria-expanded={isOpen}
        aria-label="Open profile menu"
      >
        {initials}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-ui-border bg-white p-2 shadow-xl">
          <button
            type="button"
            onClick={onEditProfile}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-ui-text-main transition-colors hover:bg-brand-light/60 hover:text-brand-primary"
          >
            <User size={16} />
            Edit Profile
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-danger-600 transition-colors hover:bg-danger-500/10"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
