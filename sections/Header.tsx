"use client";

import { useState } from "react";
import { Menu, Globe, CircleDollarSign, User } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileMenu } from "@/components/ui/MobileMenu";
import type { NavLink } from "@/types";

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Hotels", href: "/hotels" },
  { label: "Destinations", href: "/destinations" },
  { label: "Deals & Offers", href: "/deals" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-primary-300 bg-gradient-to-r from-white/80 via-primary-50/30 to-white/80 backdrop-blur-md dark:border-primary-900/40 dark:from-gray-950/80 dark:via-primary-950/20 dark:to-gray-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden lg:flex lg:items-center lg:gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-700 dark:text-gray-400 dark:hover:bg-primary-950/30 dark:hover:text-primary-400"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="hidden items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 sm:flex"
            aria-label="Select language"
          >
            <Globe className="h-4 w-4" />
            <span>EN</span>
          </button>
          <button
            className="hidden items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 sm:flex"
            aria-label="Select currency"
          >
            <CircleDollarSign className="h-4 w-4" />
            <span>BDT</span>
          </button>
          <ThemeToggle />
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label="User account"
          >
            <User className="h-5 w-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={NAV_LINKS}
      />
    </header>
  );
}
