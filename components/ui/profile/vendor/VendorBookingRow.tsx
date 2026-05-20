"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Users,
  CreditCard,
  Smartphone,
  Loader2,
  AlertCircle,
  Moon,
  User,
  Phone,
  LogIn,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import type { VendorBooking, VendorBookingStatus } from "@/types";
import { fmtDate, VENDOR_BOOKING_STATUS_CONFIG } from "@/utils";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";

export default function VendorBookingRow({
  booking,
  hasBankInfo,
  onCashoutRequested,
  onUpdated,
}: {
  booking: VendorBooking;
  hasBankInfo: boolean;
  onCashoutRequested: () => void;
  onUpdated?: () => void;
}) {
  const { token } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [cashoutLoading, setCashoutLoading] = useState(false);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  // Local optimistic state
  const [localCheckinAt, setLocalCheckinAt] = useState(booking.actualCheckinAt);
  const [localGuestCheckedOut, setLocalGuestCheckedOut] = useState(booking.guestCheckedOutAt);
  const [localStatus, setLocalStatus] = useState<VendorBookingStatus>(booking.status);

  const cfg = VENDOR_BOOKING_STATUS_CONFIG[localStatus];
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
  async function handleCheckIn() {
    if (!token) return;
    setCheckinLoading(true);
    try {
      const res = await fetch(`${BASE}/bookings/${booking.id}/checkin`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Check-in failed");
      setLocalCheckinAt(new Date().toISOString());
      toast.success("Guest checked in successfully!");
      onUpdated?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not check in guest.");
    } finally {
      setCheckinLoading(false);
    }
  }

  async function handleVendorCheckout() {
    if (!token) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch(`${BASE}/bookings/${booking.id}/vendor-checkout`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Checkout confirmation failed");
      setLocalStatus("COMPLETED");
      toast.success("Booking completed!");
      onUpdated?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not complete booking.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  const guestPhone = booking.user?.phone ?? booking.guestPhone ?? "—";
  // Handle both old (roomUnit.room) and new (room) API shapes
  const room =
    booking.room ??
    ((booking as any).roomUnit?.room as typeof booking.room | undefined);
  const hotelName = room?.hotel?.name ?? "—";
  const roomName = room?.name ?? "—";

  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {hotelName}
              </p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {roomName}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.pill}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
              {localCheckinAt && localStatus === "CONFIRMED" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Checked In
                </span>
              )}
              {localGuestCheckedOut && localStatus === "CONFIRMED" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                  <LogOut className="h-3 w-3" />
                  Guest Checked Out
                </span>
              )}
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
                      localStatus === "COMPLETED"
                        ? "Paid at Property"
                        : localStatus === "CANCELLED"
                          ? "Refunded"
                          : "Due at Property",
                    value: `৳${booking.balanceDue.toLocaleString()}`,
                    sub:
                      localStatus === "COMPLETED"
                        ? "At check-in"
                        : localStatus === "CANCELLED"
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

              {/* Check-in action */}
              {localStatus === "CONFIRMED" && !localCheckinAt && (
                <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={handleCheckIn}
                    disabled={checkinLoading}
                    className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {checkinLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogIn className="h-4 w-4" />
                    )}
                    {checkinLoading ? "Checking in…" : "Check In Guest"}
                  </button>
                </div>
              )}

              {/* Vendor checkout action — only after guest has checked out */}
              {localStatus === "CONFIRMED" && localGuestCheckedOut && (
                <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={handleVendorCheckout}
                    disabled={checkoutLoading}
                    className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {checkoutLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                    {checkoutLoading ? "Completing…" : "Confirm Checkout & Complete"}
                  </button>
                </div>
              )}

              {/* Cashout action */}
              {localStatus === "CONFIRMED" && !booking.cashoutRequest && (
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
