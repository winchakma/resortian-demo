"use client";

import { memo, useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, User, ShoppingCart, ChevronDown, Building2, LogOut } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import type { NavLink } from "@/types";

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Hotels", href: "/hotels" },
  { label: "Destinations", href: "/destinations" },
  // { label: "Deals & Offers", href: "/deals" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// ─── Cart indicator ───────────────────────────────────────────────────────────

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

// ─── Nav links ────────────────────────────────────────────────────────────────

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

// ─── Sign In dropdown ─────────────────────────────────────────────────────────

function SignInDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
      >
        Sign In
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <Link
            href="/auth/customer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950/40">
              <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="font-medium">As Customer</p>
              <p className="text-xs text-gray-400">Book hotels & rooms</p>
            </div>
          </Link>

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          <Link
            href="/auth/vendor"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <Building2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-medium">As Hotel Owner</p>
              <p className="text-xs text-gray-400">Manage your properties</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

// ─── User menu (logged in) ────────────────────────────────────────────────────

function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleLogout() {
    setOpen(false);
    await logout();
    toast.success("Signed out successfully");
    router.push("/");
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="My account"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        {user?.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar}
            alt={user.name}
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <User className="h-5 w-5" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {/* User info */}
          <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {user?.name}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {user?.phone}
            </p>
            {user?.role === "HOTEL_OWNER" && (
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <Building2 className="h-2.5 w-2.5" /> Hotel Owner
              </span>
            )}
          </div>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <User className="h-4 w-4" />
            My Profile
          </Link>

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export function Header() {
  const { user, loading } = useAuth();
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

          {/* Auth area — only render after hydration to avoid mismatch */}
          {!loading && (
            <div className="ml-1">
              {user ? <UserMenu /> : <SignInDropdown />}
            </div>
          )}

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
