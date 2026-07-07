"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Button from "./ui/Button";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/business", label: "Business Details" },
  { href: "/products", label: "Products" },
  { href: "/promotions", label: "Promotions" },
  { href: "/customers", label: "Customers" },
  { href: "/orders", label: "Orders" },
  { href: "/complaints", label: "Complaints" },
  { href: "/chat", label: "Chat" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar() {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur border-b border-ui-border p-3 flex items-center justify-between shadow-sm z-50">
        <Button
          variant="outline"
          size="sm"
          className="border-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <div className="text-lg font-extrabold tracking-tight">
          <span className="text-brand-700">Wazzi</span>
          <span className="text-mint-700">Bot</span>
        </div>
        <div className="w-10" />
      </header>

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed lg:sticky top-0 lg:top-4 inset-y-0 left-0 z-[70] lg:z-0
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 h-screen lg:h-[calc(100vh-2rem)] w-64 shrink-0
          lg:rounded-2xl border-r lg:border border-slate-200 bg-white/90 backdrop-blur px-3 py-4 shadow-xl lg:shadow-sm
        `}
      >
        <div className="px-3 pb-3 hidden lg:block">
          <div className="text-lg font-extrabold tracking-tight">
            <span className="text-brand-700">Wazzi</span>
            <span className="text-mint-700">Bot</span>
          </div>
          <div className="text-xs text-slate-500">Tenant Dashboard</div>
        </div>

        <nav className="mt-8 lg:mt-2 space-y-1">
          {nav.map((item) => {
            const active = path === item.href || path.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={[
                  "block rounded-xl px-3 py-2.5 text-sm font-bold transition-all",
                  active
                    ? "bg-mint-50 text-mint-900 ring-1 ring-mint-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                ].join(" ")}
              >
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

