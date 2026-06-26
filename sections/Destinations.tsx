"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPopularDestinations } from "@/utils/api";
import type { Destination } from "@/types";

const HOVER_THEMES = [
  { 
    borderClass: "hover:border-[#FF385C]", 
    textHoverClass: "group-hover/card:text-[#FF385C]", 
    badgeClass: "group-hover/card:bg-[#FF385C] group-hover/card:text-white",
    reviewBgClass: "bg-[#FF385C]/10 dark:bg-[#FF385C]/20",
    reviewTextClass: "text-[#FF385C]"
  }, // Coral
  { 
    borderClass: "hover:border-[#0D9488]", 
    textHoverClass: "group-hover/card:text-[#0D9488]", 
    badgeClass: "group-hover/card:bg-[#0D9488] group-hover/card:text-white",
    reviewBgClass: "bg-[#0D9488]/10 dark:bg-[#0D9488]/20",
    reviewTextClass: "text-[#0D9488]"
  }, // Teal
  { 
    borderClass: "hover:border-[#D4A574]", 
    textHoverClass: "group-hover/card:text-[#D4A574]", 
    badgeClass: "group-hover/card:bg-[#D4A574] group-hover/card:text-gray-900",
    reviewBgClass: "bg-[#D4A574]/10 dark:bg-[#D4A574]/20",
    reviewTextClass: "text-[#D4A574]"
  }, // Gold
  { 
    borderClass: "hover:border-[#34A853]", 
    textHoverClass: "group-hover/card:text-[#34A853]", 
    badgeClass: "group-hover/card:bg-[#34A853] group-hover/card:text-white",
    reviewBgClass: "bg-[#34A853]/10 dark:bg-[#34A853]/20",
    reviewTextClass: "text-[#34A853]"
  }, // Green
];

export function Destinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPopularDestinations().then((data) => {
      setDestinations(data);
    });
  }, []);

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

  const categories = ["Short haul", "Medium haul", "Long haul", "Short haul", "Medium haul", "Long haul"];

  if (destinations.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-4 dark:bg-gray-900/40 sm:py-6 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="relative z-10 mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-black dark:text-white sm:text-3xl lg:text-4xl">
            Get inspired for your next trip
          </h2>
        </div>

        {/* Carousel Scroll Wrapper */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-4 -mt-4 -mx-4 px-4 md:-mx-6 md:px-6 scroll-px-4 md:scroll-px-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Destination Cards */}
            {destinations.map((d, index) => {
              const theme = HOVER_THEMES[index % HOVER_THEMES.length];
              
              return (
              <div
                key={d.id}
                className="w-[85vw] sm:w-[240px] md:w-[calc(33.333%-16px)] lg:w-[calc(20%-18px)] shrink-0 snap-start snap-always"
              >
                <Link
                  href={`/hotels?location=${encodeURIComponent(d.name)}`}
                  className={`group/card relative block aspect-[1.5] overflow-hidden rounded-xl border-2 border-transparent bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${theme.borderClass}`}
                >
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                    sizes="(max-width: 640px) 200px, (max-width: 1024px) 33vw, 20vw"
                  />
                  
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover/card:opacity-90" />

                  {/* Category Badge */}
                  <div className={`absolute left-3 top-3 rounded bg-white/95 px-2 py-0.5 text-[10px] font-bold text-gray-800 shadow-sm transition-colors duration-300 dark:bg-slate-900/95 dark:text-gray-200 ${theme.badgeClass}`}>
                    {categories[index % categories.length]}
                  </div>

                  {/* Text Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className={`font-extrabold text-lg sm:text-xl leading-tight truncate drop-shadow-md transition-colors duration-300 ${theme.textHoverClass}`}>
                      {d.name}
                    </h3>
                  </div>
                </Link>
              </div>
            );})}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all hover:bg-gray-50 hover:scale-105 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all hover:bg-gray-50 hover:scale-105 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
