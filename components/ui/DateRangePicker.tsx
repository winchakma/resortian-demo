"use client";

// Base calendar styles — imported here so they always load with this component.
// Scoped overrides live in globals.css under .resortian-cal (higher specificity).
import "react-calendar/dist/Calendar.css";

import { useState, useRef, useEffect, useCallback } from "react";
import Calendar from "react-calendar";
import { Calendar as CalendarIcon, X, ChevronRight } from "lucide-react";

type RangeValue = [Date | null, Date | null];

interface DateRangePickerProps {
  checkIn: string; // "YYYY-MM-DD" or ""
  checkOut: string; // "YYYY-MM-DD" or ""
  onChange: (checkIn: string, checkOut: string) => void;
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse "YYYY-MM-DD" as local midnight to avoid UTC-offset date shifts. */
function parseLocal(iso: string): Date {
  const [y, m, day] = iso.split("-").map(Number);
  return new Date(y, m - 1, day);
}

function fmtShort(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Date bounds: today → today + 30 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);

  const checkInDate = checkIn ? parseLocal(checkIn) : null;
  const checkOutDate = checkOut ? parseLocal(checkOut) : null;

  // Close on outside-click (desktop only; mobile uses the backdrop overlay)
  useEffect(() => {
    if (!isOpen) return;
    function onOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Lock body scroll while the bottom-sheet is open on mobile
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCalendarChange = useCallback(
    (val: unknown) => {
      if (!Array.isArray(val)) return;
      const [start, end] = val as RangeValue;
      const startStr = start ? toISODate(start) : "";
      const endStr = end ? toISODate(end) : "";
      onChange(startStr, endStr);
      if (startStr && endStr) setIsOpen(false);
    },
    [onChange],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange("", "");
    },
    [onChange],
  );

  const hasRange = Boolean(checkInDate && checkOutDate);
  const hasStart = Boolean(checkInDate && !checkOutDate);

  const nights =
    hasRange && checkInDate && checkOutDate
      ? Math.round(
          (checkOutDate.getTime() - checkInDate.getTime()) / 86_400_000,
        )
      : 0;

  const triggerLabel = hasRange
    ? `${fmtShort(checkInDate!)} → ${fmtShort(checkOutDate!)}`
    : hasStart
      ? `${fmtShort(checkInDate!)} → Pick checkout`
      : "Select dates";

  const hint = !checkInDate
    ? "Select your check-in date"
    : !checkOutDate
      ? "Now select your check-out date"
      : `${nights} night${nights !== 1 ? "s" : ""} selected`;

  const calendarValue: Date | [Date, Date] | null =
    checkInDate && checkOutDate
      ? [checkInDate, checkOutDate]
      : (checkInDate ?? null);

  // ─── Shared panel content ───────────────────────────────────────────────────
  const panelContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {!checkInDate
              ? "Pick check-in"
              : !checkOutDate
                ? "Pick check-out"
                : "Date range"}
          </p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {hint}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          aria-label="Close calendar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Selected-dates summary */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-2.5 dark:border-gray-800">
        <div
          className={`flex-1 rounded-xl px-3 py-2 text-center text-xs ${
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
          className={`flex-1 rounded-xl px-3 py-2 text-center text-xs ${
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

      {/* Calendar */}
      <div className="resortian-cal p-4">
        <Calendar
          onChange={handleCalendarChange}
          value={calendarValue}
          selectRange
          allowPartialRange
          minDate={today}
          maxDate={maxDate}
          showNeighboringMonth={false}
          prev2Label={null}
          next2Label={null}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Available up to{" "}
          {maxDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          })}
        </p>
        <div className="flex gap-2">
          {(checkInDate || checkOutDate) && (
            <button
              type="button"
              onClick={() => onChange("", "")}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-700"
          >
            {hasRange
              ? `Done · ${nights} night${nights !== 1 ? "s" : ""}`
              : "Close"}
          </button>
        </div>
      </div>
    </>
  );

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className="flex w-full items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-left transition-colors hover:border-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-gray-500 dark:bg-gray-700 lg:rounded-full"
      >
        <CalendarIcon className="h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
        <div className="min-w-0 flex-1">
          <p className="whitespace-nowrap text-xs font-semibold text-gray-600 dark:text-gray-300">
            Check-in / Check-out
          </p>
          <p
            className={`truncate text-sm ${checkInDate ? "font-medium text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"}`}
          >
            {triggerLabel}
          </p>
        </div>
        {(checkInDate || checkOutDate) && (
          <span
            role="button"
            aria-label="Clear dates"
            onClick={handleClear}
            className="shrink-0 rounded-full p-0.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-600 dark:hover:text-gray-200"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* ── Mobile: full-screen backdrop + bottom sheet ──────────────── */}
          <div className="fixed inset-0 z-[300] sm:hidden" aria-hidden="true">
            {/* Dim backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            {/* Bottom sheet */}
            <div
              role="dialog"
              aria-label="Select date range"
              className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl dark:bg-gray-900"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
              </div>
              {panelContent}
            </div>
          </div>

          {/* ── Desktop: absolute dropdown ───────────────────────────────── */}
          <div
            role="dialog"
            aria-label="Select date range"
            className="absolute left-0 top-[calc(100%+8px)] z-[300] hidden w-[360px] rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 sm:block"
          >
            {panelContent}
          </div>
        </>
      )}
    </div>
  );
}
