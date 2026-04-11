import { SectionHeading } from "@/components/ui/SectionHeading";
import { DestinationCard } from "@/components/ui/DestinationCard";
import { getPopularDestinations } from "@/utils/api";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export async function PopularDestinations() {
  const destinations = await getPopularDestinations();

  return (
    <section className="bg-white py-16 dark:bg-gray-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Popular Destinations
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Explore the most sought-after locations across Bangladesh
            </p>
          </div>

          {/* Visible on sm+ screens */}
          <Link
            href="/destinations"
            className="hidden shrink-0 items-center gap-1.5 rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 dark:border-gray-600 dark:text-gray-300 dark:hover:border-primary-500 dark:hover:bg-primary-950/30 dark:hover:text-primary-400 sm:inline-flex"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 dark:border-gray-600 dark:text-gray-300 dark:hover:border-primary-500 dark:hover:bg-primary-950/30 dark:hover:text-primary-400"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
