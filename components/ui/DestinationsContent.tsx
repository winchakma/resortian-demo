"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Building2, ArrowRight, X } from "lucide-react";
import type { Destination } from "@/types";

interface DestinationsContentProps {
  destinations: Destination[];
}

export function DestinationsContent({ destinations }: DestinationsContentProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return destinations;
    return destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.highlights.some((h) => h.toLowerCase().includes(q)),
    );
  }, [query, destinations]);

  // Unique regions for the result bar
  const regions = useMemo(
    () => Array.from(new Set(destinations.map((d) => d.region))).sort(),
    [destinations],
  );

  return (
    <div>
      {/* ── Hero banner ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 pb-10 pt-10">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <p className="mb-2 text-sm font-medium text-primary-100">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            {" / "}
            <span className="text-white">Destinations</span>
          </p>

          <h1 className="mb-1 text-2xl font-bold text-white sm:text-3xl">
            Explore Bangladesh
          </h1>
          <p className="mb-7 text-sm text-primary-100">
            {destinations.length} destinations ·{" "}
            {destinations.reduce((sum, d) => sum + d.propertyCount, 0).toLocaleString()}+ properties across the country
          </p>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations, regions, or experiences…"
              className="w-full rounded-2xl border-0 bg-white py-4 pl-12 pr-12 text-sm text-gray-900 shadow-lg placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary-400 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 dark:focus:ring-primary-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Results bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {filtered.length === 0
              ? "No destinations found"
              : filtered.length === destinations.length
                ? `All ${destinations.length} destinations`
                : `${filtered.length} destination${filtered.length !== 1 ? "s" : ""} found`}
            {query && (
              <span className="ml-1 font-normal text-gray-400 dark:text-gray-500">
                for &ldquo;{query}&rdquo;
              </span>
            )}
          </p>

          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setQuery(region)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  query === region
                    ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-950/30 dark:text-primary-400"
                    : "border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:text-primary-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-primary-700 dark:hover:text-primary-400"
                }`}
              >
                {region}
              </button>
            ))}
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Destination grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-20 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Search className="h-7 w-7 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              No destinations found
            </h3>
            <p className="mb-5 max-w-xs text-sm text-gray-500 dark:text-gray-400">
              Try a different name, region, or experience.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              Show all destinations
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Rich Destination Card ──────────────────────────────────────────────────

function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      href={`/hotels?location=${encodeURIComponent(destination.name)}`}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
    >
      <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Region badge */}
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur-sm dark:bg-gray-900/90 dark:text-gray-200">
              <MapPin className="h-3 w-3 text-primary-600" />
              {destination.region}
            </span>
          </div>

          {/* Property count badge */}
          <div className="absolute right-3 top-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-600/90 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
              <Building2 className="h-3 w-3" />
              {destination.propertyCount}+ stays
            </span>
          </div>

          {/* Destination name at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
            <h2 className="text-xl font-bold text-white drop-shadow-sm">
              {destination.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {destination.description}
          </p>

          {/* Highlights */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            {destination.highlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 dark:bg-primary-950/30 dark:text-primary-400"
              >
                {highlight}
              </span>
            ))}
          </div>

          {/* CTA row */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {destination.propertyCount} properties available
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors group-hover:text-primary-700 dark:text-primary-400 dark:group-hover:text-primary-300">
              Explore
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
