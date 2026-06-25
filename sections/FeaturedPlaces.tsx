"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { getPopularDestinations } from "@/utils/api";
import type { Destination } from "@/types";

export function FeaturedPlaces() {
  const [places, setPlaces] = useState<Destination[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPopularDestinations().then((data) => {
      setPlaces(data.slice(0, 6)); // Display up to 6 places in the slider
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

  const reviewsData = [
    { rating: "4.8", count: "12,450" },
    { rating: "4.7", count: "8,920" },
    { rating: "4.9", count: "15,210" },
    { rating: "4.6", count: "6,840" },
    { rating: "4.8", count: "10,120" },
    { rating: "4.7", count: "9,430" },
  ];

  if (places.length === 0) {
    return null; // or loading skeleton
  }

  return (
    <section className="bg-white py-16 dark:bg-gray-950 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Places you may like
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Highly-rated stays and hot spots recommended for you
            </p>
          </div>
        </div>

        {/* Slider Container */}
        <div className="relative group">
          {/* Scrollable Area */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {places.map((place, index) => {
              const reviews = reviewsData[index % reviewsData.length];
              return (
                <div
                  key={place.id}
                  className="w-[280px] sm:w-[300px] shrink-0 snap-start snap-always"
                >
                  <div className="group/card relative flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={place.image}
                        alt={place.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                        sizes="(max-width: 640px) 280px, 300px"
                      />
                      
                      {/* Trip Best Badge */}
                      <div className="absolute left-3 top-3 rounded-lg bg-orange-600/90 px-2.5 py-1 text-[10px] font-extrabold text-white uppercase tracking-wider backdrop-blur-sm border border-orange-500/20">
                        Trip.Best
                      </div>

                      {/* Favorite Heart Button */}
                      <button
                        type="button"
                        aria-label="Add to favorites"
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-sm transition hover:bg-white hover:text-red-500 dark:bg-gray-800/95 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-red-400"
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Content Panel */}
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover/card:text-primary-600 transition-colors">
                          {place.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                          {place.region}
                        </p>
                      </div>

                      {/* Ratings and Reviews */}
                      <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                        <span className="flex items-center gap-0.5 rounded bg-primary-50 px-1.5 py-0.5 text-xs font-bold text-primary-750 dark:bg-primary-950/40 dark:text-primary-400">
                          <Star className="h-3 w-3 fill-current text-primary-600 dark:text-primary-400" />
                          {reviews.rating}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {reviews.count} reviews
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
