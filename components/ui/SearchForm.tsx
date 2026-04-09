"use client";

import {
  MapPin,
  Calendar,
  Users,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Minus,
  Plus,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchForm } from "@/hooks/useSearchForm";
import { FilterModal } from "@/components/ui/FilterModal";

// ── Stepper row inside the popover ──────────────────────────────────────────
interface StepperProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
}

function Stepper({ label, value, min = 0, max = 20, onChange }: StepperProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition hover:border-primary-500 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-primary-400 dark:hover:text-primary-400"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-4 text-center text-sm font-semibold tabular-nums text-gray-900 dark:text-white">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition hover:border-primary-500 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-primary-400 dark:hover:text-primary-400"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── Main form ────────────────────────────────────────────────────────────────
export function SearchForm() {
  const { formData, updateField, handleSubmit } = useSearchForm();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isGuestOpen, setIsGuestOpen] = useState(false);

  const guestRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) {
        setIsGuestOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  // Derived summary label
  const guestSummary = useCallback(() => {
    const parts: string[] = [];
    if (formData.adults > 0)
      parts.push(`${formData.adults} Adult${formData.adults > 1 ? "s" : ""}`);
    if (formData.children > 0)
      parts.push(
        `${formData.children} Child${formData.children > 1 ? "ren" : ""}`,
      );
    if (formData.rooms > 0)
      parts.push(`${formData.rooms} Room${formData.rooms > 1 ? "s" : ""}`);
    return parts.join(", ") || "Add guests";
  }, [formData.adults, formData.children, formData.rooms]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex w-full flex-col gap-3 rounded-2xl bg-[#f5faf6] p-4 shadow-lg dark:bg-gray-800 sm:p-6 lg:flex-row lg:items-end lg:gap-2 lg:rounded-full lg:p-2"
      >
        {/* Location */}
        <div className="flex flex-1 items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-700 lg:rounded-full border border-gray-200 lg:border-0">
          <MapPin className="h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
              Location
            </label>
            <input
              type="text"
              placeholder="Where are you going?"
              value={formData.location}
              onChange={(e) => updateField("location", e.target.value)}
              className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none dark:text-white dark:placeholder-gray-500"
            />
          </div>
        </div>

        {/* Check In */}
        <div className="flex flex-1 items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-700 lg:rounded-full border border-gray-200 lg:border-0">
          <Calendar className="h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
              Check In
            </label>
            <input
              type="date"
              value={formData.checkIn}
              onChange={(e) => updateField("checkIn", e.target.value)}
              className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none dark:text-white dark:placeholder-gray-500 dark:[color-scheme:dark]"
            />
          </div>
        </div>

        {/* Check Out */}
        <div className="flex flex-1 items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-700 lg:rounded-full border border-gray-200 lg:border-0">
          <Calendar className="h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
              Check Out
            </label>
            <input
              type="date"
              value={formData.checkOut}
              onChange={(e) => updateField("checkOut", e.target.value)}
              className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none dark:text-white dark:placeholder-gray-500 dark:[color-scheme:dark]"
            />
          </div>
        </div>

        {/* Guests & Rooms — popover trigger */}
        <div ref={guestRef} className="relative flex-1">
          <button
            type="button"
            id="guest-picker-trigger"
            aria-haspopup="dialog"
            aria-expanded={isGuestOpen}
            onClick={() => setIsGuestOpen((prev) => !prev)}
            className="flex w-full items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-left dark:bg-gray-700 lg:rounded-full border border-gray-200 lg:border-0"
          >
            <Users className="h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-400">
                Guests &amp; Rooms
              </p>
              <p className="truncate whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {guestSummary()}
              </p>
            </div>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${isGuestOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Popover panel */}
          {isGuestOpen && (
            <div
              role="dialog"
              aria-label="Guests and rooms selector"
              className="absolute left-0 top-full z-[200] mt-2 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-800 sm:w-80"
            >
              {/* Header */}
              <div className="mb-1 border-b border-gray-100 pb-3 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Guests &amp; Rooms
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Manage occupancy
                </p>
              </div>

              {/* Steppers */}
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                <Stepper
                  label="Adults"
                  value={formData.adults}
                  min={1}
                  onChange={(v) => updateField("adults", v)}
                />
                <Stepper
                  label="Children"
                  value={formData.children}
                  min={0}
                  onChange={(v) => updateField("children", v)}
                />
                <Stepper
                  label="Rooms"
                  value={formData.rooms}
                  min={1}
                  onChange={(v) => updateField("rooms", v)}
                />
              </div>

              {/* Done button */}
              <button
                type="button"
                onClick={() => setIsGuestOpen(false)}
                className="mt-4 w-full rounded-xl bg-primary-600 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 active:bg-primary-800"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 lg:flex-row">
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 lg:h-12 lg:w-12 lg:rounded-full lg:border-0 lg:bg-gray-100 lg:px-0 lg:dark:bg-gray-700"
            aria-label="Filters"
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span className="text-sm font-medium lg:hidden">Filters</span>
          </button>

          <button
            type="submit"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 font-medium text-white transition-colors hover:bg-primary-700 active:bg-primary-800 lg:h-12 lg:w-12 lg:flex-initial lg:rounded-full lg:p-0"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
            <span className="lg:hidden">Search</span>
          </button>
        </div>
      </form>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </>
  );
}
