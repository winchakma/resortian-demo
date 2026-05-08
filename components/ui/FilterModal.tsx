"use client";

import { X, ChevronDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

export interface FilterValues {
  priceMin: string;
  priceMax: string;
  selectedStars: number[];
  selectedAmenities: string[];
  sortBy: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: Partial<FilterValues>;
  onApply: (values: FilterValues) => void;
}

const AMENITIES = [
  "Free WiFi",
  "Swimming Pool",
  "Free Parking",
  "Air Conditioning",
  "Restaurant",
  "Room Service",
  "Spa & Wellness",
  "Gym / Fitness Center",
  "Beach Access",
  "Airport Shuttle",
  "Pet Friendly",
  "24/7 Front Desk",
];

const STAR_RATINGS = [5, 4, 3, 2, 1];

const SLIDER_MAX = 50000;
const SLIDER_STEP = 500;

export function FilterModal({ isOpen, onClose, initialValues, onApply }: FilterModalProps) {
  const [priceMin, setPriceMin] = useState(initialValues?.priceMin ?? "");
  const [priceMax, setPriceMax] = useState(initialValues?.priceMax ?? "");
  const [selectedStars, setSelectedStars] = useState<number[]>(initialValues?.selectedStars ?? []);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialValues?.selectedAmenities ?? []);
  const [sortBy, setSortBy] = useState(initialValues?.sortBy ?? "");

  // Re-sync from URL values every time the modal opens
  useEffect(() => {
    if (!isOpen) return;
    setPriceMin(initialValues?.priceMin ?? "");
    setPriceMax(initialValues?.priceMax ?? "");
    setSelectedStars(initialValues?.selectedStars ?? []);
    setSelectedAmenities(initialValues?.selectedAmenities ?? []);
    setSortBy(initialValues?.sortBy ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const toggleStar = useCallback((star: number) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star],
    );
  }, []);

  const toggleAmenity = useCallback((amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  }, []);

  const handleReset = useCallback(() => {
    setPriceMin("");
    setPriceMax("");
    setSelectedStars([]);
    setSelectedAmenities([]);
    setSortBy("");
  }, []);

  const handleApply = useCallback(() => {
    onApply({ priceMin, priceMax, selectedStars, selectedAmenities, sortBy });
    onClose();
  }, [priceMin, priceMax, selectedStars, selectedAmenities, sortBy, onApply, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeFilterCount =
    (priceMin || priceMax ? 1 : 0) +
    (selectedStars.length > 0 ? 1 : 0) +
    selectedAmenities.length +
    (sortBy !== "" ? 1 : 0);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-10 sm:items-center sm:pt-0"
      role="dialog"
      aria-modal="true"
      aria-label="Search filters"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-800 sm:max-w-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filters
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Sort By */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Sort By
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
                <option value="newest">Newest First</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Price Range (BDT)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Min"
                min="0"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
              <span className="shrink-0 text-sm text-gray-400">to</span>
              <input
                type="number"
                placeholder="Max"
                min="0"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* Dual range slider */}
            {(() => {
              const minVal = priceMin === "" ? 0 : Math.min(Number(priceMin), SLIDER_MAX);
              const maxVal = priceMax === "" ? SLIDER_MAX : Math.max(Number(priceMax), 0);
              const minPct = (minVal / SLIDER_MAX) * 100;
              const maxPct = (maxVal / SLIDER_MAX) * 100;
              const thumbCls =
                "absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent " +
                "[&::-webkit-slider-runnable-track]:h-0 [&::-webkit-slider-runnable-track]:bg-transparent " +
                "[&::-webkit-slider-thumb]:mt-0 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 " +
                "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full " +
                "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white " +
                "[&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:shadow-md " +
                "[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 " +
                "[&::-moz-range-track]:bg-transparent " +
                "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full " +
                "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white " +
                "[&::-moz-range-thumb]:bg-primary-600 [&::-moz-range-thumb]:shadow-md";
              return (
                <div className="mt-5 mb-1">
                  {/* Track + thumbs */}
                  <div className="relative flex h-4 items-center">
                    {/* Track background */}
                    <div className="absolute left-0 right-0 h-1.5 rounded-full bg-gray-200 dark:bg-gray-600">
                      {/* Active fill */}
                      <div
                        className="absolute h-1.5 rounded-full bg-primary-500"
                        style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
                      />
                    </div>

                    {/* Min thumb */}
                    <input
                      type="range"
                      min={0}
                      max={SLIDER_MAX}
                      step={SLIDER_STEP}
                      value={minVal}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v <= maxVal - SLIDER_STEP) {
                          setPriceMin(v === 0 ? "" : String(v));
                        }
                      }}
                      className={thumbCls}
                      style={{ zIndex: minVal >= maxVal - SLIDER_STEP ? 5 : 3 }}
                    />

                    {/* Max thumb */}
                    <input
                      type="range"
                      min={0}
                      max={SLIDER_MAX}
                      step={SLIDER_STEP}
                      value={maxVal}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v >= minVal + SLIDER_STEP) {
                          setPriceMax(v === SLIDER_MAX ? "" : String(v));
                        }
                      }}
                      className={thumbCls}
                      style={{ zIndex: 4 }}
                    />
                  </div>

                  {/* Min / max labels */}
                  <div className="mt-2 flex justify-between text-xs text-gray-400 dark:text-gray-500">
                    <span>৳0</span>
                    <span>৳50,000</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Star Rating */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Star Rating
            </label>
            <div className="flex flex-wrap gap-2">
              {STAR_RATINGS.map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => toggleStar(star)}
                  className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    selectedStars.includes(star)
                      ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  {star}
                  <svg
                    className="h-3.5 w-3.5 fill-current text-amber-400"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Amenities
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AMENITIES.map((amenity) => (
                <label
                  key={amenity}
                  className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-gray-200 px-3 py-2.5 transition-colors has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 hover:bg-gray-50 dark:border-gray-600 dark:has-[:checked]:bg-primary-900/30 dark:hover:bg-gray-700/50"
                >
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 accent-primary-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {amenity}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-medium text-gray-600 underline-offset-2 transition-colors hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
          >
            Reset all{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 active:bg-primary-800"
          >
            Show Results
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
