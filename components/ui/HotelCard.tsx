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

  // Deterministic deal data
  const isEven = parseInt(hotel.id) % 2 === 0;
  const dealText = isEven 
    ? `Dropped ৳${(Math.round((hotel.price * 0.12) / 100) * 100).toLocaleString()}`
    : "12% lower than other sites";

  return (
    <Link
      href={`/hotels/${hotel.slug}`}
      className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 rounded-2xl h-full"
    >
      <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-gray-850 dark:bg-gray-900 flex flex-col h-full shadow-sm">
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
                className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold text-gray-800 backdrop-blur-sm dark:bg-gray-900/90 dark:text-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="mb-1 font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 transition-colors">
              {hotel.name}
            </h3>
            <div className="mb-2.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span className="truncate">{hotel.location}</span>
            </div>
            {/* Rating section */}
            <div className="mb-3.5 flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded bg-primary-600 px-1.5 py-0.5 text-xs font-bold text-white">
                {hotel.rating}
              </span>
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                {ratingText}
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                ({hotel.reviewCount} reviews)
              </span>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-3.5 dark:border-gray-800 mt-auto">
            {/* Deal Comparison Badge */}
            <div className="mb-3">
              <span className="inline-block bg-[#c9183b] text-white text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wide uppercase">
                {dealText}
              </span>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <div className="text-[9px] text-gray-450 dark:text-gray-500 uppercase font-bold tracking-wider mb-0.5">
                  Resortian Book & Go
                </div>
                <div className="text-lg font-extrabold text-gray-900 dark:text-white leading-none">
                  ৳{hotel.price.toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  per night
                </div>
              </div>
              <span className="text-xs font-bold text-primary-600 group-hover:underline inline-flex items-center gap-1 transition-transform group-hover:translate-x-0.5">
                View Deal
                <span className="text-sm font-semibold">→</span>
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
