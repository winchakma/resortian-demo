import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { Star, TrendingUp, Eye, Target, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Advertise with Resortian | Resortian",
  description:
    "Reach thousands of engaged travellers planning trips across Bangladesh. Explore advertising and sponsored listing options on Resortian.",
};

const PACKAGES = [
  {
    name: "Featured Listing",
    price: "BDT 4,500",
    period: "/ month",
    highlight: false,
    description:
      "Appear at the top of relevant search results and the homepage featured strip.",
    features: [
      "Priority placement in search results",
      "Featured badge on your property card",
      "Homepage carousel inclusion",
      "Performance analytics dashboard",
    ],
    cta: "Get Started",
  },
  {
    name: "Spotlight Partner",
    price: "BDT 9,900",
    period: "/ month",
    highlight: true,
    description:
      "Maximum visibility across the platform — search, homepage, destination pages, and email newsletters.",
    features: [
      "Everything in Featured Listing",
      "Destination page banner placement",
      "Monthly newsletter feature (40k+ subscribers)",
      "Social media shoutout (Facebook & YouTube)",
      "Dedicated account manager",
      "A/B test support for listings",
    ],
    cta: "Enquire Now",
  },
  {
    name: "Destination Takeover",
    price: "Custom",
    period: "",
    highlight: false,
    description:
      "Exclusive brand presence across all pages and results for a specific destination (e.g., Cox's Bazar) for a fixed period.",
    features: [
      "Full destination page branding",
      "All search results in destination",
      "Co-branded email campaign",
      "Blog editorial feature",
      "Flexible duration (1 week – 3 months)",
    ],
    cta: "Contact Us",
  },
];

const STATS = [
  {
    icon: <Eye className="h-6 w-6" />,
    value: "120K+",
    label: "Monthly page views",
  },
  {
    icon: <Target className="h-6 w-6" />,
    value: "78%",
    label: "Visitors actively planning a trip",
  },
  {
    icon: <Star className="h-6 w-6" />,
    value: "4.8",
    label: "Average platform rating",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    value: "38%",
    label: "YoY booking growth",
  },
];

export default function AdvertisePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f0fff0] dark:bg-gray-950">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-100">
              For Partners
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Advertise with Resortian
            </h1>
            <p className="mt-3 max-w-xl text-primary-100">
              Put your property in front of thousands of high-intent travellers
              actively searching for hotels and resorts across Bangladesh.
            </p>
          </div>
        </section>

        {/* Audience stats */}
        <section className="bg-white py-12 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-xl font-bold text-gray-900 dark:text-white">
              Our Audience
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400">
                    {s.icon}
                  </div>
                  <p className="mt-3 text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Advertising Packages
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              All packages are billed monthly with no long-term contract.
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`relative flex flex-col rounded-2xl border p-6 ${
                    pkg.highlight
                      ? "border-primary-500 bg-primary-600 text-white shadow-xl shadow-primary-900/20"
                      : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
                  }`}
                >
                  {pkg.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-0.5 text-xs font-bold text-amber-900">
                      Most Popular
                    </span>
                  )}
                  <h3
                    className={`font-bold ${pkg.highlight ? "text-white" : "text-gray-900 dark:text-white"}`}
                  >
                    {pkg.name}
                  </h3>
                  <div className="mt-2 flex items-end gap-1">
                    <span
                      className={`text-2xl font-bold ${pkg.highlight ? "text-white" : "text-gray-900 dark:text-white"}`}
                    >
                      {pkg.price}
                    </span>
                    {pkg.period && (
                      <span
                        className={`mb-0.5 text-sm ${pkg.highlight ? "text-primary-200" : "text-gray-400"}`}
                      >
                        {pkg.period}
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-3 flex-1 text-sm ${pkg.highlight ? "text-primary-100" : "text-gray-600 dark:text-gray-400"}`}
                  >
                    {pkg.description}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-sm">
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${pkg.highlight ? "bg-primary-200" : "bg-primary-500"}`}
                        />
                        <span
                          className={
                            pkg.highlight
                              ? "text-primary-100"
                              : "text-gray-600 dark:text-gray-400"
                          }
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="mailto:info@resortian.com"
                    className={`mt-6 block rounded-xl py-2.5 text-center text-sm font-semibold transition-colors ${
                      pkg.highlight
                        ? "bg-white text-primary-700 hover:bg-primary-50"
                        : "border border-primary-600 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20"
                    }`}
                  >
                    {pkg.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-white py-12 dark:bg-gray-900">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40">
                <Mail className="h-7 w-7 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
              Want a Custom Solution?
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              For destination takeovers, multi-property deals, or bespoke
              campaigns, email our advertising team and we&apos;ll put together
              a proposal tailored to your goals.
            </p>
            <a
              href="mailto:info@resortian.com"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              <Mail className="h-4 w-4" />
              info@resortian.com
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
