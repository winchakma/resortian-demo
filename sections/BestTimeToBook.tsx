import Image from "next/image";
import Link from "next/link";
import { TrendingDown, Calendar, ArrowRight } from "lucide-react";

export function BestTimeToBook() {
  const monthsData = [
    { name: "October", price: "৳3,200", status: "Expensive", color: "bg-red-500" },
    { name: "November", price: "৳2,400", status: "Average", color: "bg-amber-500" },
    { name: "December", price: "৳3,800", status: "Expensive", color: "bg-red-500" },
    { name: "January", price: "৳3,500", status: "Expensive", color: "bg-red-500" },
    { name: "February", price: "৳2,600", status: "Average", color: "bg-amber-500" },
    { name: "March", price: "৳2,100", status: "Cheap", color: "bg-emerald-500", recommended: true },
    { name: "April", price: "৳1,800", status: "Cheap", color: "bg-emerald-500" },
    { name: "May", price: "৳1,500", status: "Cheap", color: "bg-emerald-500" },
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50 border-t border-b border-gray-100 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
            Discover the best time to book
          </h2>
          <p className="mt-2 text-sm text-black dark:text-gray-400">
            Compare monthly price trends and lock in the best deals for your trip
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Featured Destination Card */}
          <div className="lg:col-span-5 relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md group">
            <div className="relative h-[250px] sm:h-[350px] w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop"
                alt="Cox's Bazar"
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute top-4 left-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                Featured Trend
              </div>
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs uppercase font-semibold tracking-wider text-emerald-400 mb-1">
                  Chittagong Division
                </p>
                <h3 className="text-2xl font-bold mb-2">Cox&apos;s Bazar</h3>
                <p className="text-sm text-gray-200 line-clamp-2">
                  World&apos;s longest natural sandy beach. Prices drop significantly starting from March till May.
                </p>
              </div>
            </div>
            
            <div className="p-5 flex items-center justify-between border-t border-gray-150 dark:border-gray-800">
              <div>
                <span className="text-xs text-gray-450 dark:text-gray-400 block">Avg. Price / Night</span>
                <span className="text-lg font-bold text-black dark:text-white">৳2,400</span>
              </div>
              <Link
                href="/hotels?location=Cox%27s%20Bazar"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#007fcd] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#006bb0]"
              >
                Search Stays
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Month Prices Indicator list */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6 text-emerald-600 dark:text-emerald-500 font-semibold text-sm">
                <TrendingDown className="h-5 w-5" />
                <span>March to May is the cheapest period, saving up to 45%</span>
              </div>

              <div className="space-y-4">
                {monthsData.map((m) => (
                  <div key={m.name} className="flex items-center justify-between gap-4 py-1">
                    <div className="flex items-center gap-3 w-1/4">
                      <Calendar className="h-4 w-4 text-black shrink-0" />
                      <span className="text-sm font-semibold text-black dark:text-gray-200">{m.name}</span>
                    </div>

                    {/* Progress Bar visual indicator */}
                    <div className="flex-1 h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full ${m.color}`}
                        style={{
                          width: m.status === "Cheap" ? "35%" : m.status === "Average" ? "65%" : "90%",
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-3 w-[120px] justify-end">
                      <span className="text-sm font-bold text-black dark:text-white">{m.price}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          m.status === "Cheap"
                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                            : m.status === "Average"
                            ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                            : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
