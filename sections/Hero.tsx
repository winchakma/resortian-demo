import { SearchForm } from "@/components/ui/SearchForm";

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-primary-100/80 via-white to-primary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900/80 py-10 sm:py-14 border-b-1 border-primary-300 dark:border-gray-700">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Search container card */}
        <div className="relative overflow-visible rounded-2xl border border-gray-200/80 bg-white/80 p-4 shadow-lg shadow-gray-200/50 backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800/70 dark:shadow-gray-900/40 sm:p-6">
          {/* Top accent bar */}
          {/* <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-primary-400 via-primary-500 to-primary-300" /> */}

          {/* Optional label */}
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            Find your perfect stay
          </p>

          <SearchForm />
        </div>
      </div>
    </section>
  );
}
