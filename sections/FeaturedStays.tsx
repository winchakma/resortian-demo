import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedStays } from "@/utils/api";
import { FeaturedStaysSlider } from "@/components/ui/FeaturedStaysSlider";

export async function FeaturedStays() {
  const hotels = await getFeaturedStays();
  // Show up to 8 hotels in the slider
  const deals = hotels.slice(0, 8);

  return (
    <section className="bg-white py-4 dark:bg-gray-950 sm:py-6">
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

        {/* Sliding Carousel with arrows */}
        <FeaturedStaysSlider hotels={deals} />
      </div>
    </section>
  );
}
