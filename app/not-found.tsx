import Link from "next/link";
import { MapPin, Compass, Home, Search, ArrowLeft } from "lucide-react";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f0fff0] dark:bg-gray-950">
        <section className="relative overflow-hidden py-24 lg:py-32">
          {/* Background blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 top-0 h-[480px] w-[480px] rounded-full bg-primary-100/60 blur-3xl dark:bg-primary-950/40" />
            <div className="absolute -right-32 bottom-0 h-[360px] w-[360px] rounded-full bg-primary-100/40 blur-3xl dark:bg-primary-950/30" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Left — illustration */}
              <div className="flex flex-col items-center lg:items-start">
                {/* Big 404 */}
                <div className="relative select-none">
                  <span className="bg-gradient-to-br from-primary-600 to-primary-800 bg-clip-text text-[10rem] font-black leading-none tracking-tighter text-transparent sm:text-[12rem] lg:text-[14rem]">
                    404
                  </span>
                  {/* Floating icons */}
                  <div className="absolute -right-4 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg dark:bg-gray-900">
                    <Compass className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="absolute -left-2 bottom-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg dark:bg-gray-900">
                    <MapPin className="h-4 w-4 text-rose-500" />
                  </div>
                </div>

                {/* Destination cards — visual flair */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Cox's Bazar", "Sylhet", "Bandarban"].map((dest) => (
                    <span
                      key={dest}
                      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-black dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    >
                      <MapPin className="h-3 w-3 text-primary-500" />
                      {dest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — copy + actions */}
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <span className="inline-block rounded-full bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-700 dark:bg-primary-950/50 dark:text-primary-300">
                  Page not found
                </span>

                <h1 className="mt-4 text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">
                  Looks like you&apos;ve
                  <br />
                  <span className="text-primary-600 dark:text-primary-400">
                    checked out early
                  </span>
                </h1>

                <p className="mt-5 max-w-md text-lg leading-relaxed text-black dark:text-gray-400">
                  This page has packed its bags and left. Maybe it moved to a
                  beachfront villa — or maybe the URL just took a wrong turn
                  somewhere between Dhaka and Cox&apos;s Bazar.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/20"
                  >
                    <Home className="h-4 w-4" />
                    Back to Home
                  </Link>
                  <Link
                    href="/hotels"
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:border-primary-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-primary-700"
                  >
                    <Search className="h-4 w-4" />
                    Browse Hotels & Resorts
                  </Link>
                  <Link
                    href="/destinations"
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:border-primary-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-primary-700"
                  >
                    <MapPin className="h-4 w-4" />
                    Destinations
                  </Link>
                </div>

                {/* Quick links */}
                <div className="mt-10 border-t border-gray-200 pt-8 dark:border-gray-800">
                  <p className="text-sm text-black dark:text-gray-500">
                    Popular places to explore
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 lg:justify-start">
                    {[
                      { label: "Featured Stays", href: "/#featured" },
                      { label: "Cox's Bazar", href: "/hotels?location=cox" },
                      { label: "Contact Support", href: "/contact" },
                    ].map(({ label, href }) => (
                      <Link
                        key={label}
                        href={href}
                        className="inline-flex items-center gap-1 text-sm text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <ArrowLeft className="h-3 w-3 rotate-180" />
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
