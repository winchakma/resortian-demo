"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPopularDestinations } from "@/utils/api";
import type { Destination } from "@/types";

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
    <section className="bg-gray-50 py-16 dark:bg-gray-900/40 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Get inspired for your next trip
          </h2>
        </div>

        {/* Carousel Scroll Wrapper */}
        <div className="relative group">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Anywhere Card */}
            <div className="w-[150px] sm:w-[170px] shrink-0 snap-start snap-always">
              <Link
                href="/hotels"
                className="group relative block aspect-[1.5] overflow-visible rounded-2xl bg-blue-700 shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="relative w-full h-full overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=300&fit=crop"
                    alt="Globe"
                    fill
                    unoptimized
                    className="object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                    sizes="170px"
                  />
                  <div className="absolute inset-0 bg-blue-900/30" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-extrabold text-base leading-tight">
                      Anywhere
                    </h3>
                  </div>
                </div>
                {/* Speech bubble pointer */}
                <div className="absolute bottom-[-6px] left-[25%] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-blue-700 z-10" />
              </Link>
            </div>

            {/* Destination Cards */}
            {destinations.map((d, index) => (
              <div
                key={d.id}
                className="w-[180px] sm:w-[210px] shrink-0 snap-start snap-always"
              >
                <Link
                  href={`/hotels?location=${encodeURIComponent(d.name)}`}
                  className="group relative block aspect-[1.5] overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-850 shadow-md transition-shadow hover:shadow-lg"
                >
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 180px, 210px"
                  />
                  
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute left-3 top-3 rounded bg-white/90 px-2 py-0.5 text-[9px] font-bold text-gray-700 shadow-sm dark:bg-gray-900/90 dark:text-gray-200">
                    {categories[index % categories.length]}
                  </div>

                  {/* Text Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-extrabold text-sm sm:text-base leading-tight truncate group-hover:text-primary-300 transition-colors">
                      {d.name}
                    </h3>
                  </div>
                </Link>
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

      </div>
    </section>
  );
}
