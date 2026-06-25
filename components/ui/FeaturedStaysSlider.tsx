"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HotelCard } from "./HotelCard";
import type { Hotel } from "@/types";

interface FeaturedStaysSliderProps {
  hotels: Hotel[];
}

export function FeaturedStaysSlider({ hotels }: FeaturedStaysSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth * 0.75
          : scrollLeft + clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="w-[280px] sm:w-[300px] shrink-0 snap-start snap-always"
          >
            <HotelCard hotel={hotel} />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow-md backdrop-blur-sm transition hover:bg-white hover:text-black dark:border-gray-800 dark:bg-gray-900/90 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow-md backdrop-blur-sm transition hover:bg-white hover:text-black dark:border-gray-800 dark:bg-gray-900/90 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
