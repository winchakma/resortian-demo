"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  CalendarDays,
  Settings,
  HelpCircle,
  ChevronRight,
  Building2,
  Star,
  Store,
} from "lucide-react";
import type { ProfileContentProps, Tab } from "@/types";
import { initials } from "@/utils";
import SignOutButton from "./profile/SignOutButton";
import ProfileSection from "./profile/ProfileSection";
import BookingsSection from "./profile/BookingsSection";
import VendorDashboard from "./profile/vendor/VendorDashboard";
import SettingsSection from "./profile/SettingsSection";

export function ProfileContent({ user, bookings, onProfileUpdate }: ProfileContentProps) {
  const isVendor = user.role === "HOTEL_OWNER";
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const upcomingCount = bookings.filter((b) => b.status === "upcoming").length;
  const completedCount = bookings.filter(
    (b) => b.status === "completed",
  ).length;
  const totalNights = bookings
    .filter((b) => b.status === "completed")
    .reduce((s, b) => s + b.nights, 0);

  const NAV: {
    id: Tab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = isVendor
    ? [
        {
          id: "profile",
          label: "My Profile",
          icon: <User className="h-4 w-4" />,
        },
        {
          id: "hotels",
          label: "My Properties",
          icon: <Building2 className="h-4 w-4" />,
        },
        {
          id: "settings",
          label: "Settings",
          icon: <Settings className="h-4 w-4" />,
        },
      ]
    : [
        {
          id: "profile",
          label: "My Profile",
          icon: <User className="h-4 w-4" />,
        },
        {
          id: "bookings",
          label: "My Bookings",
          icon: <CalendarDays className="h-4 w-4" />,
          badge: upcomingCount || undefined,
        },
        {
          id: "settings",
          label: "Settings",
          icon: <Settings className="h-4 w-4" />,
        },
      ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* ── Sidebar ──────────────────────────────────────────────── */}
        <aside className="w-full shrink-0 lg:w-72">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div
              className={`h-20 ${isVendor ? "bg-gradient-to-br from-violet-700 via-violet-600 to-purple-500" : "bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500"}`}
            />
            <div className="-mt-10 px-5 pb-5">
              <div className="mb-3 flex items-end justify-between">
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white shadow-lg dark:border-gray-900 ${isVendor ? "bg-gradient-to-br from-violet-700 to-violet-500" : "bg-gradient-to-br from-primary-700 to-primary-500"}`}
                >
                  <span className="text-2xl font-bold tracking-tight text-white">
                    {initials(user.name)}
                  </span>
                </div>
                <span
                  className={`mb-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${isVendor ? "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400" : "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400"}`}
                >
                  {isVendor ? (
                    <Store className="h-3 w-3" />
                  ) : (
                    <Star className="h-3 w-3 fill-current" />
                  )}
                  {isVendor ? "Vendor" : "Member"}
                </span>
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <p className="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">
                {user.email || user.phone}
              </p>
              {!isVendor && (
                <div className="mt-4 grid grid-cols-3 divide-x divide-gray-100 rounded-xl border border-gray-100 bg-gray-50 dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-800/50">
                  {[
                    { label: "Trips", value: bookings.length },
                    { label: "Nights", value: totalNights },
                    { label: "Upcoming", value: upcomingCount },
                  ].map((s) => (
                    <div key={s.label} className="py-2.5 text-center">
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        {s.value}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {isVendor && (
                <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 dark:border-violet-900/30 dark:bg-violet-950/20">
                  <p className="text-xs font-semibold text-violet-700 dark:text-violet-400">
                    Property Owner Account
                  </p>
                  <p className="mt-0.5 text-[11px] text-violet-500/80 dark:text-violet-400/60">
                    Manage properties, rooms & destinations
                  </p>
                </div>
              )}
            </div>

            <nav className="border-t border-gray-100 px-2 py-2 dark:border-gray-800">
              {NAV.map((item) => {
                const active = activeTab === item.id;
                const activeClass = isVendor
                  ? "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400"
                  : "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400";
                const activeIcon = isVendor
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-primary-600 dark:text-primary-400";
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${active ? activeClass : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"}`}
                  >
                    <span
                      className={
                        active ? activeIcon : "text-gray-400 dark:text-gray-500"
                      }
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {item.badge ? (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1.5 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    ) : active ? (
                      <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                    ) : null}
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-gray-100 px-2 py-2 dark:border-gray-800">
              <Link
                href="/help"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <HelpCircle className="h-4 w-4 text-gray-400" />
                Help & Support
              </Link>
              <SignOutButton />
            </div>
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────── */}
        <div className="min-w-0 flex-1">
          {/* Mobile tab bar */}
          <div className="mb-5 flex gap-1 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-900 lg:hidden">
            {NAV.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                    active
                      ? isVendor
                        ? "bg-violet-600 text-white shadow-sm"
                        : "bg-primary-600 text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.icon}
                  {item.label}
                  {item.badge ? (
                    <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-primary-600">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {activeTab === "profile" && (
            <ProfileSection
              user={user}
              totalNights={totalNights}
              completedCount={completedCount}
              bookings={bookings}
              isVendor={isVendor}
              onProfileUpdate={onProfileUpdate}
            />
          )}
          {activeTab === "bookings" && !isVendor && (
            <BookingsSection bookings={bookings} />
          )}
          {activeTab === "hotels" && isVendor && <VendorDashboard />}
          {activeTab === "settings" && <SettingsSection isVendor={isVendor} />}
        </div>
      </div>
    </div>
  );
}

// ─── Settings section ─────────────────────────────────────────────────────────
