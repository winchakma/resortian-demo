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
      <div className="relative overflow-hidden -mx-4 px-4 py-2 -my-2">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 px-4 -mx-4 scroll-px-4"
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
                  className="group block overflow-hidden rounded-3xl premium-hover hover:scale-[1.03] hover:shadow-2xl shadow-lg relative h-[260px] cursor-pointer"
                >
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    unoptimized
                    className="object-cover transition-all duration-500 group-hover:scale-[1.08] group-hover:blur-[1px]"
                    sizes="(max-width: 640px) 150px, 200px"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-primary-950/40 to-transparent transition-opacity" />
                  
                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h4 className="font-extrabold text-xl text-white group-hover:text-primary-300 transition-colors drop-shadow-md">
                      {d.name}
                    </h4>
                    <p className="text-sm font-medium text-gray-200 mt-0.5 drop-shadow">
                      {d.propertyCount} properties
                    </p>
                    <div className="mt-3 inline-flex items-center rounded-full bg-primary-600 px-3 py-1 text-xs font-extrabold text-white shadow-sm border border-white/20 premium-glass">
                      Avg. ৳{avgPrice.toLocaleString()}
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
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-primary-600 text-white shadow-md premium-hover hover:scale-110 hover:shadow-lg hover:bg-primary-700"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={() => scroll("right")}
              className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-primary-600 text-white shadow-md premium-hover hover:scale-110 hover:shadow-lg hover:bg-primary-700"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
