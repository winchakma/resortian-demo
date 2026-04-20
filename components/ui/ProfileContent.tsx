"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  CalendarDays,
  Settings,
  LogOut,
  HelpCircle,
  MapPin,
  Phone,
  Mail,
  Lock,
  Bell,
  Trash2,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  Banknote,
  ChevronRight,
  Moon,
  Building2,
  Star,
  Shield,
  Smartphone,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import type { UserProfile, Booking, BookingStatus } from "@/types";
import { useAuth } from "@/context/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "profile" | "bookings" | "settings";

interface ProfileContentProps {
  user: UserProfile;
  bookings: Booking[];
}

// ─── Password schema ──────────────────────────────────────────────────────────

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Must be at least 8 characters")
    .matches(/[A-Za-z]/, "Must include at least one letter")
    .matches(/[0-9]/, "Must include at least one number"),
  confirmPassword: yup
    .string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});

type PasswordFormValues = yup.InferType<typeof passwordSchema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function nightsBetween(checkIn: string, checkOut: string) {
  return Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000,
  );
}

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; icon: React.ReactNode; pill: string; dot: string }
> = {
  upcoming: {
    label: "Upcoming",
    icon: <Clock className="h-3.5 w-3.5" />,
    pill: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  completed: {
    label: "Completed",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    pill: "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400",
    dot: "bg-primary-500",
  },
  cancelled: {
    label: "Cancelled",
    icon: <XCircle className="h-3.5 w-3.5" />,
    pill: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    dot: "bg-red-400",
  },
};

// ─── Input helper ─────────────────────────────────────────────────────────────

function inputCls(hasError?: boolean) {
  return [
    "w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors",
    "focus:ring-2 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500"
      : "border-gray-200 focus:border-primary-500 focus:bg-white focus:ring-primary-500/20 dark:border-gray-700 dark:focus:bg-gray-800",
  ].join(" ");
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProfileContent({ user, bookings }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const upcomingCount = bookings.filter((b) => b.status === "upcoming").length;
  const completedCount = bookings.filter(
    (b) => b.status === "completed",
  ).length;
  const cancelledCount = bookings.filter(
    (b) => b.status === "cancelled",
  ).length;
  const totalNights = bookings
    .filter((b) => b.status === "completed")
    .reduce((s, b) => s + b.nights, 0);

  const NAV: {
    id: Tab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    {
      id: "profile",
      label: "My Profile",
      icon: <User className="h-4.5 w-4.5" />,
    },
    {
      id: "bookings",
      label: "My Bookings",
      icon: <CalendarDays className="h-4.5 w-4.5" />,
      badge: upcomingCount || undefined,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-4.5 w-4.5" />,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* ── Sidebar ──────────────────────────────────────────────── */}
        <aside className="w-full shrink-0 lg:w-72">
          {/* User card */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            {/* Cover gradient */}
            <div className="h-20 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400" />

            {/* Avatar + info */}
            <div className="-mt-10 px-5 pb-5">
              <div className="mb-3 flex items-end justify-between">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-primary-700 to-primary-500 shadow-lg dark:border-gray-900">
                  <span className="text-2xl font-bold tracking-tight text-white">
                    {initials(user.name)}
                  </span>
                </div>
                <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-950/40 dark:text-primary-400">
                  <Star className="h-3 w-3 fill-current" />
                  Member
                </span>
              </div>

              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <p className="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>

              {/* Mini stats */}
              <div className="mt-4 grid grid-cols-3 divide-x divide-gray-100 rounded-xl border border-gray-100 bg-gray-50 dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-800/50">
                {[
                  { label: "Bookings", value: bookings.length },
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
            </div>

            {/* Navigation */}
            <nav className="border-t border-gray-100 px-2 py-2 dark:border-gray-800">
              {NAV.map((item) => {
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                    }`}
                  >
                    <span
                      className={
                        active
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-gray-400 dark:text-gray-500"
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

            {/* Bottom actions */}
            <div className="border-t border-gray-100 px-2 py-2 dark:border-gray-800">
              <Link
                href="/help"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <HelpCircle className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                Help & Support
              </Link>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
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
                      ? "bg-primary-600 text-white shadow-sm"
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

          {/* Tab panels */}
          {activeTab === "profile" && (
            <ProfileSection
              user={user}
              totalNights={totalNights}
              bookings={bookings}
            />
          )}
          {activeTab === "bookings" && <BookingsSection bookings={bookings} />}
          {activeTab === "settings" && <SettingsSection />}
        </div>
      </div>
    </div>
  );
}

// ─── Profile section ──────────────────────────────────────────────────────────

function ProfileSection({
  user,
  totalNights,
  bookings,
}: {
  user: UserProfile;
  totalNights: number;
  bookings: Booking[];
}) {
  const completedCount = bookings.filter(
    (b) => b.status === "completed",
  ).length;
  const totalSpend = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((s, b) => s + b.advancePaid, 0);

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: "Total Bookings",
            value: bookings.length,
            icon: (
              <CalendarDays className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            ),
            bg: "bg-primary-50 dark:bg-primary-950/30",
          },
          {
            label: "Trips Completed",
            value: completedCount,
            icon: (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            ),
            bg: "bg-emerald-50 dark:bg-emerald-950/30",
          },
          {
            label: "Total Nights",
            value: totalNights,
            icon: (
              <Moon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            ),
            bg: "bg-violet-50 dark:bg-violet-950/30",
          },
          {
            label: "Advance Paid",
            value: `৳${totalSpend.toLocaleString()}`,
            icon: (
              <CreditCard className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            ),
            bg: "bg-amber-50 dark:bg-amber-950/30",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Personal info card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Personal Information
            </h3>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
              Your account details
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/30">
            <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {[
            {
              icon: <User className="h-4 w-4 text-gray-400" />,
              label: "Full Name",
              value: user.name,
            },
            {
              icon: <Mail className="h-4 w-4 text-gray-400" />,
              label: "Email Address",
              value: user.email,
            },
            {
              icon: <Phone className="h-4 w-4 text-gray-400" />,
              label: "Phone Number",
              value: user.phone,
            },
            {
              icon: <MapPin className="h-4 w-4 text-gray-400" />,
              label: "Address",
              value: user.address,
            },
            {
              icon: <Star className="h-4 w-4 text-gray-400" />,
              label: "Member Since",
              value: fmtDate(user.memberSince),
            },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                {row.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {row.label}
                </p>
                <p className="mt-0.5 truncate text-sm font-medium text-gray-900 dark:text-white">
                  {row.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Membership card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 p-6 shadow-sm">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary-200" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-200">
                Resortian Member
              </span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-white">{user.name}</h3>
            <p className="mt-1 text-sm text-primary-100">
              Member since {fmtDate(user.memberSince)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{bookings.length}</p>
            <p className="text-xs text-primary-200">Total Bookings</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Bookings section ─────────────────────────────────────────────────────────

type StatusFilter = "all" | BookingStatus;

function BookingsSection({ bookings }: { bookings: Booking[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      const matchesQuery =
        !q ||
        b.hotelName.toLowerCase().includes(q) ||
        b.reference.toLowerCase().includes(q) ||
        b.roomName.toLowerCase().includes(q) ||
        b.hotelLocation.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [bookings, query, statusFilter]);

  const statusTabs: { id: StatusFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: bookings.length },
    {
      id: "upcoming",
      label: "Upcoming",
      count: bookings.filter((b) => b.status === "upcoming").length,
    },
    {
      id: "completed",
      label: "Completed",
      count: bookings.filter((b) => b.status === "completed").length,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      count: bookings.filter((b) => b.status === "cancelled").length,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header + search */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              My Bookings
            </h3>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
              {bookings.length} booking{bookings.length !== 1 ? "s" : ""} in
              total
            </p>
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by hotel or reference…"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-8 text-sm text-gray-900 outline-none transition-colors focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex overflow-x-auto border-b border-gray-100 dark:border-gray-800">
          {statusTabs.map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "border-primary-600 text-primary-700 dark:border-primary-400 dark:text-primary-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      active
                        ? "bg-primary-100 text-primary-700 dark:bg-primary-950/50 dark:text-primary-400"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Booking list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <CalendarDays className="h-7 w-7 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              No bookings found
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {query
                ? "Try a different search term."
                : "You have no bookings in this category yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Booking card ─────────────────────────────────────────────────────────────

function BookingCard({ booking }: { booking: Booking }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[booking.status];

  return (
    <div className="px-5 py-4">
      <div className="flex gap-4">
        {/* Hotel image */}
        <div className="relative hidden h-24 w-32 shrink-0 overflow-hidden rounded-xl sm:block">
          <Image
            src={booking.hotelImage}
            alt={booking.hotelName}
            fill
            unoptimized
            className="object-cover"
            sizes="128px"
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Top row */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={`/hotels/${booking.hotelSlug}`}
                className="text-sm font-semibold text-gray-900 transition-colors hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
              >
                {booking.hotelName}
              </Link>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <MapPin className="h-3 w-3" />
                {booking.hotelLocation}
              </div>
            </div>
            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.pill}`}
            >
              {cfg.icon}
              {cfg.label}
            </span>
          </div>

          {/* Room + dates */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {booking.roomName}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {fmtDate(booking.checkIn)} → {fmtDate(booking.checkOut)}
            </span>
            <span className="flex items-center gap-1">
              <Moon className="h-3.5 w-3.5" />
              {booking.nights} night{booking.nights !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Reference + payment summary */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                {booking.reference}
              </span>
              <span className="flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                {booking.paymentMethod === "stripe" ? (
                  <CreditCard className="h-3 w-3" />
                ) : (
                  <Smartphone className="h-3 w-3" />
                )}
                {booking.paymentMethod === "stripe" ? "Card" : "Mobile Banking"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setExpanded((p) => !p)}
              className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400"
            >
              {expanded ? "Hide details" : "View details"}
            </button>
          </div>

          {/* Expanded payment details */}
          {expanded && (
            <div className="mt-3 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800">
                {[
                  {
                    label: "Total",
                    value: `৳${booking.totalPrice.toLocaleString()}`,
                    sub: "Booking value",
                  },
                  {
                    label: "Advance Paid",
                    value: `৳${booking.advancePaid.toLocaleString()}`,
                    sub: "20% online",
                    highlight: true,
                  },
                  {
                    label:
                      booking.status === "completed"
                        ? "Paid at Hotel"
                        : booking.status === "cancelled"
                          ? "Refunded"
                          : "Due at Hotel",
                    value: `৳${booking.balanceDue.toLocaleString()}`,
                    sub:
                      booking.status === "completed"
                        ? "At check-in"
                        : booking.status === "cancelled"
                          ? "7–10 days"
                          : "On arrival",
                  },
                ].map((col) => (
                  <div
                    key={col.label}
                    className={`px-4 py-3 ${col.highlight ? "bg-primary-50/60 dark:bg-primary-950/20" : "bg-gray-50/60 dark:bg-gray-800/30"}`}
                  >
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                      {col.label}
                    </p>
                    <p
                      className={`mt-0.5 text-sm font-bold ${col.highlight ? "text-primary-700 dark:text-primary-400" : "text-gray-800 dark:text-gray-200"}`}
                    >
                      {col.value}
                    </p>
                    <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">
                      {col.sub}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2 dark:border-gray-800">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Booked on {fmtDate(booking.bookedOn)}
                </p>
                {booking.status === "upcoming" && (
                  <Link
                    href={`/hotels/${booking.hotelSlug}`}
                    className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline dark:text-primary-400"
                  >
                    View Hotel
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Settings section ─────────────────────────────────────────────────────────

function SettingsSection() {
  const { token } = useAuth();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [promoNotifs, setPromoNotifs] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: yupResolver(passwordSchema),
    mode: "onTouched",
  });

  async function onPasswordSubmit(data: PasswordFormValues) {
    if (!token) {
      toast.error("Authentication token not found.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          }),
        },
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to update password");
      }

      toast.success(json.message || "Password updated successfully!");
      reset();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    }
  }

  return (
    <div className="space-y-5">
      {/* Change password */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/30">
            <Lock className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Change Password
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Keep your account secure with a strong password
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onPasswordSubmit)}
          noValidate
          className="space-y-4 p-6"
        >
          {/* Current password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type={showCurrent ? "text" : "password"}
                {...register("currentPassword")}
                placeholder="Enter current password"
                className={`${inputCls(!!errors.currentPassword)} pl-10 pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((p) => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* New password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type={showNew ? "text" : "password"}
                  {...register("newPassword")}
                  placeholder="Min. 8 chars, letter + number"
                  className={`${inputCls(!!errors.newPassword)} pl-10 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirm ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Re-enter new password"
                  className={`${inputCls(!!errors.confirmPassword)} pl-10 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 active:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Lock className="h-4 w-4" />
            {isSubmitting ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>

      {/* Notifications */}
      {/* <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/30">
            <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Notification Preferences
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Control how we reach you
            </p>
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {[
            {
              label: "Email Notifications",
              desc: "Booking confirmations, receipts and updates",
              checked: emailNotifs,
              onChange: setEmailNotifs,
            },
            {
              label: "SMS Notifications",
              desc: "Check-in reminders and important alerts",
              checked: smsNotifs,
              onChange: setSmsNotifs,
            },
            {
              label: "Promotions & Offers",
              desc: "Deals, discounts and seasonal offers",
              checked: promoNotifs,
              onChange: setPromoNotifs,
            },
          ].map((pref) => (
            <div
              key={pref.label}
              className="flex items-center justify-between gap-4 px-6 py-4"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {pref.label}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{pref.desc}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={pref.checked}
                onClick={() => pref.onChange((v) => !v)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  pref.checked ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
                    pref.checked ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div> */}

      {/* Danger zone */}
      <div className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm dark:border-red-900/40 dark:bg-gray-900">
        <div className="flex items-center gap-3 border-b border-red-100 bg-red-50 px-6 py-4 dark:border-red-900/30 dark:bg-red-950/20">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/40">
            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-red-700 dark:text-red-400">
              Danger Zone
            </h3>
            <p className="text-xs text-red-500/80 dark:text-red-500/60">
              Irreversible account actions
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Delete Account
            </p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Permanently delete your account and all booking data. This cannot
              be undone.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              toast.error("Please contact support to delete your account.")
            }
            className="shrink-0 rounded-xl border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
