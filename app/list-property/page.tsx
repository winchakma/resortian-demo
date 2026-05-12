import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { AuthForm } from "@/components/ui/AuthForm";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "List Your Property | Resortian",
  description:
    "Join Resortian as a property owner and reach thousands of travellers across Bangladesh.",
};

const PERKS = [
  "Reach thousands of verified travellers daily",
  "Transparent commission — only pay when you earn",
  "Free listing setup and onboarding support",
  "Real-time booking management dashboard",
  "Automated payment processing and cashout requests",
  "Dedicated partner support team",
];

export default function ListPropertyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            {/* Left — marketing copy */}
            <div className="lg:pt-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                For Property Owners
              </p>
              <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                List Your Property on Resortian
              </h1>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Join Bangladesh&apos;s fastest-growing hotel &amp; resort
                booking platform and connect your property with thousands of
                verified travellers every month — from Cox&apos;s Bazar beach
                resorts to Sylhet tea-garden retreats.
              </p>

              <ul className="mt-8 space-y-3">
                {PERKS.map((perk) => (
                  <li key={perk} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Stats strip */}
              <div className="mt-10 grid grid-cols-3 gap-4">
                {[
                  { value: "42+", label: "Listed Properties" },
                  { value: "580+", label: "Bookings Made" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-900"
                  >
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — sign-up form */}
            <div>
              <AuthForm role="HOTEL_OWNER" defaultTab="register" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
