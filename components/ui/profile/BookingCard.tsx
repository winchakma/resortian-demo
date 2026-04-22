"use client";

import { Booking, BookingStatus } from "@/types";
import { fmtDate } from "@/utils";
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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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

export default function BookingCard({ booking }: { booking: Booking }) {
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
