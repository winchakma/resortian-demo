import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HotelCard } from "@/components/ui/HotelCard";
import { getFeaturedStays } from "@/utils/api";

export async function FeaturedStays() {
  const hotels = await getFeaturedStays();

  return (
    <section className="bg-[#f0fff0] py-16 dark:bg-gray-950 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header row: heading + View All (desktop/tablet only) */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Featured Stays
            </h2>
            {/* <p className="mt-2 text-gray-600 dark:text-gray-400">
              Handpicked premium accommodations for an unforgettable experience
            </p> */}
          </div>

          <Link
            href="/hotels"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/hotels"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            View All Properties
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
