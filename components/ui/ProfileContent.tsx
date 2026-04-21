"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
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
  Trash2,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  ChevronRight,
  ChevronDown,
  Moon,
  Building2,
  Star,
  Shield,
  Smartphone,
  X,
  Plus,
  Upload,
  BedDouble,
  Store,
  Tag,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Users,
  Maximize2,
  Hash,
  ImageIcon,
  Globe,
  FileText,
  Pencil,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import type { UserProfile, Booking, BookingStatus } from "@/types";
import { useAuth } from "@/context/AuthContext";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "profile" | "bookings" | "hotels" | "settings";
type VendorView = "hotels" | "destinations" | "bookings";
type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

interface VendorRoom {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  view: string;
  size: string;
  amenities: string[];
  images: string[];
  badge: string | null;
  isActive: boolean;
  approvalStatus: ApprovalStatus;
  rejectionReason: string | null;
  createdAt: string;
}

interface VendorHotel {
  id: string;
  name: string;
  slug: string;
  location: string;
  image: string;
  price: number;
  rating: number;
  approvalStatus: ApprovalStatus;
  rejectionReason: string | null;
  isActive: boolean;
  destination: { id: string; name: string; region: string };
  rooms: VendorRoom[];
  _count: { rooms: number; reviews: number };
}

type VendorBookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

interface VendorBooking {
  id: string;
  reference: string;
  userId: string | null;
  guestName: string | null;
  guestPhone: string | null;
  guestEmail: string | null;
  roomId: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  advancePaid: number;
  balanceDue: number;
  status: VendorBookingStatus;
  paymentMethod: "STRIPE" | "UDDOKTAPAY";
  bookedOn: string;
  cancelledAt: string | null;
  cancelReason: string | null;
  user: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    avatar: string | null;
  } | null;
  room: {
    id: string;
    name: string;
    images: string[];
    price: number;
    hotel: {
      id: string;
      name: string;
      slug: string;
      location: string;
    };
  };
  commissionRate: number;
  commissionAmount: number;
  payoutAmount: number;
  payments: {
    id: string;
    amount: number;
    status: string;
    method: string;
    isAdvance: boolean;
    transactionId: string | null;
    paidAt: string | null;
  }[];
  cashoutRequest: {
    id: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
    amount: number;
    createdAt: string;
  } | null;
}

