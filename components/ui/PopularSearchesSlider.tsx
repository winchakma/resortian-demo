"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Destination } from "@/types";

interface PopularSearchesSliderProps {
  destinations: Destination[];
}

export function PopularSearchesSlider({ destinations }: PopularSearchesSliderProps) {
  const [activeTab, setActiveTab] = useState<"cities" | "destinations">("destinations");
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

  // Mock filtering: Cities vs Destinations
  // Dhaka, Chittagong, Sylhet are cities. Others are destinations.
  const filtered = destinations.filter((d) => {
    const isCity = ["Dhaka", "Chittagong", "Sylhet"].includes(d.name);
    return activeTab === "cities" ? isCity : !isCity;
  });

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 dark:border-gray-800 mb-6">
        <button
          onClick={() => setActiveTab("destinations")}
          className={`pb-2 text-sm font-semibold transition-colors relative ${
            activeTab === "destinations"
              ? "text-[#007fcd]"
              : "text-black hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          Destinations
          {activeTab === "destinations" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007fcd]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("cities")}
          className={`pb-2 text-sm font-semibold transition-colors relative ${
            activeTab === "cities"
              ? "text-[#007fcd]"
              : "text-black hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          Cities
          {activeTab === "cities" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007fcd]" />
          )}
        </button>
      </div>

      {/* Slider container */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filtered.map((d) => {
            const avgPrice = Math.floor(2200 + (d.propertyCount % 5) * 600);
            return (
              <div
                key={d.id}
                className="w-[180px] sm:w-[220px] shrink-0 snap-start snap-always"
              >
                <Link
                  href={`/hotels?location=${encodeURIComponent(d.name)}`}
                  className="group block overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 transition hover:shadow-md h-full"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 150px, 200px"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-sm text-black dark:text-white group-hover:text-[#007fcd] transition-colors truncate">
                      {d.name}
                    </h4>
                    <p className="text-xs text-black dark:text-gray-400 mt-0.5">
                      {d.propertyCount} properties
                    </p>
                    <div className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-500">
                      Avg. ৳{avgPrice.toLocaleString()} / night
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        {filtered.length > 3 && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-black shadow-md backdrop-blur-sm transition hover:bg-white hover:text-black dark:border-gray-800 dark:bg-gray-900/90 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={() => scroll("right")}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-black shadow-md backdrop-blur-sm transition hover:bg-white hover:text-black dark:border-gray-800 dark:bg-gray-900/90 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
