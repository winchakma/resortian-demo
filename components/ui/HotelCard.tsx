import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Hotel } from "@/types";

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  // Determine rating text
  let ratingText = "Good";
  if (hotel.rating >= 9.0) ratingText = "Excellent";
  else if (hotel.rating >= 8.0) ratingText = "Very Good";
  else if (hotel.rating >= 7.0) ratingText = "Good";

  return (
    <Link
      href={`/hotels/${hotel.slug}`}
      className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 rounded-xl h-full"
    >
      <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 flex flex-col h-full">
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute left-3 top-3 flex gap-1.5">
            {hotel.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-gray-800 backdrop-blur-sm dark:bg-gray-900/90 dark:text-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="mb-1 font-semibold text-gray-900 dark:text-white line-clamp-1">
              {hotel.name}
            </h3>
            <div className="mb-3 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{hotel.location}</span>
            </div>
            {/* Rating section */}
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
                {hotel.rating}
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {ratingText}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({hotel.reviewCount} reviews)
              </span>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-3 dark:border-gray-700 mt-auto">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider mb-0.5">
                  Resortian Book & Go
                </div>
                <div className="text-lg font-extrabold text-gray-900 dark:text-white">
                  ৳{hotel.price.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  per night
                </div>
              </div>
              <span className="text-xs font-bold text-[#007fcd] group-hover:underline">
                View Deal
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
