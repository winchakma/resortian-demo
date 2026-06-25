import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import { SearchForm } from "@/components/ui/SearchForm";

const playfair = Playfair_Display({ subsets: ["latin"] });

export function Hero() {
  return (
    <section className="relative z-10 py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-primary-50/50 via-white to-transparent dark:from-primary-950/20 dark:via-gray-950">
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-primary-700 bg-primary-100 dark:bg-primary-950/60 dark:text-primary-400 uppercase mb-4">
            Bangladesh's Premium Booking Agency
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Find & Book Your Next Stay
          </h1>
          <p className="mt-3 text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto sm:text-lg">
            Compare prices across Cox's Bazar, Sylhet, Sundarbans, and more.
          </p>
        </div>

        {/* Search container card */}
        <div className="relative overflow-visible rounded-3xl border border-gray-200/80 bg-white/80 p-5 shadow-2xl shadow-gray-200/50 backdrop-blur-md dark:border-gray-800/80 dark:bg-gray-900/90 dark:shadow-none sm:p-8">
          <SearchForm />
        </div>
      </div>
    </section>
  );
}
