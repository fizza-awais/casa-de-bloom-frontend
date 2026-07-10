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
    <nav className="sticky top-3 z-40 w-full rounded-[1.4rem] border border-white/70 bg-white/90 px-3 py-3 shadow-sm backdrop-blur-md md:px-5 lg:top-4 lg:rounded-2xl">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => goToDashboardSection("overview")}
            className="text-left text-2xl font-extrabold tracking-tight sm:text-xl"
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

        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-ui-bg-page/80 p-1 lg:flex lg:gap-2 lg:overflow-visible lg:bg-transparent lg:p-0">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => goToDashboardSection(item.id)}
                className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[11px] font-extrabold text-ui-text-muted transition-all hover:bg-white hover:text-brand-primary sm:text-sm lg:shrink-0 lg:justify-start lg:gap-2 lg:px-3"
              >
                <Icon size={15} className="shrink-0 text-brand-accent" />
                <span className="truncate">{item.label}</span>
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
        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-light text-sm font-extrabold text-brand-primary shadow-sm ring-1 ring-brand-primary/10 transition-colors hover:bg-brand-primary hover:text-white lg:h-10 lg:w-10 lg:rounded-full"
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
