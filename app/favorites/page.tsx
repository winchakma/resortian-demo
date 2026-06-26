"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPopularDestinations } from "@/utils/api";
import type { Destination } from "@/types";

export default function FavoritesPage() {
  const [places, setPlaces] = useState<Destination[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getPopularDestinations().then(setPlaces);
    try {
      const saved = localStorage.getItem("resortian_favorites");
      if (saved) setFavorites(JSON.parse(saved));
    } catch (err) {}
  }, []);

  const savedPlaces = places.filter((p) => favorites[p.id]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 min-h-[70vh]">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/" className="flex items-center text-gray-500 hover:text-black dark:hover:text-white transition-colors">
          <ArrowLeft className="mr-2 h-5 w-5" /> Back home
        </Link>
      </div>
      
      <h1 className="mb-8 text-3xl font-bold">Saved Places</h1>

      {savedPlaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 py-24 dark:border-gray-800 dark:bg-gray-900/50">
          <p className="text-lg font-medium text-gray-500">You haven't saved any places yet.</p>
          <Link href="/" className="mt-4 rounded-full bg-primary-600 px-6 py-2.5 font-bold text-white transition hover:bg-primary-700">
            Explore Destinations
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {savedPlaces.map((place) => (
            <Link
              key={place.id}
              href={`/hotels?location=${encodeURIComponent(place.name)}`}
              className="group relative block h-[300px] w-full overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={place.image}
                alt={place.name}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-bold leading-tight drop-shadow-md">
                  {place.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
