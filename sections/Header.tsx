"use client";

import { memo, useState, useCallback } from "react";
import Link from "next/link";
import { Menu, User, ShoppingCart } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { useCart } from "@/context/CartContext";
import type { NavLink } from "@/types";

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Hotels", href: "/hotels" },
  { label: "Destinations", href: "/destinations" },
  // { label: "Deals & Offers", href: "/deals" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// Separate component for cart indicator to isolate cart-related re-renders
const CartIndicator = memo(function CartIndicator() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Cart (${totalItems} items)`}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Link>
  );
});

CartIndicator.displayName = "CartIndicator";

// Separate component for navigation links to prevent re-renders
const NavLinks = memo(function NavLinks() {
  return (
    <nav className="hidden lg:flex lg:items-center lg:gap-1">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          prefetch={true}
          className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-700 dark:text-gray-400 dark:hover:bg-primary-950/30 dark:hover:text-primary-400"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
});

NavLinks.displayName = "NavLinks";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuClose = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleMobileMenuOpen = useCallback(() => {
    setMobileMenuOpen(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-primary-300 bg-gradient-to-r from-white/80 via-primary-50/30 to-white/80 backdrop-blur-md dark:border-primary-900/40 dark:from-gray-950/80 dark:via-primary-950/20 dark:to-gray-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <NavLinks />
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <CartIndicator />

          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label="User account"
          >
            <User className="h-5 w-5" />
          </button>

          <button
            onClick={handleMobileMenuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        links={NAV_LINKS}
      />
    </header>
  );
}
