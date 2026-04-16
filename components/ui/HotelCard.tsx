import Image from "next/image";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import type { Hotel } from "@/types";

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <Link
      href={`/hotels/${hotel.slug}`}
      className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 rounded-xl"
    >
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
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
      <div className="p-4">
        <div className="mb-2 flex items-center gap-1">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {hotel.rating}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({hotel.reviewCount} reviews)
          </span>
        </div>
        <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
          {hotel.name}
        </h3>
        <div className="mb-3 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="h-3.5 w-3.5" />
          <span>{hotel.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              ৳{hotel.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              /night
            </span>
          </div>
        </div>
      </div>
    </article>
    </Link>
  );
}
