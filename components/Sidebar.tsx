"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  UserCheck,
  CalendarDays,
  Heart,
  Users,
} from "lucide-react";
import Button from "./ui/Button";
import { logout } from "@/lib/services/auth";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
};

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  guest: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/profile", label: "Profile", icon: UserCheck },
    { href: "/dashboard/events", label: "My Events", icon: CalendarDays },
    { href: "/dashboard/donations", label: "Donations", icon: Heart },
  ],
  volunteer: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/profile", label: "Profile", icon: UserCheck },
    { href: "/dashboard/events", label: "My Events", icon: CalendarDays },
    { href: "/dashboard/volunteers", label: "Volunteer Hub", icon: Users },
    { href: "/dashboard/donations", label: "Donations", icon: Heart },
  ],
};

const DEFAULT_ROLE = "guest";

export interface SidebarProps {
  role?: string;
}

export function Sidebar({ role = DEFAULT_ROLE }: SidebarProps) {
  const navLinks = NAV_BY_ROLE[role] ?? NAV_BY_ROLE[DEFAULT_ROLE];
  const path = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);
  const handleLogout = async () => {
    await logout();
    closeSidebar();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-ui-text-main/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-ui-border bg-ui-card/80 p-3 shadow-sm backdrop-blur lg:hidden">
        <Button
          variant="outline"
          size="sm"
          className="border-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        <div className="text-lg font-extrabold tracking-tight">
          <span className="text-brand-primary">Casa de</span>
          <span className="text-brand-secondary"> Bloom</span>
        </div>

        <div className="w-10" />
      </header>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 lg:top-4 inset-y-0 left-0 z-[70] lg:z-0
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          h-screen lg:h-[calc(100vh-2rem)]
          w-64 shrink-0

          flex flex-col

          lg:rounded-3xl
          border-r lg:border border-ui-border

          bg-brand-light/35
          backdrop-blur

          px-4 py-5

          shadow-xl lg:shadow-lg
        `}
      >
        {/* Logo */}
        <div className="hidden lg:block px-2">
          <div className="text-xl font-extrabold tracking-tight">
            <span className="text-brand-primary">Casa de</span>
            <span className="text-brand-secondary"> Bloom</span>
          </div>

          {/* <div className="mt-1 text-xs font-medium text-brand-dark">
            Member Hub
          </div> */}

          <div className="mx-1 mt-4 mb-2 h-px bg-brand-primary/15" />
        </div>

        {/* Navigation */}
        <nav className="mt-8 lg:mt-4 flex-1 space-y-2">
          {navLinks.map((item) => {
            const active = path === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={[
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                  active
                    ? "border border-brand-primary/15 bg-white text-brand-primary shadow-sm"
                    : "text-ui-text-muted hover:bg-white/70 hover:text-brand-primary",
                ].join(" ")}
              >
                <Icon
                  size={18}
                  className={[
                    "shrink-0 transition-colors duration-200",
                    active
                      ? "text-brand-primary"
                      : "text-brand-accent group-hover:text-brand-primary",
                  ].join(" ")}
                />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-4 border-t border-brand-primary/10 pt-5">
          <Button variant="primary" fullWidth onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>

      {/* Spacer for mobile */}
      <div className="h-16 lg:hidden" />
    </>
  );
}
