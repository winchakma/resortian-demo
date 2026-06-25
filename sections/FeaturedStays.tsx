import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeaturedStaysSlider } from "@/components/ui/FeaturedStaysSlider";
import { getFeaturedStays } from "@/utils/api";

export async function FeaturedStays() {
  const hotels = await getFeaturedStays();

  return (
    <section className="bg-white py-16 dark:bg-gray-950 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header row: heading + View All (desktop/tablet only) */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Hot hotel deals right now
            </h2>
          </div>

          <Link
            href="/hotels"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#007fcd] hover:underline"
          >
            See more deals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Slider component */}
        <FeaturedStaysSlider hotels={hotels} />
      </div>
    </section>
  );
}
