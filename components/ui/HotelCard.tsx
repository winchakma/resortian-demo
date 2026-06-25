import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Hotel } from "@/types";

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  let ratingText = "Good";
  if (hotel.rating >= 9.0) ratingText = "Excellent";
  else if (hotel.rating >= 8.0) ratingText = "Very Good";
  else if (hotel.rating >= 7.0) ratingText = "Good";

  const isEven = parseInt(hotel.id) % 2 === 0;
  const dealText = isEven
    ? `Dropped ৳${(Math.round((hotel.price * 0.12) / 100) * 100).toLocaleString()}`
    : "12% lower than other sites";

  return (
    <Link
      href={`/hotels/${hotel.slug}`}
      className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 rounded-2xl h-full"
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
                className="rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-bold text-gray-900 backdrop-blur-sm dark:bg-gray-900/90 dark:text-gray-100"
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
            <h3 className="mb-1.5 text-base font-extrabold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 transition-colors leading-tight">
              {hotel.name}
            </h3>

            {/* Location */}
            <div className="mb-3 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-600 dark:text-gray-400" />
              <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                {hotel.location}
              </span>
            </div>

            {/* Rating */}
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded bg-primary-600 px-1.5 py-0.5 text-sm font-bold text-white">
                {hotel.rating}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {ratingText}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-0.5">
                  Resortian Book &amp; Go
                </div>
                <div className="text-xl font-extrabold text-gray-900 dark:text-white leading-none">
                  ৳{hotel.price.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-0.5">
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
  );
}
