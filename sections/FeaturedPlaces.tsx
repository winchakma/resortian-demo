import Image from "next/image";
import { Star, Heart } from "lucide-react";
import { getPopularDestinations } from "@/utils/api";

export async function FeaturedPlaces() {
  const destinations = await getPopularDestinations();
  const places = destinations.slice(0, 4); 

  const reviewsData = [
    { rating: "4.8", count: "12,450" },
    { rating: "4.7", count: "8,920" },
    { rating: "4.9", count: "15,210" },
    { rating: "4.6", count: "6,840" },
  ];

  return (
    <section className="bg-white py-16 dark:bg-gray-950 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Places you may like
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Highly-rated stays and hot spots recommended for you
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {places.map((place, index) => {
            const reviews = reviewsData[index % reviewsData.length];
            return (
              <div key={place.id} className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                  
                  {/* Trip Best Badge */}
                  <div className="absolute left-3 top-3 rounded-lg bg-orange-600/90 px-2.5 py-1 text-[10px] font-extrabold text-white uppercase tracking-wider backdrop-blur-sm border border-orange-500/20">
                    Trip.Best
                  </div>

                  {/* Favorite Heart Button */}
                  <button
                    type="button"
                    aria-label="Add to favorites"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-sm transition hover:bg-white hover:text-red-500 dark:bg-gray-800/95 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-red-400"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                {/* Content Panel */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                      {place.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                      {place.region}
                    </p>
                  </div>

                  {/* Ratings and Reviews */}
                  <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                    <span className="flex items-center gap-0.5 rounded bg-primary-50 px-1.5 py-0.5 text-xs font-bold text-primary-750 dark:bg-primary-950/40 dark:text-primary-400">
                      <Star className="h-3 w-3 fill-current text-primary-600 dark:text-primary-400" />
                      {reviews.rating}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {reviews.count} reviews
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
