"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ChevronLeft, ChevronRight, Flame, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { getPopularDestinations } from "@/utils/api";
import type { Destination } from "@/types";

const HOVER_THEMES = [
  { 
    borderClass: "hover:border-[#FF385C] data-[mobile-active=true]:border-[#FF385C]", 
    textHoverClass: "group-hover/card:text-[#FF385C] group-data-[mobile-active=true]/card:text-[#FF385C]", 
    badgeClass: "group-hover/card:bg-[#FF385C] group-data-[mobile-active=true]/card:bg-[#FF385C] group-hover/card:text-white group-data-[mobile-active=true]/card:text-white",
    reviewBgClass: "bg-[#FF385C]/10 dark:bg-[#FF385C]/20",
    reviewTextClass: "text-[#FF385C]"
  }, // Coral
  { 
    borderClass: "hover:border-[#0D9488] data-[mobile-active=true]:border-[#0D9488]", 
    textHoverClass: "group-hover/card:text-[#0D9488] group-data-[mobile-active=true]/card:text-[#0D9488]", 
    badgeClass: "group-hover/card:bg-[#0D9488] group-data-[mobile-active=true]/card:bg-[#0D9488] group-hover/card:text-white group-data-[mobile-active=true]/card:text-white",
    reviewBgClass: "bg-[#0D9488]/10 dark:bg-[#0D9488]/20",
    reviewTextClass: "text-[#0D9488]"
  }, // Teal
  { 
    borderClass: "hover:border-[#D4A574] data-[mobile-active=true]:border-[#D4A574]", 
    textHoverClass: "group-hover/card:text-[#D4A574] group-data-[mobile-active=true]/card:text-[#D4A574]", 
    badgeClass: "group-hover/card:bg-[#D4A574] group-data-[mobile-active=true]/card:bg-[#D4A574] group-hover/card:text-gray-900 group-data-[mobile-active=true]/card:text-gray-900",
    reviewBgClass: "bg-[#D4A574]/10 dark:bg-[#D4A574]/20",
    reviewTextClass: "text-[#D4A574]"
  }, // Gold
  { 
    borderClass: "hover:border-[#34A853] data-[mobile-active=true]:border-[#34A853]", 
    textHoverClass: "group-hover/card:text-[#34A853] group-data-[mobile-active=true]/card:text-[#34A853]", 
    badgeClass: "group-hover/card:bg-[#34A853] group-data-[mobile-active=true]/card:bg-[#34A853] group-hover/card:text-white group-data-[mobile-active=true]/card:text-white",
    reviewBgClass: "bg-[#34A853]/10 dark:bg-[#34A853]/20",
    reviewTextClass: "text-[#34A853]"
  }, // Green
];

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
  const [lastAction, setLastAction] = useState<{ id: string; type: "saved" | "removed" } | null>(null);

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

      setLastAction({ id, type: willBeFav ? "saved" : "removed" });
      setTimeout(() => {
        setLastAction((current) => (current?.id === id ? null : current));
      }, 4000);
      
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
    <section className="bg-white py-3 sm:py-5 dark:bg-gray-950 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="relative z-10 mb-8 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-display font-bold text-black dark:text-white sm:text-3xl lg:text-4xl">
            Highly-Rated Gems Handpicked for You
          </h2>
          <Link
            href="/hotels"
            className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 text-sm font-semibold text-primary-600 hover:underline"
          >
            See more gems
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Scrollable Area */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 pt-8 -mt-8 -mx-4 px-4 md:-ml-6 md:pl-6 md:mr-0 md:pr-0 scroll-px-4 md:scroll-px-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {places.map((place, index) => {
              const reviews = reviewsData[index % reviewsData.length];
              const isFav = !!favorites[place.id];
              const theme = HOVER_THEMES[index % HOVER_THEMES.length];
              
              return (
                <div
                  key={place.id}
                  className="relative w-[85vw] sm:w-[260px] md:w-[calc(33.333%-24px)] lg:w-[calc(25%-24px)] shrink-0 snap-start snap-always"
                >
                  <Link
                    href={`/hotels?location=${encodeURIComponent(place.name)}`}
                    className={`group/card relative flex flex-col h-[380px] sm:h-[400px] w-full rounded-3xl bg-gradient-to-b from-white to-[#f0f4ff] dark:from-gray-900 dark:to-gray-800 p-2 cursor-pointer shadow-lg hover:scale-[1.02] hover:shadow-2xl data-[mobile-active=true]:shadow-2xl border-2 border-transparent transition-all duration-300 ${theme.borderClass}`}
                  >
                    <div className="relative w-full h-[220px] shrink-0 overflow-hidden rounded-2xl">
                      <Image
                        src={place.image}
                        alt={place.name}
                        fill
                        unoptimized
                        className="object-cover object-center transition-transform duration-500 group-hover/card:scale-105"
                        sizes="(max-width: 640px) 260px, 25vw"
                      />
                      {/* Trip Best Badge */}
                      <div className={`absolute left-3 top-3 flex items-center rounded-md bg-gold-500/95 backdrop-blur-md px-2 py-1 text-[13px] font-extrabold text-white shadow-sm transition-colors duration-300 ${theme.badgeClass}`}>
                        <span className="flex items-end leading-none tracking-tight">
                          Trip<div className="w-[3.5px] h-[3.5px] bg-white mx-[2px] mb-[1.5px] rounded-full"></div>Best
                        </span>
                      </div>
                    </div>

                    {/* Content Panel */}
                    <div className="flex flex-col items-start p-3 pt-4 text-black dark:text-white">
                      {/* Location and Fire Rating Badge */}
                      <div className="mb-2 inline-flex items-center overflow-hidden rounded-md text-[11px] font-bold shadow-sm border border-gray-200 dark:border-gray-700">
                        <span className="bg-white dark:bg-gray-800 px-2 py-0.5 text-black dark:text-white">
                          {place.name.split(" ")[0]}
                        </span>
                        <span className="flex items-center gap-0.5 bg-coral-500 px-2 py-0.5 text-white">
                          <Flame className="h-3 w-3 fill-current" /> 
                          {reviews.rating === "4.9" || reviews.rating === "4.8" ? "10" : "9.7"}
                        </span>
                      </div>

                      <h3 className={`text-lg sm:text-xl font-bold leading-tight transition-colors duration-300 ${theme.textHoverClass}`}>
                        {place.name}
                      </h3>
                      
                      {/* Review Section with subtle tint */}
                      <div className={`mt-2 inline-block rounded-lg px-2.5 py-1 ${theme.reviewBgClass}`}>
                        <p className={`text-xs font-bold ${theme.reviewTextClass}`}>
                          {reviews.rating}/5 · {reviews.count} reviews
                        </p>
                      </div>
                    </div>
                  </Link>

                  {/* Favorite Heart Button & Tooltip Wrapper - Placed outside the Link to prevent hydration/routing issues */}
                  <div className="absolute right-3 top-3 z-20 flex flex-col items-end">
                    {/* Tooltip */}
                    {lastAction?.id === place.id && (
                      <div className="absolute bottom-full right-[-4px] mb-3 w-max animate-in fade-in zoom-in duration-200">
                        <div className="relative flex items-center gap-8 rounded border border-gray-200 bg-white px-4 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                          <span className="text-[13px] text-gray-800">
                            {lastAction.type === "saved" ? "Saved" : "Removed"}
                          </span>
                          {lastAction.type === "saved" && (
                            <Link href="/favorites" className="flex items-center text-[13px] text-blue-600 hover:text-blue-700">
                              View <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                            </Link>
                          )}
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
                          isFav ? "text-coral-500" : "text-gray-400 group-hover/card:text-primary-500"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all hover:bg-gray-50 hover:scale-105"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all hover:bg-gray-50 hover:scale-105"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
