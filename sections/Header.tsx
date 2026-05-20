"use client";

import { memo, useState, useCallback, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, User, ShoppingCart, Building2, LogOut } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { NotificationBell } from "@/components/ui/NotificationBell";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import type { NavLink } from "@/types";

const NAV_LINKS: NavLink[] = [
  { label: "Hotels & Resorts", href: "/hotels" },
  { label: "Destinations", href: "/destinations" },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// ─── Cart indicator ───────────────────────────────────────────────────────────

const CartIndicator = memo(function CartIndicator() {
  const { totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link
      href="/cart"
      aria-label={`Cart (${totalItems} items)`}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-black/10 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    >
      <ShoppingCart className="h-5 w-5" />
      {mounted && totalItems > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Link>
  );
});

CartIndicator.displayName = "CartIndicator";

// ─── Nav links ────────────────────────────────────────────────────────────────

const navLinkCls =
  "rounded-lg px-3 py-2 text-sm font-medium text-white bg-black/10 transition-colors hover:bg-black/20 dark:text-gray-400 dark:bg-transparent dark:hover:bg-primary-950/30 dark:hover:text-primary-400";

const NavLinks = memo(function NavLinks({
  accountHref,
}: {
  accountHref: string;
}) {
  return (
    <nav className="hidden lg:flex lg:items-center lg:gap-1">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          prefetch={true}
          className={navLinkCls}
        >
          {link.label}
        </Link>
      ))}
      <Link
        href={accountHref}
        prefetch={true}
        className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
      >
        My Account
      </Link>
    </nav>
  );
});

NavLinks.displayName = "NavLinks";

// ─── Sign Up button ───────────────────────────────────────────────────────────

function SignUpButton() {
  return (
    <Link
      href="/auth/customer?tab=register"
      className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
    >
      Sign Up
    </Link>
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
        className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-black/10 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
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
                <Building2 className="h-2.5 w-2.5" /> Property Owner
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
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a stable default during SSR and initial hydration to avoid mismatch
  const accountHref = mounted && user ? "/profile" : "/auth/customer";

  const mobileLinks = useMemo(() => NAV_LINKS, []);

  const handleMobileMenuClose = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleMobileMenuOpen = useCallback(() => {
    setMobileMenuOpen(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[#0AB37A]/30 bg-gradient-to-l from-[#DE6054] to-[#03b57b] backdrop-blur-md dark:border-primary-900/40 dark:bg-gradient-to-b dark:from-gray-950/90 dark:to-gray-900/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <NavLinks accountHref={accountHref} />
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <CartIndicator />
          {mounted && user && <NotificationBell />}

          {/* Auth area — only render after hydration to avoid mismatch */}
          {mounted && !loading && (
            <div className="ml-1">{user ? <UserMenu /> : <SignUpButton />}</div>
          )}

          <button
            onClick={handleMobileMenuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-black/10 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        links={mobileLinks}
      />
    </header>
  );
}
