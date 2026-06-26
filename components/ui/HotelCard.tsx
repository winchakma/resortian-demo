"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Heart, ChevronRight } from "lucide-react";
import type { Hotel } from "@/types";

interface HotelCardProps {
  hotel: Hotel;
}

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

  return (
    <div className="relative h-full block rounded-2xl">
      <Link
        href={`/hotels/${hotel.slug}`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 rounded-2xl h-full outline-none"
      >
      <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-900 flex flex-col h-full shadow-sm">
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
          <div className="absolute left-3 top-3 flex gap-1.5">
            {hotel.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-bold text-black backdrop-blur-sm dark:bg-gray-900/90 dark:text-gray-100"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Hotel name */}
            <h3 className="mb-1.5 text-base font-extrabold text-black dark:text-white line-clamp-1 group-hover:text-primary-600 transition-colors leading-tight">
              {hotel.name}
            </h3>

            {/* Location */}
            <div className="mb-3 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-black dark:text-gray-400" />
              <span className="truncate text-sm font-medium text-black dark:text-gray-300">
                {hotel.location}
              </span>
            </div>

            {/* Rating */}
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded bg-primary-600 px-1.5 py-0.5 text-sm font-bold text-white">
                {hotel.rating}
              </span>
              <span className="text-sm font-bold text-black dark:text-white">
                {ratingText}
              </span>
              <span className="text-sm font-medium text-black dark:text-gray-300">
                ({hotel.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="border-t border-gray-200 pt-3 dark:border-gray-700 mt-auto">
            {/* Deal Badge */}
            <div className="mb-2.5">
              <span className="inline-block bg-[#c9183b] text-white text-[11px] font-extrabold px-2 py-0.5 rounded tracking-wide uppercase">
                {dealText}
              </span>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-black dark:text-gray-400 mb-0.5">
                  Resortian Book &amp; Go
                </div>
                <div className="text-xl font-extrabold text-black dark:text-white leading-none">
                  ৳{hotel.price.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-black dark:text-gray-300 mt-0.5">
                  per night
                </div>
              </div>
              <span className="text-sm font-bold text-primary-600 group-hover:underline inline-flex items-center gap-1 transition-transform group-hover:translate-x-0.5">
                View Deal →
              </span>
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
