import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import { SearchForm } from "@/components/ui/SearchForm";

const playfair = Playfair_Display({ subsets: ["latin"] });

export function Hero() {
  return (
    <section className="relative z-10 py-10 sm:py-14">
      <Image
        src="/images/heroBg.jpeg"
        alt=""
        fill
        className="object-cover"
        priority
      />
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Search container card */}
        <div className="relative overflow-visible rounded-2xl border border-white/30 bg-gradient-to-br from-[#F7FDF8] to-[#E2F5E7] p-4 shadow-lg shadow-black/20 backdrop-blur-sm dark:border-white/10 dark:from-gray-900/90 dark:to-gray-800/90 sm:p-6">
          {/* Top accent bar */}
          {/* <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-primary-400 via-primary-500 to-primary-300" /> */}

          {/* Optional label */}
          <p className={`mb-4 text-xl font-semibold italic text-primary-600 dark:text-primary-400 sm:text-2xl ${playfair.className}`}>
            Find your perfect stay
          </p>

          <SearchForm />
        </div>
      </div>
    </section>
  );
}
