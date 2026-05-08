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
            {/* <p className="mt-2 text-gray-600 dark:text-gray-400">
              Explore the most sought-after locations across Bangladesh
            </p> */}
          </div>

          <Link
            href="/destinations"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
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
            className="inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            View All Destinations
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
