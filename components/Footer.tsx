"use client";

import Link from "next/link";

type FooterSection =
  | {
      title: string;
      type: "links";
      items: {
        label: string;
        href: string;
      }[];
    }
  | {
      title: string;
      type: "contact";
      items: {
        label: "Location" | "Email" | "Phone";
        value: string;
      }[];
    }
  | {
      title: string;
      type: "social";
      items: {
        label: "Instagram" | "Facebook" | "Pinterest" | string;
        href: string;
      }[];
    };

export const footerSections: FooterSection[] = [
  {
    title: "Company",
    type: "links",
    items: [
      { label: "Our Story", href: "/our-story" },
      { label: "Gallery", href: "/gallery" },
      { label: "Get in Touch", href: "/get-in-touch" },
    ],
  },
  {
    title: "Contact Us",
    type: "contact",
    items: [
      { label: "Location", value: "San Diego, CA" },
      { label: "Email", value: "casadbloom@gmail.com" },
      { label: "Phone", value: "(619) 325-9896" },
    ],
  },
  {
    title: "Follow Us",
    type: "social",
    items: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/casadbloom/",
      },
    ],
  },
];

const SocialIcon = ({ label }: { label: string }) => {
  switch (label.toLowerCase()) {
    case "instagram":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8A4 4 0 0 1 16 11.37Z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
  }
};

export default function Footer() {
  return (
    <footer className="border-t border-ui-border bg-white font-sans text-ui-text-muted">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 lg:px-16">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          
          {/* Brand Identity Block */}
          <div className="flex flex-col space-y-4">
            <span className="text-lg font-bold tracking-wider text-ui-text-main">
              Casa D Bloom
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-ui-text-muted">
              Crafting unique experiences and beautiful spaces built to last.
            </p>
          </div>

          {/* Dynamic Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-primary">
                {section.title}
              </h2>

              {/* Navigation Links */}
              {section.type === "links" && (
                <ul className="space-y-3 text-sm">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="transition-colors duration-200 text-ui-text-muted hover:text-brand-secondary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {/* Contact Details */}
              {section.type === "contact" && (
                <address className="space-y-3 text-sm not-italic text-ui-text-muted">
                  {section.items.map((item) => {
                    if (item.label === "Location") {
                      <p key={item.label} className="flex flex-wrap gap-1">
                          <span className="font-semibold text-ui-text-main">{item.label}:</span>
                          <p className="break-all"
                          >
                            {item.value}
                          </p>
                        </p>
                    }

                    if (item.label === "Email") {
                      return (
                        <p key={item.label} className="flex flex-wrap gap-1">
                          <span className="font-semibold text-ui-text-main">{item.label}:</span>
                          <a
                            href={`mailto:${item.value}`}
                            className="break-all transition-colors hover:text-brand-accent"
                          >
                            {item.value}
                          </a>
                        </p>
                      );
                    }

                    return (
                      <p key={item.label} className="flex gap-1">
                        <span className="font-semibold text-ui-text-main">{item.label}:</span>
                        <a
                          href={`tel:${item.value.replace(/[^\d+]/g, "")}`}
                          className="transition-colors hover:text-brand-accent"
                        >
                          {item.value}
                        </a>
                      </p>
                    );
                  })}
                </address>
              )}

              {/* Social Navigation */}
              {section.type === "social" && (
                <div className="flex flex-wrap gap-3">
                  {section.items.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-ui-border text-ui-text-muted transition-all duration-300 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-light/30"
                    >
                      <SocialIcon label={item.label} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-ui-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ui-text-muted/70">
          <p>© {new Date().getFullYear()} Casa D Bloom. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-ui-text-main transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-ui-text-main transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}