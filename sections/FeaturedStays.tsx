import { SectionHeading } from "@/components/ui/SectionHeading";
import { HotelCard } from "@/components/ui/HotelCard";
import { getFeaturedStays } from "@/utils/api";

export async function FeaturedStays() {
  const hotels = await getFeaturedStays();

  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-950 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Featured Stays"
          subtitle="Handpicked premium accommodations for an unforgettable experience"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </div>
    </section>
  );
}
