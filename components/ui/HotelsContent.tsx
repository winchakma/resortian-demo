"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MapPin,
  LayoutGrid,
  List as ListIcon,
  ChevronDown,
  Search,
} from "lucide-react";
import type { Hotel } from "@/types";
import { HotelCard } from "@/components/ui/HotelCard";
import { SearchForm } from "@/components/ui/SearchForm";
import type { SearchFormData } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HotelsContentProps {
  hotels: Hotel[];
  searchParams: {
    location?: string;
    checkIn?: string;
    checkOut?: string;
    adults?: string;
    children?: string;
    rooms?: string;
    sortBy?: string;
  };
}

type ViewMode = "list" | "grid";

// ─── HotelListCard ─────────────────────────────────────────────────────────────

function HotelListCard({ hotel }: { hotel: Hotel }) {
  return (
    <Link
      href={`/hotels/${hotel.slug}`}
      className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
    >
      <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900 sm:flex-row">
        {/* Image */}
        <div className="relative h-56 flex-shrink-0 overflow-hidden sm:h-auto sm:w-64 lg:w-72">
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 288px"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {hotel.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur-sm dark:bg-gray-900/90 dark:text-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-5 lg:p-6">
          <div>
            {/* Rating row */}
            <div className="mb-2.5 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {hotel.rating}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({hotel.reviewCount} reviews)
              </span>
              {hotel.rating >= 4.8 && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Exceptional
                </span>
              )}
            </div>

            {/* Name */}
            <h3 className="mb-1 text-lg font-bold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
              {hotel.name}
            </h3>

            {/* Location */}
            <div className="mb-3 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{hotel.location}</span>
            </div>

            {/* Description */}
            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {hotel.description}
            </p>

            {/* Amenity chips */}
            <div className="flex flex-wrap gap-1.5">
              {hotel.amenities.slice(0, 5).map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {amenity}
                </span>
              ))}
              {hotel.amenities.length > 5 && (
                <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  +{hotel.amenities.length - 5} more
                </span>
              )}
            </div>
          </div>

          {/* Price + CTA */}
          <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Starting from
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  ৳{hotel.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  /night
                </span>
              </div>
            </div>
            <div className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-primary-600 px-5 text-sm font-semibold text-white transition-colors group-hover:bg-primary-700">
              View Details →
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── HotelsContent ─────────────────────────────────────────────────────────────

export function HotelsContent({ hotels, searchParams }: HotelsContentProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const currentSort = searchParams.sortBy ?? "recommended";

  const handleSortChange = useCallback(
    (sortBy: string) => {
      const params = new URLSearchParams();
      if (searchParams.location) params.set("location", searchParams.location);
      if (searchParams.checkIn) params.set("checkIn", searchParams.checkIn);
      if (searchParams.checkOut) params.set("checkOut", searchParams.checkOut);
      if (searchParams.adults) params.set("adults", searchParams.adults);
      if (searchParams.children) params.set("children", searchParams.children);
      if (searchParams.rooms) params.set("rooms", searchParams.rooms);
      if (sortBy !== "recommended") params.set("sortBy", sortBy);
      router.push(`/hotels?${params.toString()}`);
    },
    [searchParams, router],
  );

  // Build initialValues for the shared SearchForm
  const initialValues: Partial<SearchFormData> = {
    location: searchParams.location ?? "",
    checkIn: searchParams.checkIn ?? "",
    checkOut: searchParams.checkOut ?? "",
    adults: searchParams.adults ? Number(searchParams.adults) : 2,
    children: searchParams.children ? Number(searchParams.children) : 0,
    rooms: searchParams.rooms ? Number(searchParams.rooms) : 1,
  };

  // Build a readable title
  const pageTitle = searchParams.location
    ? `Properties in ${searchParams.location}`
    : "All Properties in Bangladesh";

  // Stay summary for the hero
  const stayLabel =
    searchParams.checkIn && searchParams.checkOut
      ? `${searchParams.checkIn} → ${searchParams.checkOut}`
      : searchParams.checkIn
        ? `From ${searchParams.checkIn}`
        : null;

  const guestLabel = searchParams.adults
    ? [
        `${searchParams.adults} Adult${Number(searchParams.adults) > 1 ? "s" : ""}`,
        searchParams.children && Number(searchParams.children) > 0
          ? `${searchParams.children} Child${Number(searchParams.children) > 1 ? "ren" : ""}`
          : null,
        `${searchParams.rooms ?? 1} Room`,
      ]
        .filter(Boolean)
        .join(" · ")
    : null;

  return (
    <div>
      {/* ── Hero banner ────────────────────────────────────────────── */}
      <div className="relative z-10 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 pb-8 pt-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <p className="mb-2 text-sm font-medium text-primary-100">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            {" / "}
            <span className="text-white">Hotels</span>
          </p>

          {/* Title */}
          <h1 className="mb-1 text-2xl font-bold text-white sm:text-3xl">
            {pageTitle}
          </h1>
          <p className="mb-6 text-sm text-primary-100">
            {hotels.length} {hotels.length === 1 ? "property" : "properties"}{" "}
            available
            {stayLabel ? ` · ${stayLabel}` : ""}
            {guestLabel ? ` · ${guestLabel}` : ""}
          </p>

          {/* ── Search form (shared component, pre-filled) ── */}
          <SearchForm initialValues={initialValues} />
        </div>
      </div>

      {/* ── Results area ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Results bar */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {hotels.length === 0
              ? "No hotels found"
              : `${hotels.length} ${hotels.length === 1 ? "hotel" : "hotels"} found`}
            {searchParams.location ? (
              <span className="font-normal text-gray-500 dark:text-gray-400">
                {" "}
                in &ldquo;{searchParams.location}&rdquo;
              </span>
            ) : null}
          </p>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <div className="relative">
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none rounded-xl border border-gray-200 bg-white py-2 pl-4 pr-9 text-sm text-gray-700 outline-none transition-colors focus:border-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
                <option value="reviews">Most Reviews</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>

            {/* View toggle */}
            <div className="hidden items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900 sm:flex">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={`rounded-lg p-2 transition-colors ${
                  viewMode === "list"
                    ? "bg-primary-600 text-white"
                    : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <ListIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={`rounded-lg p-2 transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary-600 text-white"
                    : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Hotel cards */}
        {hotels.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-20 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Search className="h-7 w-7 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              No hotels found
            </h3>
            <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
              Try searching for a different location or adjusting your dates.
            </p>
            <Link
              href="/hotels"
              className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              View all hotels
            </Link>
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-4">
            {hotels.map((hotel) => (
              <HotelListCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
