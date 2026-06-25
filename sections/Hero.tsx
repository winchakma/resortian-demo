import { Playfair_Display } from "next/font/google";
import { SearchForm } from "@/components/ui/SearchForm";

const playfair = Playfair_Display({ subsets: ["latin"] });

export function Hero() {
  return (
    <section className="relative z-10 py-16 sm:py-24 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Find & Book Your Next Stay
          </h1>
          <p className="mt-3 text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto sm:text-lg">
            We compare hotel prices from hundreds of stays in Bangladesh.
          </p>
        </div>

        {/* Search form placed directly on white background like Trivago */}
        <div className="w-full">
          <SearchForm />
        </div>
      </div>
    </section>
  );
}
