import Image from "next/image";
import { SearchForm } from "@/components/ui/SearchForm";

export function Hero() {
  return (
    <section className="relative z-10 py-12 bg-white dark:bg-gray-950 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Search bar at the top */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Save up to 40% on your next hotel stay
          </h1>
          <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
            We compare hotel prices from hundreds of sites
          </p>
        </div>

        <div className="w-full mb-12">
          <SearchForm />
        </div>

        {/* Stays With You Section */}
        <div className="mt-16">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl flex items-center gap-2">
              <span className="h-6 w-1.5 rounded-full bg-primary-600"></span>
              Bangladesh Stays With You
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Discover how Bangladesh leaves its mark on you through adventure, food, culture, and leisure.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left: Large Hero Image Card */}
            <div className="relative overflow-hidden rounded-3xl shadow-lg lg:col-span-7 group aspect-[16/10] lg:aspect-auto min-h-[320px]">
              <Image
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop"
                alt="Cox's Bazar beach"
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white shadow">
                  Featured Destination
                </span>
                <h3 className="text-2xl font-bold mt-2.5 sm:text-3xl">Cox&apos;s Bazar Coastline</h3>
                <p className="mt-1.5 text-sm text-gray-200 line-clamp-2 max-w-md">
                  Experience the world&apos;s longest sandy beach, fresh seafood delicacies, and warm coastal hospitality.
                </p>
              </div>
            </div>

            {/* Right: Stacked Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:col-span-5">
              {/* Card 1 */}
              <div className="relative overflow-hidden rounded-3xl shadow-md group aspect-[16/10] lg:aspect-auto min-h-[160px]">
                <Image
                  src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop"
                  alt="Tea gardens in Sylhet"
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-bold text-lg">Sylhet Tea Gardens</h4>
                  <p className="text-xs text-gray-200 mt-0.5">Explore lush green hills and spiritual shrines.</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="relative overflow-hidden rounded-3xl shadow-md group aspect-[16/10] lg:aspect-auto min-h-[160px]">
                <Image
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop"
                  alt="Bandarban hills"
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-bold text-lg">Bandarban Adventures</h4>
                  <p className="text-xs text-gray-200 mt-0.5">Trek high peaks and witness majestic waterfalls.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partner logo bar */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 border-t border-gray-100 pt-6 text-sm font-semibold text-gray-400 dark:border-gray-900">
          <span className="hover:text-gray-600 transition-colors">Booking.com</span>
          <span className="hover:text-gray-600 transition-colors">Expedia</span>
          <span className="hover:text-gray-600 transition-colors">Hotels.com</span>
          <span className="hover:text-gray-600 transition-colors">Vrbo</span>
          <span className="hover:text-gray-600 transition-colors">ALL</span>
          <span className="hover:text-gray-600 transition-colors">Trip.com</span>
          <span className="hover:text-gray-600 transition-colors">priceline</span>
          <span className="text-xs font-normal text-gray-300 dark:text-gray-700">|</span>
          <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">+100 more</span>
        </div>

      </div>
    </section>
  );
}
