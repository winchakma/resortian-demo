"use client";

import { Booking, BookingStatus } from "@/types";
import { fmtDate } from "@/utils";
import { useAuth } from "@/context/AuthContext";
import {
  Building2,
  CalendarDays,
  ChevronRight,
  CreditCard,
  MapPin,
  Moon,
  Smartphone,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  LogOut,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ReviewForm } from "@/components/ui/ReviewForm";
import toast from "react-hot-toast";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";

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

// Compute early checkout eligibility from a checkOut date string
function calcEarlyCheckoutDays(checkOut: string): number {
  const midnight = new Date(checkOut);
  midnight.setHours(0, 0, 0, 0);
  const hours = (midnight.getTime() - Date.now()) / (1000 * 60 * 60);
  return Math.floor(hours / 24); // ≥1 means eligible
}

export default function BookingCard({ booking }: { booking: Booking }) {
  const { token } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [earlyLoading, setEarlyLoading] = useState(false);
  const [showEarlyConfirm, setShowEarlyConfirm] = useState(false);

  // Local optimistic state
  const [localCheckinAt] = useState(booking.actualCheckinAt);
  const [localGuestCheckedOut, setLocalGuestCheckedOut] = useState(booking.guestCheckedOutAt);
  const [localEarlyDays, setLocalEarlyDays] = useState(booking.earlyCheckoutSavedDays);
  const [localEarlyAt, setLocalEarlyAt] = useState(booking.earlyCheckoutRequestedAt);
  const [localStatus] = useState(booking.status);

  const cfg = STATUS_CONFIG[localStatus];

  // Eligible for early checkout: checked in, not yet checked out, ≥24h remain
  const earlyDaysPreview = calcEarlyCheckoutDays(booking.checkOut);
  const canEarlyCheckout =
    !!localCheckinAt &&
    !localGuestCheckedOut &&
    localStatus === "upcoming" &&
    earlyDaysPreview >= 1;

  async function handleGuestCheckout() {
    if (!token) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch(`${BASE}/bookings/${booking.id}/guest-checkout`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Checkout failed");
      setLocalGuestCheckedOut(new Date().toISOString());
      toast.success("Checked out successfully! The hotel will confirm shortly.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not check out.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function handleEarlyCheckout() {
    if (!token) return;
    setEarlyLoading(true);
    setShowEarlyConfirm(false);
    try {
      const res = await fetch(`${BASE}/bookings/${booking.id}/early-checkout`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Early checkout failed");
      const now = new Date().toISOString();
      setLocalGuestCheckedOut(now);
      setLocalEarlyAt(now);
      setLocalEarlyDays(json.earlyCheckoutSavedDays ?? earlyDaysPreview);
      toast.success(`Early checkout requested — ${json.earlyCheckoutSavedDays ?? earlyDaysPreview} day(s) saved. Awaiting hotel confirmation.`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not request early checkout.");
    } finally {
      setEarlyLoading(false);
    }
  }

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
                className="text-sm font-semibold text-black transition-colors hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
              >
                {booking.hotelName}
              </Link>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-black dark:text-gray-500">
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
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-black dark:text-gray-400">
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
              <span className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-black dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                {booking.reference}
              </span>
              <span className="flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-black dark:bg-gray-800 dark:text-gray-400">
                {booking.paymentMethod === "stripe" ? (
                  <CreditCard className="h-3 w-3" />
                ) : (
                  <Smartphone className="h-3 w-3" />
                )}
                {booking.paymentMethod === "stripe" ? "Card" : "Mobile Banking"}
              </span>
              {localCheckinAt &&
                !localGuestCheckedOut &&
                localStatus === "upcoming" && (
                  <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    Checked In
                  </span>
                )}
              {localGuestCheckedOut && !localEarlyAt && localStatus === "upcoming" && (
                <span className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                  <LogOut className="h-3 w-3" />
                  Awaiting Hotel Confirmation
                </span>
              )}
              {localEarlyAt && localStatus === "upcoming" && (
                <span className="flex items-center gap-1 rounded-lg bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700 dark:bg-orange-950/30 dark:text-orange-400">
                  <LogOut className="h-3 w-3" />
                  Early Checkout — {localEarlyDays ?? 0}d saved
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {canEarlyCheckout && !showEarlyConfirm && (
                <button
                  type="button"
                  onClick={() => setShowEarlyConfirm(true)}
                  disabled={earlyLoading}
                  className="flex items-center gap-1.5 rounded-xl border border-orange-300 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-orange-700/40 dark:bg-orange-950/20 dark:text-orange-400 dark:hover:bg-orange-950/40"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Early Checkout ({earlyDaysPreview}d early)
                </button>
              )}
              {showEarlyConfirm && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-black dark:text-gray-400">
                    Save {earlyDaysPreview} day{earlyDaysPreview !== 1 ? "s" : ""}?
                  </span>
                  <button
                    type="button"
                    onClick={handleEarlyCheckout}
                    disabled={earlyLoading}
                    className="flex items-center gap-1 rounded-lg bg-orange-600 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-orange-700 disabled:opacity-60"
                  >
                    {earlyLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEarlyConfirm(false)}
                    className="rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-black transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              )}
              {localCheckinAt &&
                !localGuestCheckedOut &&
                localStatus === "upcoming" && (
                  <button
                    type="button"
                    onClick={handleGuestCheckout}
                    disabled={checkoutLoading}
                    className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {checkoutLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <LogOut className="h-3.5 w-3.5" />
                    )}
                    {checkoutLoading ? "Checking out…" : "Check Out"}
                  </button>
                )}
              <button
                type="button"
                onClick={() => setExpanded((p) => !p)}
                className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400"
              >
                {expanded ? "Hide details" : "View details"}
              </button>
            </div>
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
                      localStatus === "completed"
                        ? "Paid at Property"
                        : localStatus === "cancelled"
                          ? "Refunded"
                          : "Due at Property",
                    value: `৳${booking.balanceDue.toLocaleString()}`,
                    sub:
                      localStatus === "completed"
                        ? "At check-in"
                        : localStatus === "cancelled"
                          ? "7–10 days"
                          : "On arrival",
                  },
                ].map((col) => (
                  <div
                    key={col.label}
                    className={`px-4 py-3 ${col.highlight ? "bg-primary-50/60 dark:bg-primary-950/20" : "bg-gray-50/60 dark:bg-gray-800/30"}`}
                  >
                    <p className="text-[10px] text-black dark:text-gray-500">
                      {col.label}
                    </p>
                    <p
                      className={`mt-0.5 text-sm font-bold ${col.highlight ? "text-primary-700 dark:text-primary-400" : "text-black dark:text-gray-200"}`}
                    >
                      {col.value}
                    </p>
                    <p className="mt-0.5 text-[10px] text-black dark:text-gray-500">
                      {col.sub}
                    </p>
                  </div>
                ))}
              </div>
              {localEarlyAt && localEarlyDays && (
                <div className="flex items-start gap-2 border-t border-orange-100 bg-orange-50/60 px-4 py-3 dark:border-orange-900/30 dark:bg-orange-950/10">
                  <LogOut className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-orange-700 dark:text-orange-400">
                      Early Checkout Requested — {localEarlyDays} day{localEarlyDays !== 1 ? "s" : ""} early
                    </p>
                    <p className="mt-0.5 text-[11px] text-orange-600/80 dark:text-orange-500/80">
                      Requested on {fmtDate(localEarlyAt)} · Awaiting hotel confirmation to adjust booking dates &amp; balance
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2 dark:border-gray-800">
                <p className="text-xs text-black dark:text-gray-500">
                  Booked on {fmtDate(booking.bookedOn)}
                </p>
                {localStatus === "upcoming" && (
                  <Link
                    href={`/hotels/${booking.hotelSlug}`}
                    className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline dark:text-primary-400"
                  >
                    View Property <ChevronRight className="h-3 w-3" />
                  </Link>
                )}
              </div>

              {localStatus === "completed" && !reviewed && (
                <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
                  {showReview ? (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-black dark:text-gray-300">
                        Review {booking.hotelName}
                      </p>
                      <ReviewForm
                        hotelId={booking.hotelId}
                        bookingId={booking.id}
                        onReviewPosted={() => setReviewed(true)}
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowReview(true)}
                      className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-950/40"
                    >
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      Write a Review
                    </button>
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
