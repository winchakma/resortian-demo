"use client";

import {
  MapPin,
  Users,
  Search,
  ChevronDown,
  Minus,
  Plus,
  Loader2,
  Bed,
  Plane,
  Car,
  Briefcase,
  Ticket,
  Ship
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSearchForm } from "@/hooks/useSearchForm";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
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

const TABS = [
  { id: "stays", label: "Stays", icon: Bed },
  { id: "flights", label: "Flights", icon: Plane },
  { id: "cars", label: "Cars", icon: Car },
  { id: "packages", label: "Packages", icon: Briefcase },
  { id: "things-to-do", label: "Things to do", icon: Ticket },
  { id: "cruises", label: "Cruises", icon: Ship },
];

export function SearchForm({
  initialValues,
  searchParams,
}: SearchFormProps = {}) {
  const { formData, updateField, handleSubmit } = useSearchForm({
    initialValues,
  });
  const router = useRouter();
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState("stays");

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

  const guestSummary = useCallback(() => {
    const parts: string[] = [];
    if (formData.adults > 0)
      parts.push(`${formData.adults} traveler${formData.adults > 1 ? "s" : ""}`);
    if (formData.rooms > 0)
      parts.push(`${formData.rooms} room${formData.rooms > 1 ? "s" : ""}`);
    return parts.join(", ") || "Add travelers";
  }, [formData.adults, formData.rooms]);

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 relative mt-8 lg:mt-12">
      
      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar items-center gap-6 border-b border-gray-200 dark:border-gray-800 mb-6">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 text-sm font-semibold transition-colors whitespace-nowrap relative ${
                isActive
                  ? "text-primary-600 dark:text-primary-500"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              {tab.label}
              {isActive && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary-600 dark:bg-primary-500" />
              )}
            </button>
          );
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-4"
      >
        {/* Input Row */}
        <div className="flex flex-col lg:flex-row rounded-lg border border-gray-300 dark:border-gray-700 divide-y lg:divide-y-0 lg:divide-x divide-gray-300 dark:divide-gray-700 overflow-visible">
          
          {/* Location */}
          <div ref={locationRef} className="relative flex-[1.5] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none">
            <div className="flex items-center gap-3 px-4 py-2 h-[58px]">
              <MapPin className="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] font-semibold text-gray-900 dark:text-white">
                  Going to
                </label>
                <input
                  type="text"
                  placeholder="Destination or property"
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    updateField("location", e.target.value);
                  }}
                  onFocus={() => setIsLocationOpen(true)}
                  className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none dark:text-white dark:placeholder-gray-400 truncate font-medium"
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
                className="absolute left-0 top-[calc(100%+8px)] z-[200] w-full lg:w-[400px] rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-2xl dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <ul
                  ref={locationListRef}
                  onScroll={handleLocationScroll}
                  className="max-h-64 overflow-y-auto py-2"
                >
                  {!locationLoading && locationResults.length === 0 && (
                    <li className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                      No locations found
                    </li>
                  )}
                  {locationResults.map((item, idx) => (
                    <li key={`${item.name}-${idx}`}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectLocation(item.name)}
                        className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <MapPin className="h-5 w-5 shrink-0 text-gray-400" />
                        <span className="flex-1 text-sm font-medium">{item.name}</span>
                      </button>
                    </li>
                  ))}
                  {locationLoadingMore && (
                    <li className="flex justify-center py-3">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="flex-1 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors z-[100] relative lg:static">
            <DateRangePicker
              checkIn={formData.checkIn}
              checkOut={formData.checkOut}
              onChange={(ci, co) => {
                updateField("checkIn", ci);
                updateField("checkOut", co);
              }}
            />
          </div>

          {/* Guests */}
          <div ref={guestRef} className="relative flex-1 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none z-[90]">
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={isGuestOpen}
              onClick={() => setIsGuestOpen((p) => !p)}
              className="flex w-full items-center gap-3 bg-transparent px-4 py-2 h-[58px] text-left"
            >
              <Users className="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="whitespace-nowrap text-[11px] font-semibold text-gray-900 dark:text-white">
                  Travelers
                </p>
                <p className="truncate whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {guestSummary()}
                </p>
              </div>
            </button>

            {/* Guest popover */}
            {isGuestOpen && (
              <div
                role="dialog"
                aria-label="Guests and rooms selector"
                className="absolute right-0 top-[calc(100%+8px)] z-[200] w-full lg:w-[320px] rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-2 border-b border-gray-100 pb-4 dark:border-gray-700">
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    Travelers
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
                  className="mt-6 w-full rounded-xl bg-primary-600 py-3 text-sm font-bold text-white transition hover:bg-primary-700 active:bg-primary-800"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Checkbox & Search Button Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            Add a flight to Bundle &amp; Save*
          </label>
          <button
            type="submit"
            className="w-full sm:w-auto rounded-full bg-[#007cc2] px-12 py-3.5 font-bold text-white transition-colors hover:bg-[#005a8f] shadow-sm flex items-center justify-center text-base"
            aria-label="Search"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
