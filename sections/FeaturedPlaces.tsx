"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import toast from "react-hot-toast";
import { getPopularDestinations } from "@/utils/api";
import type { Destination } from "@/types";

export function FeaturedPlaces() {
  const [places, setPlaces] = useState<Destination[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPopularDestinations().then((data) => {
      setPlaces(data); // Display all places to allow scrolling
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

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("resortian_favorites");
      if (saved) setFavorites(JSON.parse(saved));
    } catch (err) {}
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFavorites((prev) => {
      const willBeFav = !prev[id];
      const newFavs = { ...prev, [id]: willBeFav };
      
      try {
        localStorage.setItem("resortian_favorites", JSON.stringify(newFavs));
      } catch (err) {}

      if (willBeFav) {
        setLastSavedId(id);
        setTimeout(() => {
          setLastSavedId((current) => (current === id ? null : current));
        }, 4000);
      } else {
        setLastSavedId(null);
      }
      
      return newFavs;
    });
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
    <section className="bg-white py-4 dark:bg-gray-950 sm:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
            Places you may like
          </h2>
          <Link href="/hotels" className="text-sm font-semibold text-gray-600 hover:text-black dark:text-gray-300 flex items-center transition-colors">
            More <ChevronRight className="h-4 w-4 ml-0.5" />
          </Link>
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
              const isFav = !!favorites[place.id];
              return (
                <div
                  key={place.id}
                  className="w-[260px] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] shrink-0 snap-start snap-always"
                >
                  <Link
                    href={`/hotels?location=${encodeURIComponent(place.name)}`}
                    className="group relative block h-[340px] sm:h-[380px] w-full overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <Image
                      src={place.image}
                      alt={place.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 260px, 25vw"
                    />
                    
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* Trip Best Badge */}
                    <div className="absolute left-3 top-3 flex items-center rounded-md bg-[#fdf4e3] px-2 py-1 text-[13px] font-extrabold text-[#5c3a21] shadow-sm">
                      <span className="flex items-end leading-none tracking-tight">
                        Trip<div className="w-[3.5px] h-[3.5px] bg-[#f5a623] mx-[2px] mb-[1.5px]"></div>Best
                      </span>
                    </div>

                    {/* Favorite Heart Button & Tooltip Wrapper */}
                    <div className="absolute right-3 top-3 z-20 flex flex-col items-end">
                      {/* Tooltip */}
                      {lastSavedId === place.id && (
                        <div className="absolute bottom-full right-[-4px] mb-3 w-max animate-in fade-in zoom-in duration-200">
                          <div className="relative flex items-center gap-8 rounded border border-gray-200 bg-white px-4 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                            <span className="text-[13px] text-gray-800">Saved</span>
                            <Link href="/favorites" className="flex items-center text-[13px] text-blue-600 hover:text-blue-700">
                              View <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                            </Link>
                            {/* Little downward pointing triangle */}
                            <div className="absolute -bottom-[5px] right-5 h-[10px] w-[10px] rotate-45 border-b border-r border-gray-200 bg-white" />
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(place.id, e)}
                        aria-label="Add to favorites"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-md transition hover:scale-110 active:scale-95"
                      >
                        <Heart
                          fill={isFav ? "currentColor" : "none"}
                          className={`h-4 w-4 transition-colors pointer-events-none ${
                            isFav ? "text-[#ff4d4f]" : "text-gray-700"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Content Panel */}
                    <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start text-white">
                      {/* Location and Fire Rating Badge */}
                      <div className="mb-2 inline-flex items-center overflow-hidden rounded-sm text-[11px] font-bold shadow-sm transition-all">
                        <span className="bg-white/90 px-1.5 py-0.5 text-black">
                          {place.name.split(" ")[0]}
                        </span>
                        <span className="flex items-center gap-0.5 bg-[#e12d2d] px-1.5 py-0.5 text-white">
                          <Flame className="h-3 w-3 fill-current" /> 
                          {reviews.rating === "4.9" || reviews.rating === "4.8" ? "10" : "9.7"}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold leading-tight drop-shadow-md">
                        {place.name}
                      </h3>
                      
                      <p className="mt-1 text-xs text-white/90 drop-shadow-md">
                        {reviews.rating}/5 · {reviews.count} reviews
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all hover:bg-gray-50 hover:scale-105"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all hover:bg-gray-50 hover:scale-105"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
