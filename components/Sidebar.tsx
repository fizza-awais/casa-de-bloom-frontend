"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

type NavItem = { href: string; label: string; icon: React.ComponentType<any> };

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
  ]
};

const DEFAULT_ROLE = "guest";

export interface SidebarProps {
  role?: string;
}

export function Sidebar({ role = DEFAULT_ROLE }: SidebarProps) {
  const navLinks = NAV_BY_ROLE[role] ?? NAV_BY_ROLE[DEFAULT_ROLE];
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-ui-text-main/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-ui-card/80 backdrop-blur border-b border-ui-border p-3 flex items-center justify-between shadow-sm z-50">
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

      {/* Sidebar Container */}
      <aside
        className={`
          fixed lg:sticky top-0 lg:top-4 inset-y-0 left-0 z-[70] lg:z-0
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 h-screen lg:h-[calc(100vh-2rem)] w-64 shrink-0
          lg:rounded-2xl border-r lg:border border-ui-border bg-ui-card/90 backdrop-blur px-3 py-4 shadow-xl lg:shadow-sm
        `}
      >
        <div className="px-3 pb-3 hidden lg:block">
          <div className="text-lg font-extrabold tracking-tight">
            <span className="text-brand-primary">Casa de</span>
            <span className="text-brand-secondary"> Bloom</span>
          </div>
          <div className="text-xs text-ui-text-muted">Member Hub</div>
        </div>

        <nav className="mt-8 lg:mt-2 space-y-1">
          {navLinks.map((item) => {
            const active = path === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={[
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold transition-all",
                  active
                    ? "bg-brand-light text-brand-primary ring-1 ring-brand-primary/20"
                    : "text-ui-text-muted hover:bg-brand-light/40 hover:text-ui-text-main",
                ].join(" ")}
              >
                <Icon size={16} className="shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Spacer for mobile to push content below the fixed header */}
      <div className="h-16 lg:hidden" />
    </>
  );
}