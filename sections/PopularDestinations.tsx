import { SectionHeading } from "@/components/ui/SectionHeading";
import { DestinationCard } from "@/components/ui/DestinationCard";
import { getPopularDestinations } from "@/utils/api";

export async function PopularDestinations() {
  const destinations = await getPopularDestinations();

  return (
    <section className="bg-white py-16 dark:bg-gray-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Popular Destinations"
          subtitle="Explore the most sought-after locations across Bangladesh"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </div>
    </section>
  );
}
