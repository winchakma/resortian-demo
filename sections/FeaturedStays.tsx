import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HotelCard } from "@/components/ui/HotelCard";
import { getFeaturedStays } from "@/utils/api";

export async function FeaturedStays() {
  const hotels = await getFeaturedStays();
  // Display top 4 deals in the grid
  const deals = hotels.slice(0, 4);

  return (
    <section className="bg-white py-8 dark:bg-gray-950 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header row: heading + See more deals */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Hot hotel deals right now
            </h2>
          </div>

          <Link
            href="/hotels"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-600 hover:underline"
          >
            See more deals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 4-Column Grid of Hotel Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((hotel) => (
            <div key={hotel.id}>
              <HotelCard hotel={hotel} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
