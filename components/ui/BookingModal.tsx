"use client";

import "react-calendar/dist/Calendar.css";

import { useState, useEffect, useCallback } from "react";
import Calendar from "react-calendar";
import {
  X,
  CalendarDays,
  Users,
  Maximize2,
  Eye,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import type { Hotel, Room } from "@/types";

interface BookingModalProps {
  hotel: Hotel;
  room: Room;
  onClose: () => void;
}

function toISODate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function parseLocal(iso: string): Date {
  const [y, m, day] = iso.split("-").map(Number);
  return new Date(y, m - 1, day);
}

function fmtShort(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BookingModal({ hotel, room, onClose }: BookingModalProps) {
  const { addItem } = useCart();
  const router = useRouter();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // Date bounds
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);

  // Parse booked dates into a Set for O(1) lookup
  const bookedSet = new Set<string>(room.booked_dates ?? []);

  // Check if a date range spans over any booked date
  function rangeHasBookedDate(start: Date, end: Date): boolean {
    const cursor = new Date(start);
    cursor.setDate(cursor.getDate() + 1); // start day itself is OK (check-in day)
    while (cursor < end) {
      if (bookedSet.has(toISODate(cursor))) return true;
      cursor.setDate(cursor.getDate() + 1);
    }
    return false;
  }

  const tileDisabled = useCallback(
    ({ date, view }: { date: Date; view: string }) => {
      if (view !== "month") return false;
      if (date < today) return true;
      if (date > maxDate) return true;
      if (bookedSet.has(toISODate(date))) return true;
      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bookedSet, today, maxDate],
  );

  // Tile class — highlight booked dates differently
  const tileClassName = useCallback(
    ({ date, view }: { date: Date; view: string }) => {
      if (view !== "month") return null;
      if (bookedSet.has(toISODate(date))) return "booked-date";
      return null;
    },
    [bookedSet],
  );

  const handleCalendarChange = useCallback(
    (val: unknown) => {
      if (!Array.isArray(val)) return;
      const [start, end] = val as [Date | null, Date | null];
      const startStr = start ? toISODate(start) : "";
      const endStr = end ? toISODate(end) : "";

      // Validate range doesn't cross booked dates
      if (start && end && rangeHasBookedDate(start, end)) {
        toast.error(
          "Your selected range includes unavailable dates. Please choose different dates.",
        );
        setCheckIn(startStr);
        setCheckOut("");
        return;
      }

      setCheckIn(startStr);
      setCheckOut(endStr);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bookedSet],
  );

  const checkInDate = checkIn ? parseLocal(checkIn) : null;
  const checkOutDate = checkOut ? parseLocal(checkOut) : null;

  const nights =
    checkInDate && checkOutDate
      ? Math.round(
          (checkOutDate.getTime() - checkInDate.getTime()) / 86_400_000,
        )
      : 0;

  const totalPrice = nights * room.price;

  const calendarValue: Date | [Date, Date] | null =
    checkInDate && checkOutDate
      ? [checkInDate, checkOutDate]
      : (checkInDate ?? null);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleConfirm() {
    if (!checkIn || !checkOut || nights < 1) {
      toast.error("Please select your check-in and check-out dates.");
      return;
    }

    addItem({
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelSlug: hotel.slug,
      hotelLocation: hotel.location,
      roomId: room.id,
      roomName: room.name,
      roomImage: room.images[0],
      price: room.price,
      currency: hotel.currency,
      view: room.view,
      size: room.size,
      capacity: room.capacity,
      checkIn,
      checkOut,
      nights,
      totalPrice,
    });

    onClose();

    // toast.success(
    //   (t) => (
    //     <div className="flex flex-col gap-1">
    //       <p className="font-semibold text-gray-900">Room added to cart!</p>
    //       <p className="text-xs text-gray-500">
    //         {room.name} · {nights} night{nights !== 1 ? "s" : ""}
    //       </p>
    //       <button
    //         onClick={() => {
    //           toast.dismiss(t.id);
    //           router.push("/cart");
    //         }}
    //         className="mt-1 self-start rounded-md bg-primary-600 px-3 py-1 text-xs font-semibold text-white hover:bg-primary-700"
    //       >
    //         View Cart
    //       </button>
    //     </div>
    //   ),
    //   { duration: 5000 },
    // );
    router.push("/checkout");
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[500] flex items-end justify-center sm:items-center sm:p-4"
      aria-modal="true"
      role="dialog"
      aria-label="Select booking dates"
    >
      {/* Dim layer */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative z-10 flex max-h-[95vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-gray-900 sm:max-w-lg sm:rounded-2xl">
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Select Dates
            </h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {room.name} · {hotel.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Room info strip */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-gray-100 bg-gray-50 px-5 py-3 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-primary-500" />
              {room.capacity} Guest{room.capacity !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <Maximize2 className="h-3.5 w-3.5 text-primary-500" />
              {room.size}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 text-primary-500" />
              {room.view}
            </span>
            <span className="ml-auto font-semibold text-primary-600 dark:text-primary-400">
              ৳{room.price.toLocaleString()}/night
            </span>
          </div>

          {/* Date summary chips */}
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3 dark:border-gray-800">
            <div
              className={`flex-1 rounded-xl px-3 py-2 text-center text-xs transition-colors ${
                checkInDate
                  ? "bg-primary-50 font-medium text-primary-800 ring-1 ring-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:ring-primary-800"
                  : "bg-gray-50 text-gray-400 ring-1 ring-dashed ring-gray-300 dark:bg-gray-800 dark:ring-gray-700"
              }`}
            >
              <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider opacity-70">
                Check-in
              </p>
              <p className="font-semibold">
                {checkInDate ? fmtShort(checkInDate) : "—"}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
            <div
              className={`flex-1 rounded-xl px-3 py-2 text-center text-xs transition-colors ${
                checkOutDate
                  ? "bg-primary-50 font-medium text-primary-800 ring-1 ring-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:ring-primary-800"
                  : "bg-gray-50 text-gray-400 ring-1 ring-dashed ring-gray-300 dark:bg-gray-800 dark:ring-gray-700"
              }`}
            >
              <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider opacity-70">
                Check-out
              </p>
              <p className="font-semibold">
                {checkOutDate ? fmtShort(checkOutDate) : "—"}
              </p>
            </div>
          </div>

          {/* Hint */}
          <p className="px-5 pt-3 pb-1 text-xs text-gray-500 dark:text-gray-400">
            {!checkInDate
              ? "Select your check-in date"
              : !checkOutDate
                ? "Now select your check-out date"
                : `${nights} night${nights !== 1 ? "s" : ""} selected`}
          </p>

          {/* Calendar */}
          <div className="resortian-cal px-4 pb-4 pt-1">
            <Calendar
              onChange={handleCalendarChange}
              value={calendarValue}
              selectRange
              allowPartialRange
              minDate={today}
              maxDate={maxDate}
              tileDisabled={tileDisabled}
              tileClassName={tileClassName}
              showNeighboringMonth={false}
              prev2Label={null}
              next2Label={null}
            />
          </div>

          {/* Legend */}
          {bookedSet.size > 0 && (
            <div className="flex items-center gap-3 px-5 pb-4 text-xs text-gray-400 dark:text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm bg-red-100 dark:bg-red-900/30" />
                Unavailable
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm bg-primary-100 dark:bg-primary-900/30" />
                Your selection
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-4 dark:border-gray-800">
          {nights > 0 && (
            <div className="mb-3 flex items-baseline justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                ৳{room.price.toLocaleString()} × {nights} night
                {nights !== 1 ? "s" : ""}
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ৳{totalPrice.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex gap-2">
            {(checkIn || checkOut) && (
              <button
                type="button"
                onClick={() => {
                  setCheckIn("");
                  setCheckOut("");
                }}
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!checkIn || !checkOut || nights < 1}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 active:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CalendarDays className="h-4 w-4" />
              {nights > 0
                ? `Book ${nights} Night${nights !== 1 ? "s" : ""} · ৳${totalPrice.toLocaleString()}`
                : "Select dates to continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
