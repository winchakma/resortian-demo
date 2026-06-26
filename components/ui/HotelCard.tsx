"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Heart, ChevronRight, ArrowRight } from "lucide-react";
import type { Hotel } from "@/types";

interface HotelCardProps {
  hotel: Hotel;
}

const HOVER_THEMES = [
  { 
    borderClass: "hover:border-[#FF385C] data-[mobile-active=true]:border-[#FF385C]", 
    textHoverClass: "group-hover:text-[#FF385C] group-data-[mobile-active=true]:text-[#FF385C]", 
    buttonHoverClass: "group-hover:bg-[#FF385C] group-data-[mobile-active=true]:bg-[#FF385C] group-hover:border-transparent group-data-[mobile-active=true]:border-transparent group-hover:text-white group-data-[mobile-active=true]:text-white", 
    badgeClass: "bg-[#FF385C]",
    tagHoverClass: "group-hover:bg-[#FF385C] group-data-[mobile-active=true]:bg-[#FF385C] group-hover:text-white group-data-[mobile-active=true]:text-white"
  }, // Coral
  { 
    borderClass: "hover:border-[#0D9488] data-[mobile-active=true]:border-[#0D9488]", 
    textHoverClass: "group-hover:text-[#0D9488] group-data-[mobile-active=true]:text-[#0D9488]", 
    buttonHoverClass: "group-hover:bg-[#0D9488] group-data-[mobile-active=true]:bg-[#0D9488] group-hover:border-transparent group-data-[mobile-active=true]:border-transparent group-hover:text-white group-data-[mobile-active=true]:text-white", 
    badgeClass: "bg-[#0D9488]",
    tagHoverClass: "group-hover:bg-[#0D9488] group-data-[mobile-active=true]:bg-[#0D9488] group-hover:text-white group-data-[mobile-active=true]:text-white"
  }, // Teal
  { 
    borderClass: "hover:border-[#D4A574] data-[mobile-active=true]:border-[#D4A574]", 
    textHoverClass: "group-hover:text-[#D4A574] group-data-[mobile-active=true]:text-[#D4A574]", 
    buttonHoverClass: "group-hover:bg-[#D4A574] group-data-[mobile-active=true]:bg-[#D4A574] group-hover:border-transparent group-data-[mobile-active=true]:border-transparent group-hover:text-gray-900 group-data-[mobile-active=true]:text-gray-900", 
    badgeClass: "bg-[#D4A574]",
    tagHoverClass: "group-hover:bg-[#D4A574] group-data-[mobile-active=true]:bg-[#D4A574] group-hover:text-gray-900 group-data-[mobile-active=true]:text-gray-900"
  }, // Gold
  { 
    borderClass: "hover:border-[#34A853] data-[mobile-active=true]:border-[#34A853]", 
    textHoverClass: "group-hover:text-[#34A853] group-data-[mobile-active=true]:text-[#34A853]", 
    buttonHoverClass: "group-hover:bg-[#34A853] group-data-[mobile-active=true]:bg-[#34A853] group-hover:border-transparent group-data-[mobile-active=true]:border-transparent group-hover:text-white group-data-[mobile-active=true]:text-white", 
    badgeClass: "bg-[#34A853]",
    tagHoverClass: "group-hover:bg-[#34A853] group-data-[mobile-active=true]:bg-[#34A853] group-hover:text-white group-data-[mobile-active=true]:text-white"
  }, // Green
];

export function HotelCard({ hotel }: HotelCardProps) {
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

  const isFav = !!favorites[hotel.id];

  let ratingText = "Good";
  if (hotel.rating >= 9.0) ratingText = "Excellent";
  else if (hotel.rating >= 8.0) ratingText = "Very Good";
  else if (hotel.rating >= 7.0) ratingText = "Good";

  const isEven = parseInt(hotel.id) % 2 === 0;
  const dealText = isEven
    ? `Dropped ৳${(Math.round((hotel.price * 0.12) / 100) * 100).toLocaleString()}`
    : "12% lower than other sites";

  const themeIndex = (parseInt(hotel.id) - 1) % HOVER_THEMES.length;
  const theme = HOVER_THEMES[isNaN(themeIndex) ? 0 : themeIndex];

  return (
    <div className="relative h-full block rounded-2xl">
      <Link
        href={`/hotels/${hotel.slug}`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 rounded-2xl h-full outline-none"
      >
      <article className={`group overflow-hidden rounded-2xl border-2 border-transparent bg-white shadow-lg transition-all duration-500 hover:-translate-y-1 data-[mobile-active=true]:-translate-y-1 hover:shadow-2xl data-[mobile-active=true]:shadow-2xl dark:bg-gray-900 flex flex-col h-full ${theme.borderClass}`}>
        {/* Image */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute left-3 top-3 flex gap-1.5 transition-colors duration-500">
            {hotel.tags.map((tag) => (
              <span
                key={tag}
                className={`rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-bold text-black backdrop-blur-sm shadow-sm transition-colors duration-500 dark:bg-gray-900/90 dark:text-gray-100 ${theme.tagHoverClass}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Hotel name */}
            <h3 className={`mb-1.5 text-base font-extrabold text-black dark:text-white line-clamp-1 transition-colors leading-tight ${theme.textHoverClass}`}>
              {hotel.name}
            </h3>

            {/* Location */}
            <div className="mb-3 flex items-center gap-1 min-w-0">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-black dark:text-gray-400" />
              <span className="truncate text-sm font-medium text-black dark:text-gray-300">
                {hotel.location}
              </span>
            </div>

            {/* Rating */}
            <div className="mb-3 flex items-center gap-2 min-w-0">
              <span className={`inline-flex items-center justify-center rounded px-1.5 py-0.5 text-sm font-bold text-white shadow-sm shrink-0 ${theme.badgeClass}`}>
                {hotel.rating}
              </span>
              <span className="text-sm font-bold text-black dark:text-white shrink-0">
                {ratingText}
              </span>
              <span className="text-sm font-medium text-black dark:text-gray-300 truncate">
                ({hotel.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="border-t border-gray-100 pt-4 dark:border-gray-800 mt-auto">
            {/* Deal Badge */}
            <div className="mb-3 min-w-0">
              <span className="inline-block bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 text-[11px] font-extrabold px-2 py-0.5 rounded tracking-wide uppercase truncate max-w-full">
                {dealText}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-0.5">
                  Resortian Book &amp; Go
                </div>
                <div className="text-[18px] font-extrabold text-black dark:text-white leading-none">
                  ৳{hotel.price.toLocaleString()}
                </div>
              </div>
              
              <div className={`flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 text-xs font-black tracking-widest uppercase text-gray-700 shadow-sm transition-all duration-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 ${theme.buttonHoverClass}`}>
                VIEW DEAL <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>

    {/* Favorite Heart Button & Tooltip Wrapper - Placed outside the Link to prevent hydration/routing issues */}
    <div className="absolute right-3 top-3 z-20 flex flex-col items-end">
      {/* Tooltip */}
      {lastAction?.id === hotel.id && (
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
        onClick={(e) => toggleFavorite(hotel.id, e)}
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
  </div>
  );
}
