import { SearchForm } from "@/components/ui/SearchForm";

export function Hero() {
  return (
    <section className="relative z-10 py-16 sm:py-24 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Save up to 40% on your next hotel stay
          </h1>
          <p className="mt-3 text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto sm:text-lg">
            We compare hotel prices from hundreds of sites
          </p>
        </div>

        {/* Search form placed directly on white background like Trivago */}
        <div className="w-full">
          <SearchForm />
        </div>

        {/* Trivago-like partner brand logo bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 border-t border-gray-100 pt-6 text-sm font-semibold text-gray-400 dark:border-gray-900">
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