interface BankInfo {
  id: string;
  userId: string;
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  routingNumber: string | null;
  bkashNumber: string | null;
  nagadNumber: string | null;
  rocketNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

interface VendorDestination {
  id: string;
  name: string;
  region: string;
  description: string;
  image: string;
  isFeatured: boolean;
  approvalStatus: ApprovalStatus;
  rejectionReason: string | null;
  _count: { hotels: number };
  createdAt: string;
}

interface ProfileContentProps {
  user: UserProfile;
  bookings: Booking[];
}

// ─── Validation schemas ───────────────────────────────────────────────────────

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

const hotelSchema = yup.object({
  destinationId: yup.string().required("Destination is required"),
  name: yup.string().required("Hotel name is required"),
  slug: yup
    .string()
    .required("Slug is required")
    .matches(/^[a-z0-9-]+$/, "Only lowercase letters, numbers and hyphens"),
  location: yup.string().required("Location is required"),
  description: yup
    .string()
    .required("Description is required")
    .min(20, "At least 20 characters"),
  price: yup
    .number()
    .typeError("Must be a number")
    .required("Price is required")
    .min(1, "Must be positive"),
  tags: yup.string(),
  amenities: yup.string(),
});

type HotelFormValues = {
  destinationId: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  price: number;
  tags?: string;
  amenities?: string;
};

const roomSchema = yup.object({
  hotelId: yup.string().required("Hotel ID is required"),
  name: yup.string().required("Room name is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .typeError("Must be a number")
    .required("Price is required")
    .min(1, "Must be positive"),
  capacity: yup
    .number()
    .typeError("Must be a number")
    .required("Capacity is required")
    .min(1)
    .max(20),
  view: yup.string().required("View type is required"),
  size: yup.string().required("Size is required"),
  amenities: yup.string().required("Amenities are required"),
  badge: yup.string(),
});

type RoomFormValues = {
  hotelId: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  view: string;
  size: string;
  amenities: string;
  badge?: string;
};

const updateHotelSchema = yup.object({
  name: yup.string().required("Hotel name is required"),
  slug: yup
    .string()
    .required("Slug is required")
    .matches(/^[a-z0-9-]+$/, "Only lowercase letters, numbers and hyphens"),
  location: yup.string().required("Location is required"),
  description: yup
    .string()
    .required("Description is required")
    .min(20, "At least 20 characters"),
  price: yup
    .number()
    .typeError("Must be a number")
    .required("Price is required")
    .min(1, "Must be positive"),
  tags: yup.string(),
  amenities: yup.string(),
  isActive: yup.boolean(),
});

type UpdateHotelFormValues = {
  name: string;
  slug: string;
  location: string;
  description: string;
  price: number;
  tags?: string;
  amenities?: string;
  isActive?: boolean;
};

const updateRoomSchema = yup.object({
  name: yup.string().required("Room name is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .typeError("Must be a number")
    .required("Price is required")
    .min(1, "Must be positive"),
  capacity: yup
    .number()
    .typeError("Must be a number")
    .required("Capacity is required")
    .min(1)
    .max(20),
  view: yup.string().required("View type is required"),
  size: yup.string().required("Size is required"),
  amenities: yup.string().required("Amenities are required"),
  badge: yup.string(),
  isActive: yup.boolean(),
});

type UpdateRoomFormValues = {
  name: string;
  description: string;
  price: number;
  capacity: number;
  view: string;
  size: string;
  amenities: string;
  badge?: string;
  isActive?: boolean;
};

const destinationSchema = yup.object({
  name: yup.string().required("Destination name is required"),
  region: yup.string().required("Region is required"),
  description: yup
    .string()
    .required("Description is required")
    .min(20, "At least 20 characters"),
  highlights: yup.string(),
});

type DestinationFormValues = {
  name: string;
  region: string;
  description: string;
  highlights?: string;
};

const bankInfoSchema = yup.object({
  bankName: yup.string().default(""),
  accountName: yup.string().default(""),
  accountNumber: yup.string().default(""),
  routingNumber: yup.string().default(""),
  bkashNumber: yup.string().default(""),
  nagadNumber: yup.string().default(""),
  rocketNumber: yup.string().default(""),
});

type BankInfoFormValues = yup.InferType<typeof bankInfoSchema>;

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

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; icon: React.ReactNode; pill: string }
> = {
  upcoming: {
    label: "Upcoming",
    icon: <Clock className="h-3.5 w-3.5" />,
    pill: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  },
  completed: {
    label: "Completed",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    pill: "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400",
  },
  cancelled: {
    label: "Cancelled",
    icon: <XCircle className="h-3.5 w-3.5" />,
    pill: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
  },
};

const APPROVAL_CONFIG: Record<
  ApprovalStatus,
  { label: string; pill: string; dot: string }
> = {
  APPROVED: {
    label: "Approved",
    pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  PENDING: {
    label: "Under Review",
    pill: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
    dot: "bg-amber-400",
  },
  REJECTED: {
    label: "Rejected",
    pill: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    dot: "bg-red-400",
  },
};

function inputCls(hasError?: boolean) {
  return [
    "w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors",
    "focus:ring-2 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500"
      : "border-gray-200 focus:border-primary-500 focus:bg-white focus:ring-primary-500/20 dark:border-gray-700 dark:focus:bg-gray-800",
  ].join(" ");
}

function labelCls() {
  return "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-500">{msg}</p>;
}

function ApprovalBadge({
  status,
  sm,
}: {
  status: ApprovalStatus;
  sm?: boolean;
}) {
  const cfg = APPROVAL_CONFIG[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold ${sm ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"} ${cfg.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProfileContent({ user, bookings }: ProfileContentProps) {
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
                    Hotel Owner Account
                  </p>
                  <p className="mt-0.5 text-[11px] text-violet-500/80 dark:text-violet-400/60">
                    Manage hotels, rooms & destinations
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

// ─── Sign-out ─────────────────────────────────────────────────────────────────

function SignOutButton() {
  const { logout } = useAuth();
  return (
    <button
      type="button"
      onClick={() => logout()}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </button>
  );
}

// ─── Profile section ──────────────────────────────────────────────────────────

function ProfileSection({
  user,
  totalNights,
  completedCount,
  bookings,
  isVendor,
}: {
  user: UserProfile;
  totalNights: number;
  completedCount: number;
  bookings: Booking[];
  isVendor: boolean;
}) {
  const totalSpend = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((s, b) => s + b.advancePaid, 0);

  return (
    <div className="space-y-5">
      {!isVendor && (
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
      )}

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
              value: user.email || "—",
            },
            {
              icon: <Phone className="h-4 w-4 text-gray-400" />,
              label: "Phone Number",
              value: user.phone,
            },
            {
              icon: <MapPin className="h-4 w-4 text-gray-400" />,
              label: "Address",
              value: user.address || "—",
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

      {isVendor ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-violet-600 to-purple-500 p-6 shadow-sm">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-violet-200" />
                <span className="text-xs font-semibold uppercase tracking-widest text-violet-200">
                  Resortian Vendor
                </span>
              </div>
              <h3 className="mt-2 text-2xl font-bold text-white">
                {user.name}
              </h3>
              <p className="mt-1 text-sm text-violet-100">
                Partner since {fmtDate(user.memberSince)}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <Shield className="h-8 w-8 text-violet-300" />
              <p className="mt-1 text-xs text-violet-200">Hotel Owner</p>
            </div>
          </div>
        </div>
      ) : (
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
              <h3 className="mt-2 text-2xl font-bold text-white">
                {user.name}
              </h3>
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
      )}
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

function BookingCard({ booking }: { booking: Booking }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[booking.status];

  return (
    <div className="px-5 py-4">
      <div className="flex gap-4">
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
        <div className="min-w-0 flex-1">
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
                    View Hotel <ChevronRight className="h-3 w-3" />
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

// ─── Vendor dashboard ─────────────────────────────────────────────────────────

type VendorModal =
  | null
  | "create-hotel"
  | "create-destination"
  | { type: "add-room"; hotelId: string; hotelName: string }
  | { type: "edit-hotel"; hotel: VendorHotel }
  | { type: "edit-room"; room: VendorRoom; hotelName: string };

type ConfirmState =
  | null
  | { type: "delete-hotel"; id: string; name: string }
  | { type: "delete-room"; id: string; name: string };

function VendorDashboard() {
  const [view, setView] = useState<VendorView>("hotels");

  return (
    <div className="space-y-5">
      {/* Sub-tab switcher */}
      <div className="flex gap-1 rounded-2xl border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {(
          [
            {
              id: "hotels" as VendorView,
              label: "Hotels & Rooms",
              icon: <Building2 className="h-4 w-4" />,
            },
            {
              id: "destinations" as VendorView,
              label: "Destinations",
              icon: <Globe className="h-4 w-4" />,
            },
            {
              id: "bookings" as VendorView,
              label: "Bookings",
              icon: <CalendarDays className="h-4 w-4" />,
            },
          ] as const
        ).map((tab) => {
          const active = view === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setView(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {view === "hotels" && <VendorHotelsList />}
      {view === "destinations" && <VendorDestinationsList />}
      {view === "bookings" && <VendorBookingsList />}
    </div>
  );
}

// ─── Vendor hotels list ───────────────────────────────────────────────────────

function VendorHotelsList() {
  const { token } = useAuth();
  const [hotels, setHotels] = useState<VendorHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<VendorModal>(null);
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function handleDeleteHotel(id: string) {
    setDeleteLoading(true);
    try {
      const res = await fetch(`${BASE}/hotels/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to delete hotel");
      }
      toast.success("Hotel deleted successfully.");
      setConfirm(null);
      loadHotels();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleDeleteRoom(id: string) {
    setDeleteLoading(true);
    try {
      const res = await fetch(`${BASE}/rooms/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to delete room");
      }
      toast.success("Room deleted successfully.");
      setConfirm(null);
      loadHotels();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setDeleteLoading(false);
    }
  }

  const loadHotels = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/hotels/mine?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setHotels(json.data ?? []);
    } catch {
      toast.error("Failed to load your hotels.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadHotels();
  }, [loadHotels]);

  const totalApproved = hotels.filter(
    (h) => h.approvalStatus === "APPROVED",
  ).length;
  const totalPending = hotels.filter(
    (h) => h.approvalStatus === "PENDING",
  ).length;
  const totalRooms = hotels.reduce((s, h) => s + h._count.rooms, 0);

  return (
    <>
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Total Hotels",
              value: hotels.length,
              icon: (
                <Building2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              ),
              bg: "bg-violet-50 dark:bg-violet-950/30",
            },
            {
              label: "Approved",
              value: totalApproved,
              icon: (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              ),
              bg: "bg-emerald-50 dark:bg-emerald-950/30",
            },
            {
              label: "Under Review",
              value: totalPending,
              icon: (
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              ),
              bg: "bg-amber-50 dark:bg-amber-950/30",
            },
            {
              label: "Total Rooms",
              value: totalRooms,
              icon: (
                <BedDouble className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              ),
              bg: "bg-primary-50 dark:bg-primary-950/30",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}
              >
                {s.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {s.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              My Hotels
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {loading
                ? "Loading…"
                : `${hotels.length} hotel${hotels.length !== 1 ? "s" : ""} in your portfolio`}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadHotels}
              disabled={loading}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
              title="Refresh"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            {hotels.length === 0 && (
              <button
                type="button"
                onClick={() => setModal("create-hotel")}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700 active:bg-violet-800"
              >
                <Plus className="h-4 w-4" />
                New Hotel
              </button>
            )}
          </div>
        </div>

        {/* Approval notice */}
        {totalPending > 0 && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/30 dark:bg-amber-950/20">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              {totalPending} hotel{totalPending !== 1 ? "s are" : " is"} under
              review. Hotels and rooms go live once approved by our team.
            </p>
          </div>
        )}

        {/* Hotel list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
          </div>
        ) : hotels.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-950/30">
              <Building2 className="h-8 w-8 text-violet-400" />
            </div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">
              No hotels yet
            </p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
              Create your first hotel to get started
            </p>
            <button
              type="button"
              onClick={() => setModal("create-hotel")}
              className="mt-5 flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
            >
              <Plus className="h-4 w-4" />
              Create Hotel
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                expanded={expandedId === hotel.id}
                onToggle={() =>
                  setExpandedId((p) => (p === hotel.id ? null : hotel.id))
                }
                onAddRoom={() =>
                  setModal({
                    type: "add-room",
                    hotelId: hotel.id,
                    hotelName: hotel.name,
                  })
                }
                onEdit={() => setModal({ type: "edit-hotel", hotel })}
                onDelete={() =>
                  setConfirm({
                    type: "delete-hotel",
                    id: hotel.id,
                    name: hotel.name,
                  })
                }
                onEditRoom={(room) => {
                  setModal({ type: "edit-room", room, hotelName: hotel.name });
                }}
                onDeleteRoom={(room) =>
                  setConfirm({
                    type: "delete-room",
                    id: room.id,
                    name: room.name,
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {modal === "create-hotel" && (
        <FormModal title="Create New Hotel" onClose={() => setModal(null)}>
          <CreateHotelForm
            onCreated={(hotelId, hotelName) => {
              setModal(null);
              loadHotels();
              toast.success("Hotel submitted for approval!");
              setTimeout(
                () => setModal({ type: "add-room", hotelId, hotelName }),
                400,
              );
            }}
          />
        </FormModal>
      )}
      {modal && typeof modal === "object" && modal.type === "add-room" && (
        <FormModal
          title={`Add Room — ${modal.hotelName}`}
          onClose={() => setModal(null)}
        >
          <CreateRoomForm
            hotelId={modal.hotelId}
            hotelName={modal.hotelName}
            onCreated={() => {
              loadHotels();
              toast.success("Room submitted for approval!");
            }}
          />
        </FormModal>
      )}
      {modal && typeof modal === "object" && modal.type === "edit-hotel" && (
        <FormModal
          title={`Edit Hotel — ${modal.hotel.name}`}
          onClose={() => setModal(null)}
        >
          <EditHotelForm
            hotel={modal.hotel}
            onUpdated={() => {
              setModal(null);
              loadHotels();
              toast.success("Hotel updated successfully!");
            }}
          />
        </FormModal>
      )}
      {modal && typeof modal === "object" && modal.type === "edit-room" && (
        <FormModal
          title={`Edit Room — ${modal.room.name}`}
          onClose={() => setModal(null)}
        >
          <EditRoomForm
            room={modal.room}
            hotelName={modal.hotelName}
            onUpdated={() => {
              setModal(null);
              loadHotels();
              toast.success("Room updated successfully!");
            }}
          />
        </FormModal>
      )}
      {confirm && (
        <ConfirmModal
          title={
            confirm.type === "delete-hotel" ? "Delete Hotel" : "Delete Room"
          }
          message={
            confirm.type === "delete-hotel"
              ? `Are you sure you want to delete "${confirm.name}"? This will permanently remove all its rooms and data.`
              : `Are you sure you want to delete room "${confirm.name}"? This cannot be undone.`
          }
          loading={deleteLoading}
          onClose={() => setConfirm(null)}
          onConfirm={() => {
            if (confirm.type === "delete-hotel") handleDeleteHotel(confirm.id);
            else handleDeleteRoom(confirm.id);
          }}
        />
      )}
    </>
  );
}

// ─── Vendor bookings list ─────────────────────────────────────────────────────

const VENDOR_BOOKING_STATUS_CONFIG: Record<
  VendorBookingStatus,
  { label: string; pill: string; dot: string }
> = {
  CONFIRMED: {
    label: "Confirmed",
    pill: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  PENDING: {
    label: "Pending",
    pill: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
    dot: "bg-amber-400",
  },
  COMPLETED: {
    label: "Completed",
    pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Cancelled",
    pill: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    dot: "bg-red-400",
  },
};

type VendorBookingStatusFilter = "all" | VendorBookingStatus;

function VendorBookingsList() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<VendorBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] =
    useState<VendorBookingStatusFilter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasBankInfo, setHasBankInfo] = useState(false);

  const loadBookings = useCallback(
    async (p = 1, status: VendorBookingStatusFilter = "all", q = "") => {
      if (!token) return;
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(p), limit: "10" });
        if (status !== "all") params.set("status", status);
        if (q.trim()) {
          params.set("search", q.trim());
          params.set("searchField", "reference");
        }
        const res = await fetch(`${BASE}/bookings/mine?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const json = await res.json();
        setBookings(json.data ?? []);
        setTotal(json.meta?.total ?? 0);
        setTotalPages(json.meta?.totalPages ?? 1);
      } catch {
        toast.error("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/users/me/bank-info`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => {
        const info: BankInfo | null = json ?? null;
        if (info) {
          setHasBankInfo(
            !!(
              info.accountNumber ||
              info.bkashNumber ||
              info.nagadNumber ||
              info.rocketNumber
            ),
          );
        }
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    loadBookings(1, statusFilter, query);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    loadBookings(1, statusFilter, query);
  }

  function goToPage(p: number) {
    setPage(p);
    loadBookings(p, statusFilter, query);
  }

  const statusTabs: { id: VendorBookingStatusFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "CONFIRMED", label: "Confirmed" },
    { id: "PENDING", label: "Pending" },
    { id: "COMPLETED", label: "Completed" },
    { id: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Guest Bookings
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {loading
              ? "Loading…"
              : `${total} booking${total !== 1 ? "s" : ""} across your hotels`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadBookings(page, statusFilter, query)}
          disabled={loading}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          title="Refresh"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {/* Search */}
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by booking reference…"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-8 text-sm text-gray-900 outline-none transition-colors focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setPage(1);
                  loadBookings(1, statusFilter, "");
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Status tabs */}
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
                    ? "border-violet-600 text-violet-700 dark:border-violet-400 dark:text-violet-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <CalendarDays className="h-7 w-7 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              No bookings found
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {query
                ? "Try a different reference."
                : "No bookings in this category yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {bookings.map((b) => (
              <VendorBookingRow
                key={b.id}
                booking={b}
                hasBankInfo={hasBankInfo}
                onCashoutRequested={() =>
                  loadBookings(page, statusFilter, query)
                }
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 dark:border-gray-800">
            <p className="text-xs text-gray-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1 || loading}
                className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages || loading}
                className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function VendorBookingRow({
  booking,
  hasBankInfo,
  onCashoutRequested,
}: {
  booking: VendorBooking;
  hasBankInfo: boolean;
  onCashoutRequested: () => void;
}) {
  const { token } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [cashoutLoading, setCashoutLoading] = useState(false);
  const cfg = VENDOR_BOOKING_STATUS_CONFIG[booking.status];
  const guestName = booking.user?.name ?? booking.guestName ?? "Guest";

  async function handleRequestCashout() {
    if (!token) return;
    setCashoutLoading(true);
    try {
      const res = await fetch(`${BASE}/cashout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId: booking.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to request cashout");
      toast.success("Cashout request submitted!");
      onCashoutRequested();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not request cashout.",
      );
    } finally {
      setCashoutLoading(false);
    }
  }
  const guestPhone = booking.user?.phone ?? booking.guestPhone ?? "—";

  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {booking.room.hotel.name}
              </p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {booking.room.name}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.pill}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
              {booking.cashoutRequest && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    booking.cashoutRequest.status === "PAID"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                      : booking.cashoutRequest.status === "APPROVED"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                        : booking.cashoutRequest.status === "REJECTED"
                          ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                  }`}
                >
                  <CreditCard className="h-3 w-3" />
                  {booking.cashoutRequest.status === "PAID"
                    ? "Paid out"
                    : booking.cashoutRequest.status === "APPROVED"
                      ? "Cashout approved"
                      : booking.cashoutRequest.status === "REJECTED"
                        ? "Cashout rejected"
                        : "Cashout pending"}
                </span>
              )}
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {fmtDate(booking.checkIn)} → {fmtDate(booking.checkOut)}
            </span>
            <span className="flex items-center gap-1">
              <Moon className="h-3.5 w-3.5" />
              {booking.nights} night{booking.nights !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {booking.guests} guest{booking.guests !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              {booking.reference}
            </span>
            <span className="flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              <User className="h-3 w-3" />
              {guestName}
            </span>
            <span className="flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              <Phone className="h-3 w-3" />
              {guestPhone}
            </span>
            <button
              type="button"
              onClick={() => setExpanded((p) => !p)}
              className="text-xs font-medium text-violet-600 hover:underline dark:text-violet-400"
            >
              {expanded ? "Hide details" : "View details"}
            </button>
          </div>

          {expanded && (
            <div className="mt-3 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
              {/* Booking financials */}
              <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800">
                {[
                  {
                    label: "Total",
                    value: `৳${booking.totalPrice.toLocaleString()}`,
                    sub: "Booking value",
                    highlight: false,
                  },
                  {
                    label: "Advance Paid",
                    value: `৳${booking.advancePaid.toLocaleString()}`,
                    sub: "20% online",
                    highlight: true,
                  },
                  {
                    label:
                      booking.status === "COMPLETED"
                        ? "Paid at Hotel"
                        : booking.status === "CANCELLED"
                          ? "Refunded"
                          : "Due at Hotel",
                    value: `৳${booking.balanceDue.toLocaleString()}`,
                    sub:
                      booking.status === "COMPLETED"
                        ? "At check-in"
                        : booking.status === "CANCELLED"
                          ? "7–10 days"
                          : "On arrival",
                    highlight: false,
                  },
                ].map((col) => (
                  <div
                    key={col.label}
                    className={`px-4 py-3 ${col.highlight ? "bg-violet-50/60 dark:bg-violet-950/20" : "bg-gray-50/60 dark:bg-gray-800/30"}`}
                  >
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                      {col.label}
                    </p>
                    <p
                      className={`mt-0.5 text-sm font-bold ${col.highlight ? "text-violet-700 dark:text-violet-400" : "text-gray-800 dark:text-gray-200"}`}
                    >
                      {col.value}
                    </p>
                    <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">
                      {col.sub}
                    </p>
                  </div>
                ))}
              </div>

              {/* Commission breakdown */}
              <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100 dark:divide-gray-800 dark:border-gray-800">
                <div className="bg-gray-50/40 px-4 py-3 dark:bg-gray-800/20">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    Commission Rate
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-gray-700 dark:text-gray-300">
                    {booking.commissionRate}%
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">
                    Platform fee
                  </p>
                </div>
                <div className="bg-red-50/40 px-4 py-3 dark:bg-red-950/10">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    Platform Fee
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-red-600 dark:text-red-400">
                    ৳{booking.commissionAmount.toLocaleString()}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">
                    Deducted
                  </p>
                </div>
                <div className="bg-emerald-50/60 px-4 py-3 dark:bg-emerald-950/20">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    Your Payout
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    ৳{booking.payoutAmount.toLocaleString()}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">
                    {booking.cashoutRequest
                      ? booking.cashoutRequest.status === "PAID"
                        ? "Paid out"
                        : booking.cashoutRequest.status === "APPROVED"
                          ? "Approved"
                          : booking.cashoutRequest.status === "REJECTED"
                            ? "Request rejected"
                            : "Cashout pending"
                      : "Cashout available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2 dark:border-gray-800">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Booked on {fmtDate(booking.bookedOn)}
                </p>
                <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                  {booking.paymentMethod === "STRIPE" ? (
                    <CreditCard className="h-3 w-3" />
                  ) : (
                    <Smartphone className="h-3 w-3" />
                  )}
                  {booking.paymentMethod === "STRIPE"
                    ? "Card"
                    : "Mobile Banking"}
                </span>
              </div>

              {/* Cashout action */}
              {/* {booking.status === "CONFIRMED" && !booking.cashoutRequest && ( */}
              {!booking.cashoutRequest && (
                <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
                  {hasBankInfo ? (
                    <button
                      type="button"
                      onClick={handleRequestCashout}
                      disabled={cashoutLoading}
                      className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {cashoutLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CreditCard className="h-4 w-4" />
                      )}
                      {cashoutLoading ? "Requesting…" : "Request Cashout"}
                    </button>
                  ) : (
                    <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-800/40 dark:bg-amber-950/20">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        Add your bank or mobile banking info in{" "}
                        <span className="font-semibold">
                          Settings → Bank & Payment Info
                        </span>{" "}
                        before requesting a cashout.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Vendor destinations list ─────────────────────────────────────────────────

function VendorDestinationsList() {
  const { token } = useAuth();
  const [destinations, setDestinations] = useState<VendorDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadDestinations = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/destinations/mine?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setDestinations(json.data ?? []);
    } catch {
      toast.error("Failed to load your destinations.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

  const totalApproved = destinations.filter(
    (d) => d.approvalStatus === "APPROVED",
  ).length;
  const totalPending = destinations.filter(
    (d) => d.approvalStatus === "PENDING",
  ).length;
  const totalHotels = destinations.reduce((s, d) => s + d._count.hotels, 0);

  return (
    <>
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Destinations",
              value: destinations.length,
              icon: (
                <Globe className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              ),
              bg: "bg-violet-50 dark:bg-violet-950/30",
            },
            {
              label: "Approved",
              value: totalApproved,
              icon: (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              ),
              bg: "bg-emerald-50 dark:bg-emerald-950/30",
            },
            {
              label: "Hotels Listed",
              value: totalHotels,
              icon: (
                <Building2 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              ),
              bg: "bg-primary-50 dark:bg-primary-950/30",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}
              >
                {s.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {s.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              My Destinations
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {loading
                ? "Loading…"
                : `${destinations.length} destination${destinations.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadDestinations}
              disabled={loading}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
              title="Refresh"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700 active:bg-violet-800"
            >
              <Plus className="h-4 w-4" />
              New Destination
            </button>
          </div>
        </div>

        {/* Pending notice */}
        {totalPending > 0 && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/30 dark:bg-amber-950/20">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              {totalPending} destination{totalPending !== 1 ? "s are" : " is"}{" "}
              awaiting review. Once approved, they&apos;ll appear in your hotel
              creation form.
            </p>
          </div>
        )}

        {/* Info note */}
        <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 dark:border-blue-900/30 dark:bg-blue-950/20">
          <Globe className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <p className="text-xs text-blue-700 dark:text-blue-400">
            Approved destinations will appear in the hotel creation form when
            you add a new hotel.
          </p>
        </div>

        {/* Destination list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
          </div>
        ) : destinations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-950/30">
              <Globe className="h-8 w-8 text-violet-400" />
            </div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">
              No destinations yet
            </p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
              Add a destination to group your hotels by location
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="mt-5 flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
            >
              <Plus className="h-4 w-4" />
              Create Destination
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {destinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <FormModal
          title="Create New Destination"
          onClose={() => setShowCreateModal(false)}
        >
          <CreateDestinationForm
            onCreated={() => {
              setShowCreateModal(false);
              loadDestinations();
              toast.success("Destination submitted for approval!");
            }}
          />
        </FormModal>
      )}
    </>
  );
}

// ─── Destination card ─────────────────────────────────────────────────────────

function DestinationCard({ destination }: { destination: VendorDestination }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
      <div className="flex gap-4 p-5">
        {/* Image */}
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
          {destination.image ? (
            <Image
              src={`${BASE}${destination.image}`}
              alt={destination.name}
              fill
              unoptimized
              className="object-cover"
              sizes="128px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Globe className="h-8 w-8 text-gray-300" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {destination.name}
              </h4>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <MapPin className="h-3 w-3 shrink-0" />
                {destination.region}
              </div>
            </div>
            <ApprovalBadge status={destination.approvalStatus} />
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {destination._count.hotels} hotel
              {destination._count.hotels !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              Added {fmtDate(destination.createdAt)}
            </span>
          </div>

          {destination.approvalStatus === "REJECTED" &&
            destination.rejectionReason && (
              <div className="mt-2.5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 dark:border-red-900/30 dark:bg-red-950/20">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                <p className="text-xs text-red-600 dark:text-red-400">
                  {destination.rejectionReason}
                </p>
              </div>
            )}

          {destination.description && (
            <p className="mt-2 line-clamp-2 text-xs text-gray-400 dark:text-gray-500">
              {destination.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Hotel card ───────────────────────────────────────────────────────────────

function HotelCard({
  hotel,
  expanded,
  onToggle,
  onAddRoom,
  onEdit,
  onDelete,
  onEditRoom,
  onDeleteRoom,
}: {
  hotel: VendorHotel;
  expanded: boolean;
  onToggle: () => void;
  onAddRoom: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onEditRoom: (room: VendorRoom) => void;
  onDeleteRoom: (room: VendorRoom) => void;
}) {
  console.log({ hotel });
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
      {/* Hotel header */}
      <div className="flex gap-4 p-5">
        {/* Image */}
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
          {hotel.image ? (
            <Image
              src={`${BASE}${hotel.image}`}
              alt={hotel.name}
              fill
              unoptimized
              className="object-cover"
              sizes="128px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-8 w-8 text-gray-300" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {hotel.name}
              </h4>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <MapPin className="h-3 w-3 shrink-0" />
                {hotel.location}
                {hotel.destination && (
                  <span className="text-gray-300 dark:text-gray-600">·</span>
                )}
                {hotel.destination?.name}
              </div>
            </div>
            <ApprovalBadge status={hotel.approvalStatus} />
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              ৳{hotel.price.toLocaleString()}/night
            </span>
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />
              {hotel._count.rooms} room{hotel._count.rooms !== 1 ? "s" : ""}
            </span>
            {hotel.approvalStatus === "APPROVED" && (
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5" />
                {hotel.rating > 0 ? hotel.rating.toFixed(1) : "No reviews"}
              </span>
            )}
          </div>

          {hotel.approvalStatus === "REJECTED" && hotel.rejectionReason && (
            <div className="mt-2.5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 dark:border-red-900/30 dark:bg-red-950/20">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
              <p className="text-xs text-red-600 dark:text-red-400">
                {hotel.rejectionReason}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 dark:border-gray-800">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
          {expanded ? "Hide" : "Show"} Rooms
          <span className="ml-0.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            {hotel._count.rooms}
          </span>
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
          <button
            type="button"
            onClick={onAddRoom}
            className="flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-400 dark:hover:bg-violet-950/50"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Room
          </button>
        </div>
      </div>

      {/* Rooms list */}
      {expanded && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          {hotel.rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <BedDouble className="mb-2 h-8 w-8 text-gray-200 dark:text-gray-700" />
              <p className="text-sm text-gray-400 dark:text-gray-500">
                No rooms added yet
              </p>
              <button
                type="button"
                onClick={onAddRoom}
                className="mt-3 text-xs font-medium text-violet-600 hover:underline dark:text-violet-400"
              >
                + Add your first room
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {hotel.rooms.map((room) => (
                <RoomRow
                  key={room.id}
                  room={room}
                  onEdit={() => onEditRoom(room)}
                  onDelete={() => onDeleteRoom(room)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Room row ─────────────────────────────────────────────────────────────────

function RoomRow({
  room,
  onEdit,
  onDelete,
}: {
  room: VendorRoom;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-start gap-4 px-5 py-4">
      {/* Thumbnail */}
      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        {room.images?.[0] ? (
          <Image
            src={`${BASE}${room.images[0]}`}
            alt={room.name}
            fill
            unoptimized
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BedDouble className="h-5 w-5 text-gray-300" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {room.name}
            </p>
            {room.badge && (
              <span className="rounded-md bg-primary-50 px-1.5 py-0.5 text-[10px] font-semibold text-primary-700 dark:bg-primary-950/30 dark:text-primary-400">
                {room.badge}
              </span>
            )}
          </div>
          <ApprovalBadge status={room.approvalStatus} sm />
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-400 dark:text-gray-500">
          <span>৳{room.price.toLocaleString()}/night</span>
          <span>
            {room.capacity} guest{room.capacity !== 1 ? "s" : ""}
          </span>
          <span>{room.view}</span>
          <span>{room.size}</span>
        </div>

        {room.approvalStatus === "REJECTED" && room.rejectionReason && (
          <div className="mt-1.5 flex items-start gap-1.5">
            <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-red-400" />
            <p className="text-[11px] text-red-500 dark:text-red-400">
              {room.rejectionReason}
            </p>
          </div>
        )}

        {/* Room actions */}
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Confirm modal ────────────────────────────────────────────────────────────

function ConfirmModal({
  title,
  message,
  onConfirm,
  onClose,
  loading,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
        <div className="p-6">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/40">
            <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>
        </div>
        <div className="flex gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Form modal ───────────────────────────────────────────────────────────────

function FormModal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative z-10 flex max-h-[95dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-gray-900 sm:rounded-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Scrollable body */}
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Create hotel form ────────────────────────────────────────────────────────

function CreateHotelForm({
  onCreated,
}: {
  onCreated: (hotelId: string, hotelName: string) => void;
}) {
  const { token } = useAuth();
  const [destinations, setDestinations] = useState<
    { id: string; name: string }[]
  >([]);
  const imageRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HotelFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(hotelSchema) as any,
    mode: "onTouched",
  });

  const nameValue = watch("name");

  useEffect(() => {
    if (nameValue) {
      const slug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", slug, { shouldValidate: false });
    }
  }, [nameValue, setValue]);

  // Load only the vendor's own approved destinations
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/destinations/mine?limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        const approved = (d.data ?? []).filter(
          (dest: VendorDestination) => dest.approvalStatus === "APPROVED",
        );
        setDestinations(approved);
      })
      .catch(() => {});
  }, [token]);

  async function onSubmit(data: HotelFormValues) {
    const file = imageRef.current?.files?.[0];
    if (!file) {
      setImageError("Please select a hotel cover image");
      return;
    }

    const fd = new FormData();
    fd.append("destinationId", data.destinationId);
    fd.append("name", data.name);
    fd.append("slug", data.slug);
    fd.append("location", data.location);
    fd.append("description", data.description);
    fd.append("price", String(data.price));
    data.tags
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((t) => fd.append("tags", t));
    data.amenities
      ?.split(",")
      .map((a) => a.trim())
      .filter(Boolean)
      .forEach((a) => fd.append("amenities", a));
    fd.append("image", file);

    try {
      const res = await fetch(`${BASE}/hotels`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to create hotel");
      reset();
      if (imageRef.current) imageRef.current.value = "";
      setImagePreview(null);
      onCreated(json.id, data.name);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit as never)}
      noValidate
      className="space-y-5"
    >
      {/* Destination */}
      <div>
        <label className={labelCls()}>Destination</label>
        {destinations.length === 0 ? (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/30 dark:bg-amber-950/20">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              No approved destinations yet. Go to the Destinations tab to create
              one first.
            </p>
          </div>
        ) : (
          <>
            <select
              {...register("destinationId")}
              className={inputCls(!!errors.destinationId)}
            >
              <option value="">Select a destination…</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <FieldError msg={errors.destinationId?.message} />
          </>
        )}
      </div>

      {/* Name + Slug */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>Hotel Name</label>
          <input
            type="text"
            {...register("name")}
            placeholder="Sea Pearl Beach Resort"
            className={inputCls(!!errors.name)}
          />
          <FieldError msg={errors.name?.message} />
        </div>
        <div>
          <label className={labelCls()}>
            URL Slug{" "}
            <span className="font-normal text-gray-400">(auto-generated)</span>
          </label>
          <input
            type="text"
            {...register("slug")}
            placeholder="sea-pearl-beach-resort"
            className={inputCls(!!errors.slug)}
          />
          <FieldError msg={errors.slug?.message} />
        </div>
      </div>

      {/* Location + Price */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Location
            </span>
          </label>
          <input
            type="text"
            {...register("location")}
            placeholder="Cox's Bazar"
            className={inputCls(!!errors.location)}
          />
          <FieldError msg={errors.location?.message} />
        </div>
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              Price per Night (৳)
            </span>
          </label>
          <input
            type="number"
            {...register("price")}
            placeholder="5000"
            min={1}
            className={inputCls(!!errors.price)}
          />
          <FieldError msg={errors.price?.message} />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelCls()}>Description</label>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="Describe your hotel — location, ambiance, what makes it special…"
          className={inputCls(!!errors.description)}
        />
        <FieldError msg={errors.description?.message} />
      </div>

      {/* Tags + Amenities */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" /> Tags{" "}
              <span className="font-normal text-gray-400">
                (comma-separated)
              </span>
            </span>
          </label>
          <input
            type="text"
            {...register("tags")}
            placeholder="beachfront, luxury, family"
            className={inputCls()}
          />
        </div>
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Amenities{" "}
              <span className="font-normal text-gray-400">
                (comma-separated)
              </span>
            </span>
          </label>
          <input
            type="text"
            {...register("amenities")}
            placeholder="WiFi, Pool, Spa, Parking"
            className={inputCls()}
          />
        </div>
      </div>

      {/* Image */}
      <div>
        <label className={labelCls()}>
          <span className="flex items-center gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Cover Image
          </span>
        </label>
        <div
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 transition-colors ${imageError ? "border-red-400 bg-red-50 dark:bg-red-950/20" : "border-gray-200 bg-gray-50 hover:border-violet-400 dark:border-gray-700 dark:bg-gray-800/50"}`}
        >
          {imagePreview ? (
            <div className="relative w-full">
              <div className="relative mx-auto h-40 max-w-xs overflow-hidden rounded-xl">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  if (imageRef.current) imageRef.current.value = "";
                }}
                className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="mb-2 h-8 w-8 text-gray-300" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Click or drag to upload
              </p>
              <p className="mt-1 text-xs text-gray-400">
                JPEG, PNG or WebP — max 10 MB
              </p>
            </>
          )}
          <input
            ref={imageRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setImageError("");
                setImagePreview(URL.createObjectURL(f));
              }
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </div>
        <FieldError msg={imageError} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Plus className="h-4 w-4" />
        {isSubmitting ? "Submitting…" : "Submit Hotel for Approval"}
      </button>
    </form>
  );
}

// ─── Edit hotel form ──────────────────────────────────────────────────────────

function EditHotelForm({
  hotel,
  onUpdated,
}: {
  hotel: VendorHotel;
  onUpdated: () => void;
}) {
  const { token } = useAuth();
  const imageRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateHotelFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(updateHotelSchema) as any,
    mode: "onTouched",
    defaultValues: {
      name: hotel.name,
      slug: hotel.slug,
      location: hotel.location,
      description: "",
      price: hotel.price,
      tags: "",
      amenities: "",
      isActive: hotel.isActive,
    },
  });

  const nameValue = watch("name");

  useEffect(() => {
    if (nameValue) {
      const slug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", slug, { shouldValidate: false });
    }
  }, [nameValue, setValue]);

  async function onSubmit(data: UpdateHotelFormValues) {
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("slug", data.slug);
    fd.append("location", data.location);
    fd.append("description", data.description);
    fd.append("price", String(data.price));
    fd.append("isActive", data.isActive ? "true" : "false");
    data.tags
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((t) => fd.append("tags", t));
    data.amenities
      ?.split(",")
      .map((a) => a.trim())
      .filter(Boolean)
      .forEach((a) => fd.append("amenities", a));
    const file = imageRef.current?.files?.[0];
    if (file) fd.append("image", file);

    try {
      const res = await fetch(`${BASE}/hotels/${hotel.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update hotel");
      if (imageRef.current) imageRef.current.value = "";
      setImagePreview(null);
      onUpdated();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit as never)}
      noValidate
      className="space-y-5"
    >
      {/* Name + Slug */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>Hotel Name</label>
          <input
            type="text"
            {...register("name")}
            className={inputCls(!!errors.name)}
          />
          <FieldError msg={errors.name?.message} />
        </div>
        <div>
          <label className={labelCls()}>
            URL Slug{" "}
            <span className="font-normal text-gray-400">(auto-generated)</span>
          </label>
          <input
            type="text"
            {...register("slug")}
            className={inputCls(!!errors.slug)}
          />
          <FieldError msg={errors.slug?.message} />
        </div>
      </div>

      {/* Location + Price */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Location
            </span>
          </label>
          <input
            type="text"
            {...register("location")}
            className={inputCls(!!errors.location)}
          />
          <FieldError msg={errors.location?.message} />
        </div>
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              Price per Night (৳)
            </span>
          </label>
          <input
            type="number"
            {...register("price")}
            min={1}
            className={inputCls(!!errors.price)}
          />
          <FieldError msg={errors.price?.message} />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelCls()}>Description</label>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="Describe your hotel — location, ambiance, what makes it special…"
          className={inputCls(!!errors.description)}
        />
        <FieldError msg={errors.description?.message} />
      </div>

      {/* Tags + Amenities */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" /> Tags{" "}
              <span className="font-normal text-gray-400">
                (comma-separated)
              </span>
            </span>
          </label>
          <input
            type="text"
            {...register("tags")}
            placeholder="beachfront, luxury, family"
            className={inputCls()}
          />
        </div>
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Amenities{" "}
              <span className="font-normal text-gray-400">
                (comma-separated)
              </span>
            </span>
          </label>
          <input
            type="text"
            {...register("amenities")}
            placeholder="WiFi, Pool, Spa, Parking"
            className={inputCls()}
          />
        </div>
      </div>

      {/* Active toggle */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Active
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Only active hotels are visible to guests
          </p>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            className="sr-only peer"
            {...register("isActive")}
          />
          <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all after:content-[''] peer-checked:bg-violet-600 peer-checked:after:translate-x-full dark:bg-gray-600" />
        </label>
      </div>

      {/* Image (optional) */}
      <div>
        <label className={labelCls()}>
          <span className="flex items-center gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Cover Image{" "}
            <span className="font-normal text-gray-400">
              (leave empty to keep current)
            </span>
          </span>
        </label>
        <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-8 transition-colors hover:border-violet-400 dark:border-gray-700 dark:bg-gray-800/50">
          {imagePreview ? (
            <div className="relative w-full">
              <div className="relative mx-auto h-40 max-w-xs overflow-hidden rounded-xl">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  if (imageRef.current) imageRef.current.value = "";
                }}
                className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative mx-auto mb-3 h-20 w-32 overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700">
                {hotel.image && (
                  <Image
                    src={`${BASE}${hotel.image}`}
                    alt={hotel.name}
                    fill
                    unoptimized
                    className="object-cover opacity-60"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Click to replace image
              </p>
              <p className="mt-1 text-xs text-gray-400">
                JPEG, PNG or WebP — max 10 MB
              </p>
            </div>
          )}
          <input
            ref={imageRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setImagePreview(URL.createObjectURL(f));
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Pencil className="h-4 w-4" />
        {isSubmitting ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}

// ─── Create destination form ──────────────────────────────────────────────────

function CreateDestinationForm({ onCreated }: { onCreated: () => void }) {
  const { token } = useAuth();
  const imageRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DestinationFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(destinationSchema) as any,
    mode: "onTouched",
  });

  async function onSubmit(data: DestinationFormValues) {
    const file = imageRef.current?.files?.[0];
    if (!file) {
      setImageError("Please select a destination image");
      return;
    }

    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("region", data.region);
    fd.append("description", data.description);
    data.highlights
      ?.split(",")
      .map((h) => h.trim())
      .filter(Boolean)
      .forEach((h) => fd.append("highlights", h));
    fd.append("image", file);

    try {
      const res = await fetch(`${BASE}/destinations`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok)
        throw new Error(json.message || "Failed to create destination");
      reset();
      if (imageRef.current) imageRef.current.value = "";
      setImagePreview(null);
      onCreated();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit as never)}
      noValidate
      className="space-y-5"
    >
      {/* Name + Region */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>Destination Name</label>
          <input
            type="text"
            {...register("name")}
            placeholder="Cox's Bazar"
            className={inputCls(!!errors.name)}
          />
          <FieldError msg={errors.name?.message} />
        </div>
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Region
            </span>
          </label>
          <input
            type="text"
            {...register("region")}
            placeholder="Chittagong Division"
            className={inputCls(!!errors.region)}
          />
          <FieldError msg={errors.region?.message} />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelCls()}>Description</label>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="Describe the destination — geography, culture, what makes it special…"
          className={inputCls(!!errors.description)}
        />
        <FieldError msg={errors.description?.message} />
      </div>

      {/* Highlights */}
      <div>
        <label className={labelCls()}>
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Highlights
            <span className="font-normal text-gray-400">(comma-separated)</span>
          </span>
        </label>
        <input
          type="text"
          {...register("highlights")}
          placeholder="World's longest beach, Coral reefs, Sunset views"
          className={inputCls()}
        />
      </div>

      {/* Image */}
      <div>
        <label className={labelCls()}>
          <span className="flex items-center gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Cover Image
          </span>
        </label>
        <div
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 transition-colors ${imageError ? "border-red-400 bg-red-50 dark:bg-red-950/20" : "border-gray-200 bg-gray-50 hover:border-violet-400 dark:border-gray-700 dark:bg-gray-800/50"}`}
        >
          {imagePreview ? (
            <div className="relative w-full">
              <div className="relative mx-auto h-40 max-w-xs overflow-hidden rounded-xl">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  if (imageRef.current) imageRef.current.value = "";
                }}
                className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="mb-2 h-8 w-8 text-gray-300" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Click or drag to upload
              </p>
              <p className="mt-1 text-xs text-gray-400">
                JPEG, PNG or WebP — max 10 MB
              </p>
            </>
          )}
          <input
            ref={imageRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setImageError("");
                setImagePreview(URL.createObjectURL(f));
              }
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </div>
        <FieldError msg={imageError} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Globe className="h-4 w-4" />
        {isSubmitting ? "Submitting…" : "Submit Destination for Approval"}
      </button>
    </form>
  );
}

// ─── Create room form ─────────────────────────────────────────────────────────

function CreateRoomForm({
  hotelId,
  hotelName,
  onCreated,
}: {
  hotelId: string;
  hotelName: string;
  onCreated: () => void;
}) {
  const { token } = useAuth();
  const imagesRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagesError, setImagesError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(roomSchema) as any,
    mode: "onTouched",
    defaultValues: { hotelId },
  });

  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setImagesError("");
    const arr = Array.from(files);
    setSelectedFiles(arr);
    setImagePreviews(arr.map((f) => URL.createObjectURL(f)));
  }

  async function onSubmit(data: RoomFormValues) {
    if (selectedFiles.length === 0) {
      setImagesError("Please select at least one image");
      return;
    }

    const fd = new FormData();
    fd.append("hotelId", hotelId);
    fd.append("name", data.name);
    fd.append("description", data.description);
    fd.append("price", String(data.price));
    fd.append("capacity", String(data.capacity));
    fd.append("view", data.view);
    fd.append("size", data.size);
    data.amenities
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean)
      .forEach((a) => fd.append("amenities", a));
    if (data.badge) fd.append("badge", data.badge);
    selectedFiles.forEach((f) => fd.append("images", f));

    try {
      const res = await fetch(`${BASE}/rooms`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to add room");
      reset({ hotelId });
      if (imagesRef.current) imagesRef.current.value = "";
      setImagePreviews([]);
      setSelectedFiles([]);
      onCreated();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit as never)}
      noValidate
      className="space-y-5"
    >
      {/* Hotel ID (read-only info) */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <Hash className="h-4 w-4 shrink-0 text-gray-400" />
        <div className="min-w-0">
          <p className="text-xs text-gray-400">Adding room to hotel</p>
          <p className="mt-0.5 truncate text-xs font-medium text-gray-700 dark:text-gray-300">
            {hotelName}
          </p>
        </div>
      </div>

      {/* Name + Badge */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>Room Name</label>
          <input
            type="text"
            {...register("name")}
            placeholder="Deluxe Sea View"
            className={inputCls(!!errors.name)}
          />
          <FieldError msg={errors.name?.message} />
        </div>
        <div>
          <label className={labelCls()}>
            Badge <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            {...register("badge")}
            placeholder="Best Value, Most Popular…"
            className={inputCls()}
          />
        </div>
      </div>

      {/* Price + Capacity */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              Price per Night (৳)
            </span>
          </label>
          <input
            type="number"
            {...register("price")}
            placeholder="5000"
            min={1}
            className={inputCls(!!errors.price)}
          />
          <FieldError msg={errors.price?.message} />
        </div>
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> Guest Capacity
            </span>
          </label>
          <input
            type="number"
            {...register("capacity")}
            placeholder="2"
            min={1}
            max={20}
            className={inputCls(!!errors.capacity)}
          />
          <FieldError msg={errors.capacity?.message} />
        </div>
      </div>

      {/* View + Size */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>View Type</label>
          <input
            type="text"
            {...register("view")}
            placeholder="Sea View, Garden View…"
            className={inputCls(!!errors.view)}
          />
          <FieldError msg={errors.view?.message} />
        </div>
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              <Maximize2 className="h-3.5 w-3.5" /> Room Size
            </span>
          </label>
          <input
            type="text"
            {...register("size")}
            placeholder="38 m²"
            className={inputCls(!!errors.size)}
          />
          <FieldError msg={errors.size?.message} />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelCls()}>Description</label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="Describe the room features, furnishings, and highlights…"
          className={inputCls(!!errors.description)}
        />
        <FieldError msg={errors.description?.message} />
      </div>

      {/* Amenities */}
      <div>
        <label className={labelCls()}>
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Amenities{" "}
            <span className="font-normal text-gray-400">(comma-separated)</span>
          </span>
        </label>
        <input
          type="text"
          {...register("amenities")}
          placeholder="AC, WiFi, Minibar, Smart TV, Bathtub"
          className={inputCls(!!errors.amenities)}
        />
        <FieldError msg={errors.amenities?.message} />
      </div>

      {/* Room images */}
      <div>
        <label className={labelCls()}>
          <span className="flex items-center gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Room Photos{" "}
            <span className="font-normal text-gray-400">(up to 10)</span>
          </span>
        </label>
        <div
          className={`relative rounded-xl border-2 border-dashed transition-colors ${imagesError ? "border-red-400 bg-red-50 dark:bg-red-950/20" : "border-gray-200 bg-gray-50 hover:border-violet-400 dark:border-gray-700 dark:bg-gray-800/50"}`}
        >
          {imagePreviews.length > 0 ? (
            <div className="grid grid-cols-4 gap-2 p-3 sm:grid-cols-5">
              {imagePreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-xl"
                >
                  <Image
                    src={src}
                    alt={`Photo ${i + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ))}
              <label className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition-colors hover:border-violet-400 dark:border-gray-600">
                <Plus className="h-5 w-5 text-gray-300" />
                <input
                  ref={imagesRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 text-center">
              <ImageIcon className="mb-2 h-8 w-8 text-gray-300" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Click to upload room photos
              </p>
              <p className="mt-1 text-xs text-gray-400">
                JPEG, PNG or WebP — max 10 MB each
              </p>
            </div>
          )}
          {imagePreviews.length === 0 && (
            <input
              ref={imagesRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          )}
        </div>
        <FieldError msg={imagesError} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <BedDouble className="h-4 w-4" />
        {isSubmitting ? "Submitting…" : "Submit Room for Approval"}
      </button>
    </form>
  );
}

// ─── Edit room form ───────────────────────────────────────────────────────────

const MAX_ROOM_IMAGES = 10;

function EditRoomForm({
  room,
  hotelName,
  onUpdated,
}: {
  room: VendorRoom;
  hotelName: string;
  onUpdated: () => void;
}) {
  const { token } = useAuth();

  // File objects to send (new + existing-fetched-as-blobs)
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  // Existing server image URLs still retained (URL-only mode)
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  // What's shown: existing URLs first, then object URLs for new files
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageError, setImageError] = useState("");
  const [fetchingImages, setFetchingImages] = useState(false);
  // True when user removed an existing URL without adding new files
  const [existingModified, setExistingModified] = useState(false);

  // Init existing images from room prop
  useEffect(() => {
    const previews = (room.images ?? []).map((img) =>
      img.startsWith("http") ? img : `${BASE}${img}`,
    );
    setExistingImageUrls(previews);
    setImagePreviews(previews);
    setExistingModified(false);
    setImageFiles([]);
  }, [room.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateRoomFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(updateRoomSchema) as any,
    mode: "onTouched",
    defaultValues: {
      name: room.name,
      description: room.description ?? "",
      price: room.price,
      capacity: room.capacity,
      view: room.view,
      size: room.size,
      amenities: (room.amenities ?? []).join(", "),
      badge: room.badge ?? "",
      isActive: room.isActive,
    },
  });

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files ?? []);
    if (!newFiles.length) return;
    e.target.value = "";

    if (imagePreviews.length + newFiles.length > MAX_ROOM_IMAGES) {
      setImageError(`You can upload at most ${MAX_ROOM_IMAGES} images.`);
      return;
    }

    // If existing server images haven't been converted to Files yet, fetch them
    // so imageFiles contains ALL images (existing + new) for the submit payload.
    let existingAsFiles: File[] = [];
    if (existingImageUrls.length > 0) {
      setFetchingImages(true);
      try {
        existingAsFiles = await Promise.all(
          existingImageUrls.map(async (url, i) => {
            const res = await fetch(url, { credentials: "include" });
            const blob = await res.blob();
            const name = url.split("/").pop() || `existing-${i}.webp`;
            return new File([blob], name, { type: blob.type });
          }),
        );
      } catch {
        setFetchingImages(false);
        toast.error(
          "Could not load existing images. Please re-upload all images manually.",
        );
        return;
      }
      setFetchingImages(false);
      setExistingImageUrls([]);
    }

    const allFiles = [...existingAsFiles, ...imageFiles, ...newFiles];
    setImageFiles(allFiles);
    setImagePreviews((prev) => [
      ...prev,
      ...newFiles.map((f) => URL.createObjectURL(f)),
    ]);
    setImageError("");
  }

  function removePreview(index: number) {
    if (existingImageUrls.length > 0 && index < existingImageUrls.length) {
      // URL-only mode — remove from URL list
      setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
      setExistingModified(true);
    } else {
      // After conversion (or for new files)
      const fileIndex =
        existingImageUrls.length > 0 ? index - existingImageUrls.length : index;
      setImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(data: UpdateRoomFormValues) {
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("description", data.description);
    fd.append("price", String(data.price));
    fd.append("capacity", String(data.capacity));
    fd.append("view", data.view);
    fd.append("size", data.size);
    data.amenities
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean)
      .forEach((a) => fd.append("amenities", a));
    if (data.badge) fd.append("badge", data.badge);
    fd.append("isActive", data.isActive ? "true" : "false");

    let filesToSend = [...imageFiles];

    // User removed some existing images but didn't add new files — fetch remaining URLs as blobs
    if (existingModified && imageFiles.length === 0) {
      setFetchingImages(true);
      try {
        filesToSend = await Promise.all(
          existingImageUrls.map(async (url, i) => {
            const res = await fetch(url, { credentials: "include" });
            const blob = await res.blob();
            const name = url.split("/").pop() || `existing-${i}.webp`;
            return new File([blob], name, { type: blob.type });
          }),
        );
      } catch {
        setFetchingImages(false);
        toast.error("Could not process images. Please try again.");
        return;
      }
      setFetchingImages(false);
    }

    if (filesToSend.length > 0) {
      filesToSend.forEach((file) => fd.append("images", file));
    }

    try {
      const res = await fetch(`${BASE}/rooms/${room.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update room");
      onUpdated();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const busy = isSubmitting || fetchingImages;

  return (
    <form
      onSubmit={handleSubmit(onSubmit as never)}
      noValidate
      className="space-y-5"
    >
      {/* Hotel info (read-only) */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <Hash className="h-4 w-4 shrink-0 text-gray-400" />
        <div className="min-w-0">
          <p className="text-xs text-gray-400">Editing room in hotel</p>
          <p className="mt-0.5 truncate text-xs font-medium text-gray-700 dark:text-gray-300">
            {hotelName}
          </p>
        </div>
      </div>

      {/* Name + Badge */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>Room Name</label>
          <input
            type="text"
            {...register("name")}
            className={inputCls(!!errors.name)}
          />
          <FieldError msg={errors.name?.message} />
        </div>
        <div>
          <label className={labelCls()}>
            Badge <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            {...register("badge")}
            placeholder="Best Value, Most Popular…"
            className={inputCls()}
          />
        </div>
      </div>

      {/* Price + Capacity */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              Price per Night (৳)
            </span>
          </label>
          <input
            type="number"
            {...register("price")}
            min={1}
            className={inputCls(!!errors.price)}
          />
          <FieldError msg={errors.price?.message} />
        </div>
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> Guest Capacity
            </span>
          </label>
          <input
            type="number"
            {...register("capacity")}
            min={1}
            max={20}
            className={inputCls(!!errors.capacity)}
          />
          <FieldError msg={errors.capacity?.message} />
        </div>
      </div>

      {/* View + Size */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls()}>View Type</label>
          <input
            type="text"
            {...register("view")}
            className={inputCls(!!errors.view)}
          />
          <FieldError msg={errors.view?.message} />
        </div>
        <div>
          <label className={labelCls()}>
            <span className="flex items-center gap-1.5">
              <Maximize2 className="h-3.5 w-3.5" /> Room Size
            </span>
          </label>
          <input
            type="text"
            {...register("size")}
            className={inputCls(!!errors.size)}
          />
          <FieldError msg={errors.size?.message} />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelCls()}>Description</label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="Describe the room features, furnishings, and highlights…"
          className={inputCls(!!errors.description)}
        />
        <FieldError msg={errors.description?.message} />
      </div>

      {/* Amenities */}
      <div>
        <label className={labelCls()}>
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Amenities{" "}
            <span className="font-normal text-gray-400">(comma-separated)</span>
          </span>
        </label>
        <input
          type="text"
          {...register("amenities")}
          placeholder="AC, WiFi, Minibar, Smart TV"
          className={inputCls(!!errors.amenities)}
        />
        <FieldError msg={errors.amenities?.message} />
      </div>

      {/* Active toggle */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Active
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Only active rooms are shown to guests
          </p>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            className="sr-only peer"
            {...register("isActive")}
          />
          <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all after:content-[''] peer-checked:bg-violet-600 peer-checked:after:translate-x-full dark:bg-gray-600" />
        </label>
      </div>

      {/* Room images */}
      <div>
        <div className="mb-2 flex items-start justify-between">
          <div>
            <label className={labelCls()}>
              <span className="flex items-center gap-1.5">
                <Upload className="h-3.5 w-3.5" /> Room Photos
              </span>
            </label>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              You can add or remove images individually. Upload 1–
              {MAX_ROOM_IMAGES} photos.
            </p>
          </div>
          {imagePreviews.length > 0 &&
            imagePreviews.length < MAX_ROOM_IMAGES && (
              <label
                className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 ${fetchingImages ? "pointer-events-none opacity-60" : ""}`}
              >
                {fetchingImages ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" /> Loading…
                  </>
                ) : (
                  "+ Add more"
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={fetchingImages}
                  onChange={handleImageChange}
                />
              </label>
            )}
        </div>

        {imagePreviews.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {imagePreviews.map((src, i) => (
              <div
                key={i}
                className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
              >
                <Image
                  src={src}
                  alt={`Photo ${i + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="160px"
                />
                <button
                  type="button"
                  onClick={() => removePreview(i)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {imagePreviews.length < MAX_ROOM_IMAGES && (
              <label
                className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-800/50 ${fetchingImages ? "cursor-wait opacity-60" : "hover:border-violet-400 hover:bg-violet-50/30 dark:hover:border-violet-600"}`}
              >
                {fetchingImages ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-gray-300" />
                )}
                <span className="text-xs text-gray-400">
                  {fetchingImages ? "Loading…" : "Add"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={fetchingImages}
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        ) : (
          <label
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors hover:border-violet-400 hover:bg-violet-50/30 dark:hover:border-violet-600 ${imageError ? "border-red-400 bg-red-50/20 dark:border-red-700" : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <Upload className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Click to upload photos
              </p>
              <p className="mt-0.5 text-xs text-gray-400">
                Select up to {MAX_ROOM_IMAGES} images — JPEG, PNG or WebP
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}

        {imageError && (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            {imageError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Pencil className="h-4 w-4" />
        )}
        {isSubmitting
          ? "Saving…"
          : fetchingImages
            ? "Processing images…"
            : "Save Changes"}
      </button>
    </form>
  );
}

// ─── Vendor bank info section ─────────────────────────────────────────────────

function VendorBankInfoSection() {
  const { token } = useAuth();
  const [loadingInfo, setLoadingInfo] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BankInfoFormValues>({
    resolver: yupResolver(bankInfoSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/users/me/bank-info`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => {
        const info: BankInfo | null = json.data ?? null;
        if (info) {
          reset({
            bankName: info.bankName ?? "",
            accountName: info.accountName ?? "",
            accountNumber: info.accountNumber ?? "",
            routingNumber: info.routingNumber ?? "",
            bkashNumber: info.bkashNumber ?? "",
            nagadNumber: info.nagadNumber ?? "",
            rocketNumber: info.rocketNumber ?? "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoadingInfo(false));
  }, [token, reset]);

  async function onBankInfoSubmit(data: BankInfoFormValues) {
    if (!token) return;
    try {
      const res = await fetch(`${BASE}/users/me/bank-info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to save bank info");
      toast.success("Bank & payment info saved!");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not save bank info.",
      );
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/30">
          <CreditCard className="h-4 w-4 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Bank & Payment Info
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Required for cashout requests
          </p>
        </div>
      </div>

      {loadingInfo ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onBankInfoSubmit)}
          noValidate
          className="space-y-5 p-6"
        >
          {/* Bank account */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Bank Account
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls()}>Bank Name</label>
                <input
                  {...register("bankName")}
                  placeholder="e.g. Dutch-Bangla Bank"
                  className={inputCls(!!errors.bankName)}
                />
                <FieldError msg={errors.bankName?.message} />
              </div>
              <div>
                <label className={labelCls()}>Account Holder Name</label>
                <input
                  {...register("accountName")}
                  placeholder="Full name on account"
                  className={inputCls(!!errors.accountName)}
                />
                <FieldError msg={errors.accountName?.message} />
              </div>
              <div>
                <label className={labelCls()}>Account Number</label>
                <input
                  {...register("accountNumber")}
                  placeholder="Your account number"
                  className={inputCls(!!errors.accountNumber)}
                />
                <FieldError msg={errors.accountNumber?.message} />
              </div>
              <div>
                <label className={labelCls()}>Routing Number</label>
                <input
                  {...register("routingNumber")}
                  placeholder="9-digit routing number"
                  className={inputCls(!!errors.routingNumber)}
                />
                <FieldError msg={errors.routingNumber?.message} />
              </div>
            </div>
          </div>

          {/* Mobile banking */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Mobile Banking
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelCls()}>bKash Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-500" />
                  <input
                    {...register("bkashNumber")}
                    placeholder="01XXXXXXXXX"
                    className={`${inputCls(!!errors.bkashNumber)} pl-10`}
                  />
                </div>
                <FieldError msg={errors.bkashNumber?.message} />
              </div>
              <div>
                <label className={labelCls()}>Nagad Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />
                  <input
                    {...register("nagadNumber")}
                    placeholder="01XXXXXXXXX"
                    className={`${inputCls(!!errors.nagadNumber)} pl-10`}
                  />
                </div>
                <FieldError msg={errors.nagadNumber?.message} />
              </div>
              <div>
                <label className={labelCls()}>Rocket Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-500" />
                  <input
                    {...register("rocketNumber")}
                    placeholder="01XXXXXXXXX"
                    className={`${inputCls(!!errors.rocketNumber)} pl-10`}
                  />
                </div>
                <FieldError msg={errors.rocketNumber?.message} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CreditCard className="h-4 w-4" />
            {isSubmitting ? "Saving…" : "Save Payment Info"}
          </button>
        </form>
      )}
    </div>
  );
}

// ─── Settings section ─────────────────────────────────────────────────────────

function SettingsSection({ isVendor }: { isVendor: boolean }) {
  const { token } = useAuth();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      const res = await fetch(`${BASE}/users/me/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update password");
      toast.success(json.message || "Password updated successfully!");
      reset();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="space-y-5">
      {isVendor && <VendorBankInfoSection />}

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
          <div>
            <label className={labelCls()}>Current Password</label>
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
            <FieldError msg={errors.currentPassword?.message} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls()}>New Password</label>
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
              <FieldError msg={errors.newPassword?.message} />
            </div>
            <div>
              <label className={labelCls()}>Confirm New Password</label>
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
              <FieldError msg={errors.confirmPassword?.message} />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Lock className="h-4 w-4" />
            {isSubmitting ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>

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
              Permanently delete your account and all data. This cannot be
              undone.
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
