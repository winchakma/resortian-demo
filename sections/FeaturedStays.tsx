import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HotelCard } from "@/components/ui/HotelCard";
import { getFeaturedStays } from "@/utils/api";

export async function FeaturedStays() {
  const hotels = await getFeaturedStays();
  // Show up to 8 hotels in two rows of 4
  const deals = hotels.slice(0, 8);

  return (
    <section className="bg-white py-3 sm:py-5 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header row: heading + See more deals */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-extrabold text-black dark:text-white sm:text-3xl lg:text-4xl">
              Unmissable Luxury Escapes
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

        {/* 2 rows of 4 — all 8 visible on same page */}
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
