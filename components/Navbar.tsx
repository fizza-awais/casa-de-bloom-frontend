"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';

const NAV_LINKS = [
  { label: "OUR STORY", href: "/our-story" },
  { label: "GALLERY", href: "/gallery" },
  { label: "GET IN TOUCH", href: "/get-in-touch" },
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ui-border bg-white/90 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl flex w-full items-center justify-between px-4 sm:px-6 lg:px-8 py-0">

          <Link href="/" className="shrink-0 relative block" aria-label="Casa de Bloom Home">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex items-center justify-center transition-transform hover:opacity-95">
              <Image
                src="/assets/images/Casa_de_Bloom_logo_2.webp"
                alt="Casa de Bloom Logo"
                fill
                className="object-contain p-4"
                priority
              />
            </div>
          </Link>

          {/* Desktop Links matching image_db45c8.png placement */}
          <nav className="hidden lg:block" aria-label="Primary Navigation">
            <ul className="flex items-center gap-8 xl:gap-10">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] font-bold tracking-[0.15em] text-brand-primary hover:text-brand-secondary transition-colors duration-200 relative py-2 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-secondary after:transition-all hover:after:w-full"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        
        {/* Right Side Action Context Panel using component tokens */}
        <div className="hidden lg:block">
          <Link href="/get-in-touch" passHref legacyBehavior>
            <Button
              variant="outline"
              size="lg"
              rounded="full"
            >
              BOOK AN EVENT
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button Burger Trigger */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          className="flex flex-col justify-center items-center gap-1.5 p-3 lg:hidden z-50 w-10 h-10 rounded-full hover:bg-brand-light/30 transition-colors"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span 
            className={`block h-0.5 w-5 bg-ui-text-main transition-all duration-300 origin-center ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`} 
            aria-hidden="true" 
          />
          <span 
            className={`block h-0.5 w-5 bg-ui-text-main transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`} 
            aria-hidden="true" 
          />
          <span 
            className={`block h-0.5 w-5 bg-ui-text-main transition-all duration-300 origin-center ${
              menuOpen ? "-rotate-45 -translate-y-1" : ""
            }`} 
            aria-hidden="true" 
          />
        </button>
      </div>

      {/* Slide Out Mobile Drawer Wrapper Context */}
      {menuOpen && (
        <nav className="border-t border-ui-border bg-white py-8 lg:hidden animate-in fade-in slide-in-from-top-4 duration-200" aria-label="Mobile Navigation">
          <ul className="flex flex-col items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-[13px] font-bold tracking-[0.15em] text-brand-primary hover:text-brand-secondary py-1 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-4 w-full max-w-60 text-center">
              <Link href="/get-in-touch" passHref>
                <Button
                  variant="outline"
                  size="md"
                  rounded="full"
                  fullWidth
                  onClick={() => setMenuOpen(false)}
                  className="text-[11px] font-bold tracking-[0.15em] shadow-sm"
                >
                  BOOK AN EVENT
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
