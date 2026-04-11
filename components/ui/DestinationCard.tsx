import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/types";

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Link
      href={`/hotels?location=${encodeURIComponent(destination.name)}`}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
    >
      <article className="relative overflow-hidden rounded-xl">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h3 className="text-lg font-bold text-white">{destination.name}</h3>
            <p className="text-sm text-gray-200">
              {destination.propertyCount} properties
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
