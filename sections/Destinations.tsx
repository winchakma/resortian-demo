import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getPopularDestinations } from "@/utils/api";

export async function Destinations() {
  const destinations = await getPopularDestinations();

  const categories = ["Short haul", "Medium haul", "Long haul", "Short haul", "Medium haul", "Long haul"];

  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900/40 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Get inspired for your next trip
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Explore handpicked destinations perfect for any getaway length
            </p>
          </div>

          <Link
            href="/destinations"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-600 hover:underline"
          >
            Explore all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Carousel Scroll Wrapper */}
        <div className="relative">
          <div
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {destinations.map((d, index) => (
              <div
                key={d.id}
                className="w-[200px] sm:w-[240px] shrink-0 snap-start snap-always"
              >
                <Link
                  href={`/hotels?location=${encodeURIComponent(d.name)}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-3xl shadow-md transition-shadow hover:shadow-lg"
                >
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 200px, 240px"
                  />
                  
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute left-4 top-4 rounded-lg bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md border border-white/15">
                    {categories[index % categories.length]}
                  </div>

                  {/* Text Overlay */}
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <h3 className="font-bold text-lg leading-tight truncate group-hover:text-primary-300 transition-colors">
                      {d.name}
                    </h3>
                    <p className="text-[11px] text-gray-300 mt-0.5">
                      {d.propertyCount} properties
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
