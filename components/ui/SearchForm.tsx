"use client";

import {
  MapPin,
  Users,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Minus,
  Plus,
  Loader2,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSearchForm } from "@/hooks/useSearchForm";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { FilterModal, type FilterValues } from "@/components/ui/FilterModal";
import type { SearchFormData } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface LocationOption {
  name: string;
  type: "destination" | "hotel_location";
}

// ── Stepper row ───────────────────────────────────────────────────────────────
interface StepperProps {
  label: string;
  sublabel?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
}

function Stepper({
  label,
  sublabel,
  value,
  min = 0,
  max = 20,
  onChange,
}: StepperProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {label}
        </p>
        {sublabel && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{sublabel}</p>
        )}
      </div>
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

// ── SearchForm ────────────────────────────────────────────────────────────────

interface FilterSearchParams {
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  amenities?: string;
  sortBy?: string;
}

interface SearchFormProps {
  initialValues?: Partial<SearchFormData>;
  searchParams?: FilterSearchParams;
}

export function SearchForm({
  initialValues,
  searchParams,
}: SearchFormProps = {}) {
  const { formData, updateField, handleSubmit } = useSearchForm({
    initialValues,
  });
  const router = useRouter();
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ── Location search state ─────────────────────────────────────────────────
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState(
    initialValues?.location ?? "",
  );
  const [locationResults, setLocationResults] = useState<LocationOption[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationPage, setLocationPage] = useState(1);
  const [locationTotalPages, setLocationTotalPages] = useState(1);
  const [locationLoadingMore, setLocationLoadingMore] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const locationListRef = useRef<HTMLUListElement>(null);
  const locationDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const fetchLocations = useCallback(
    async (query: string, page: number, append = false) => {
      if (page === 1) setLocationLoading(true);
      else setLocationLoadingMore(true);
      try {
        const qs = new URLSearchParams({ limit: "10", page: String(page) });
        if (query) qs.set("search", query);
        const res = await fetch(`${API_BASE}/destinations/locations?${qs}`);
        if (!res.ok) return;
        const json = await res.json();
        const items: LocationOption[] = json.data ?? [];
        setLocationResults((prev) => (append ? [...prev, ...items] : items));
        setLocationTotalPages(json.meta?.totalPages ?? 1);
        setLocationPage(page);
      } catch {
        // silently ignore network errors
      } finally {
        setLocationLoading(false);
        setLocationLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!isLocationOpen) return;
    if (locationDebounceRef.current) clearTimeout(locationDebounceRef.current);
    locationDebounceRef.current = setTimeout(() => {
      fetchLocations(locationQuery, 1, false);
    }, 250);
    return () => {
      if (locationDebounceRef.current)
        clearTimeout(locationDebounceRef.current);
    };
  }, [locationQuery, isLocationOpen, fetchLocations]);

  const handleLocationScroll = useCallback(() => {
    const el = locationListRef.current;
    if (!el || locationLoadingMore || locationPage >= locationTotalPages)
      return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      fetchLocations(locationQuery, locationPage + 1, true);
    }
  }, [
    locationLoadingMore,
    locationPage,
    locationTotalPages,
    locationQuery,
    fetchLocations,
  ]);

  const selectLocation = useCallback(
    (name: string) => {
      setLocationQuery(name);
      updateField("location", name);
      setIsLocationOpen(false);
    },
    [updateField],
  );

  const guestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) {
        setIsGuestOpen(false);
      }
      if (
        locationRef.current &&
        !locationRef.current.contains(e.target as Node)
      ) {
        setIsLocationOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const handleFilterApply = useCallback(
    (values: FilterValues) => {
      const params = new URLSearchParams();
      if (formData.location) params.set("location", formData.location);
      if (formData.checkIn) params.set("checkIn", formData.checkIn);
      if (formData.checkOut) params.set("checkOut", formData.checkOut);
      params.set("adults", String(formData.adults));
      params.set("children", String(formData.children));
      params.set("rooms", String(formData.rooms));
      if (values.priceMin) params.set("minPrice", values.priceMin);
      if (values.priceMax) params.set("maxPrice", values.priceMax);
      if (values.selectedStars.length > 0) {
        params.set("minRating", String(Math.min(...values.selectedStars)));
      }
      if (values.selectedAmenities.length > 0) {
        params.set("amenities", values.selectedAmenities.join(","));
      }
      if (values.sortBy) params.set("sortBy", values.sortBy);
      router.push(`/hotels?${params.toString()}`);
    },
    [formData, router],
  );

  const initialFilterValues: Partial<FilterValues> = {
    priceMin: searchParams?.minPrice ?? "",
    priceMax: searchParams?.maxPrice ?? "",
    selectedStars: searchParams?.minRating
      ? [Number(searchParams.minRating)]
      : [],
    selectedAmenities: searchParams?.amenities
      ? searchParams.amenities.split(",").filter(Boolean)
      : [],
    sortBy: searchParams?.sortBy ?? "",
  };

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
        className="flex w-full flex-col gap-3 rounded-full border border-gray-200 bg-white p-1.5 shadow-md lg:flex-row lg:items-center lg:gap-0 dark:border-gray-700 dark:bg-gray-800"
      >
        {/* ── Location ───────────────────────────────────────────── */}
        <div ref={locationRef} className="relative flex-1">
          <div className="flex items-center gap-3 bg-transparent px-4 py-2 lg:border-r lg:border-gray-200 lg:dark:border-gray-700">
            <MapPin className="h-5 w-5 shrink-0 text-gray-450 dark:text-gray-400" />
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Location
              </label>
              <input
                type="text"
                placeholder="Where are you going?"
                value={locationQuery}
                onChange={(e) => {
                  setLocationQuery(e.target.value);
                  updateField("location", e.target.value);
                }}
                onFocus={() => setIsLocationOpen(true)}
                className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none dark:text-white dark:placeholder-gray-400"
              />
            </div>
            {locationLoading && (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-gray-400" />
            )}
          </div>

          {isLocationOpen && (
            <div
              role="listbox"
              aria-label="Location suggestions"
              className="absolute left-0 top-full z-[200] mt-2 w-full rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-2xl dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <ul
                ref={locationListRef}
                onScroll={handleLocationScroll}
                className="max-h-56 overflow-y-auto py-1"
              >
                {!locationLoading && locationResults.length === 0 && (
                  <li className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                    No locations found
                  </li>
                )}
                {locationResults.map((item, idx) => (
                  <li key={`${item.name}-${idx}`}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectLocation(item.name)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-gray-800 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <MapPin className="h-4 w-4 shrink-0 text-primary-500" />
                      <span className="flex-1 text-sm">{item.name}</span>
                    </button>
                  </li>
                ))}
                {locationLoadingMore && (
                  <li className="flex justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* ── Date range picker ───────────────────────────────────── */}
        <div className="flex-[1.4] lg:border-r lg:border-gray-200 lg:dark:border-gray-700">
          <DateRangePicker
            checkIn={formData.checkIn}
            checkOut={formData.checkOut}
            onChange={(ci, co) => {
              updateField("checkIn", ci);
              updateField("checkOut", co);
            }}
          />
        </div>

        {/* ── Guests & Rooms ──────────────────────────────────────── */}
        <div ref={guestRef} className="relative flex-1">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={isGuestOpen}
            onClick={() => setIsGuestOpen((p) => !p)}
            className="flex w-full items-center gap-3 bg-transparent px-4 py-2 text-left lg:border-r lg:border-gray-200 lg:dark:border-gray-700"
          >
            <Users className="h-5 w-5 shrink-0 text-gray-450 dark:text-gray-400" />
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Guests &amp; Rooms
              </p>
              <p className="truncate whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {guestSummary()}
              </p>
            </div>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${
                isGuestOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Guest popover */}
          {isGuestOpen && (
            <div
              role="dialog"
              aria-label="Guests and rooms selector"
              className="absolute right-0 top-full z-[200] mt-2 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-800 sm:w-80"
            >
              <div className="mb-1 border-b border-gray-100 pb-3 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Guests &amp; Rooms
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Manage occupancy
                </p>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                <Stepper
                  label="Adults"
                  sublabel="Age 13+"
                  value={formData.adults}
                  min={1}
                  onChange={(v) => updateField("adults", v)}
                />
                <Stepper
                  label="Children"
                  sublabel="Ages 2–12"
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

        {/* ── Action buttons ──────────────────────────────────────── */}
        <div className="flex gap-2 px-4 py-2 lg:px-2 lg:py-0 shrink-0">
          {/* Filter */}
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-gray-750 transition-colors hover:bg-gray-50 active:bg-gray-100 dark:border-gray-650 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-650 lg:h-11 lg:w-11 lg:rounded-full lg:border-0 lg:bg-gray-100 lg:px-0 lg:dark:bg-gray-700"
            aria-label="Filters"
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span className="text-sm font-medium lg:hidden">Filters</span>
          </button>

          {/* Search */}
          <button
            type="submit"
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 font-semibold text-white transition-colors hover:bg-primary-700 active:bg-primary-800 lg:h-11 lg:px-6 lg:rounded-full"
            aria-label="Search"
          >
            <Search className="h-5 w-5 animate-pulse" />
            <span className="font-bold text-sm">Search</span>
          </button>
        </div>
      </form>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialValues={initialFilterValues}
        onApply={handleFilterApply}
      />
    </>
  );
}
