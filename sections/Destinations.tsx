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
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {destinations.map((d, index) => (
              <div
                key={d.id}
                className="w-[130px] sm:w-[150px] shrink-0 snap-start snap-always"
              >
                <Link
                  href={`/hotels?location=${encodeURIComponent(d.name)}`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-md"
                >
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 130px, 150px"
                  />
                  
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute left-2 top-2 rounded bg-white/10 px-1.5 py-0.5 text-[8px] font-extrabold text-white uppercase tracking-wider backdrop-blur-md border border-white/10">
                    {categories[index % categories.length]}
                  </div>

                  {/* Text Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold text-xs sm:text-sm leading-tight truncate group-hover:text-primary-300 transition-colors">
                      {d.name}
                    </h3>
                    <p className="text-[9px] text-gray-300 mt-0.5">
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
