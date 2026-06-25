"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HotelCard } from "./HotelCard";
import type { Hotel } from "@/types";

interface FeaturedStaysSliderProps {
  hotels: Hotel[];
}

const PAGE_SIZE = 4;

export function FeaturedStaysSlider({ hotels }: FeaturedStaysSliderProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(hotels.length / PAGE_SIZE);
  const visible = hotels.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="relative">
      {/* 4-column grid — same layout as original */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((hotel) => (
          <div key={hotel.id}>
            <HotelCard hotel={hotel} />
          </div>
        ))}
      </div>

      {/* Navigation row */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition-all hover:bg-gray-50 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Page dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-2 rounded-full transition-all ${
                  i === page
                    ? "w-6 bg-primary-600"
                    : "w-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                }`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition-all hover:bg-gray-50 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
