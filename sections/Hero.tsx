import Image from "next/image";
import Link from "next/link";
import { SearchForm } from "@/components/ui/SearchForm";

export function Hero() {
  return (
    <section className="relative flex min-h-[360px] flex-col items-center justify-center pt-14 pb-8 lg:pt-20 lg:pb-10">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1600&h=900&fit=crop"
        alt="Beautiful tropical beach landscape"
        fill
        priority
        unoptimized
        className="object-cover"
        sizes="100vw"
      />
      {/* Lighter Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/50" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-display font-extrabold tracking-tight text-white sm:text-5xl lg:text-[64px] drop-shadow-2xl leading-tight">
            Discover Bangladesh Like <br className="hidden sm:block" />
            <span className="text-primary-400">Never Before</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl font-medium text-gray-200 drop-shadow-md max-w-2xl mx-auto">
            Your next unforgettable adventure awaits. Find the perfect stay for your dream getaway.
          </p>
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <SearchForm />
        </div>
      </div>
    </section>
  );
}

const HOVER_THEMES = [
  { borderClass: "hover:border-[#FF385C]", textHoverClass: "group-hover:text-[#FF385C]", badgeClass: "bg-[#FF385C]" }, // Coral
  { borderClass: "hover:border-[#0D9488]", textHoverClass: "group-hover:text-[#0D9488]", badgeClass: "bg-[#0D9488]" }, // Teal
  { borderClass: "hover:border-[#D4A574]", textHoverClass: "group-hover:text-[#D4A574]", badgeClass: "bg-[#D4A574]" }, // Gold
  { borderClass: "hover:border-[#34A853]", textHoverClass: "group-hover:text-[#34A853]", badgeClass: "bg-[#34A853]" }, // Green
];

export function BangladeshStaysWithYou() {
  return (
    <section className="bg-white py-3 sm:py-5 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-display font-extrabold text-black dark:text-white sm:text-4xl flex items-center gap-2">
            <span className="h-6 w-1.5 rounded-full bg-primary-600"></span>
            Bangladesh Stays With You
          </h2>
          <p className="text-base font-medium text-black dark:text-gray-300 mt-1">
            Discover how Bangladesh leaves its mark on you through adventure, food, culture, and leisure.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left: Large Hero Image Card */}
          <Link
            href="/hotels?location=Cox's%20Bazar"
            className={`relative overflow-hidden rounded-3xl shadow-lg lg:col-span-7 group aspect-[16/10] lg:aspect-auto min-h-[320px] block cursor-pointer border-2 border-transparent transition-all duration-300 hover:-translate-y-1 ${HOVER_THEMES[0].borderClass}`}
          >
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
              <span className={`inline-block -rotate-12 transform origin-bottom-left mr-2 rounded-full px-3 py-1 text-xs font-semibold text-white shadow transition-colors duration-300 ${HOVER_THEMES[0].badgeClass}`}>
                Featured Destination
              </span>
              <h3 className={`text-2xl font-bold mt-2.5 sm:text-3xl transition-colors duration-300 ${HOVER_THEMES[0].textHoverClass}`}>Cox&apos;s Bazar Coastline</h3>
              <p className="mt-1.5 text-sm text-gray-200 line-clamp-2 max-w-md">
                Experience the world&apos;s longest sandy beach, fresh seafood delicacies, and warm coastal hospitality.
              </p>
            </div>
          </Link>

          {/* Right: Stacked Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:col-span-5">
            {/* Card 1 */}
            <Link
              href="/hotels?location=Sylhet"
              className={`relative overflow-hidden rounded-3xl shadow-md group aspect-[16/10] lg:aspect-auto min-h-[160px] block cursor-pointer border-2 border-transparent transition-all duration-300 hover:-translate-y-1 ${HOVER_THEMES[1].borderClass}`}
            >
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
                <h4 className={`font-extrabold text-xl transition-colors duration-300 ${HOVER_THEMES[1].textHoverClass}`}>Sylhet Tea Gardens</h4>
                <p className="text-sm text-gray-200 mt-0.5">Explore lush green hills and spiritual shrines.</p>
              </div>
            </Link>

            {/* Card 2 */}
            <Link
              href="/hotels?location=Bandarban"
              className={`relative overflow-hidden rounded-3xl shadow-md group aspect-[16/10] lg:aspect-auto min-h-[160px] block cursor-pointer border-2 border-transparent transition-all duration-300 hover:-translate-y-1 ${HOVER_THEMES[2].borderClass}`}
            >
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
                <h4 className={`font-extrabold text-xl transition-colors duration-300 ${HOVER_THEMES[2].textHoverClass}`}>Bandarban Adventures</h4>
                <p className="text-sm text-gray-200 mt-0.5">Trek high peaks and witness majestic waterfalls.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
