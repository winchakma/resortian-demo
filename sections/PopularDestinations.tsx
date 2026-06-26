import { PopularSearchesSlider } from "@/components/ui/PopularSearchesSlider";
import { getPopularDestinations } from "@/utils/api";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export async function PopularDestinations() {
  const destinations = await getPopularDestinations();

  return (
    <section className="bg-gray-50 py-10 sm:py-12 dark:bg-gray-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
              Popular searches
            </h2>
          </div>

          <Link
            href="/destinations"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#007fcd] hover:underline"
          >
            See all destinations
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <PopularSearchesSlider destinations={destinations} />
      </div>
    </section>
  );
}
