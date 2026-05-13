import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import {
  BarChart2,
  DollarSign,
  Bell,
  Settings,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Partner Hub | Resortian",
  description:
    "Resources, tools, and guidance for Resortian hotel and resort partners.",
};

const FEATURES = [
  {
    icon: (
      <BarChart2 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
    ),
    title: "Booking Dashboard",
    body: "View all incoming and historical bookings for your properties in one place. Filter by date, status, or room type.",
  },
  {
    icon: (
      <DollarSign className="h-6 w-6 text-primary-600 dark:text-primary-400" />
    ),
    title: "Revenue & Cashouts",
    body: "Track your advance payments, outstanding balances, and commission deductions. Request cashouts directly from the dashboard.",
  },
  {
    icon: <Bell className="h-6 w-6 text-primary-600 dark:text-primary-400" />,
    title: "Real-Time Notifications",
    body: "Receive instant email and push notifications for new bookings, cancellations, and guest messages — even on mobile.",
  },
  {
    icon: (
      <Settings className="h-6 w-6 text-primary-600 dark:text-primary-400" />
    ),
    title: "Property Management",
    body: "Update room details, pricing, availability, photos, and amenities. Changes go live immediately after admin review.",
  },
];

const RESOURCES = [
  {
    title: "Partner Onboarding Guide",
    description:
      "Step-by-step walkthrough of listing your first property, uploading photos, and setting room prices.",
    href: "#",
  },
  {
    title: "Commission & Pricing Explained",
    description:
      "How Resortian's commission model works, when you receive payouts, and how to request a cashout.",
    href: "#",
  },
  {
    title: "Photography Best Practices",
    description:
      "Tips for taking room and property photos that convert browsers into bookers.",
    href: "#",
  },
  {
    title: "Guest Communication Guidelines",
    description:
      "How to respond to reviews, handle cancellation requests, and escalate issues to Resortian support.",
    href: "#",
  },
];

export default function PartnerHubPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-100">
              For Partners
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Partner Hub
            </h1>
            <p className="mt-3 max-w-xl text-primary-100">
              Everything you need to manage your property, track bookings, and
              grow your revenue on Resortian.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/auth/vendor"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
              >
                Sign In to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/list-property"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                List a New Property
              </Link>
            </div>
          </div>
        </section>

        {/* Dashboard features */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              What Your Dashboard Includes
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30">
                    {f.icon}
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Commission breakdown */}
        {/* <section className="bg-white py-12 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              How the Commission Works
            </h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {["Booking Value", "Commission Rate", "Your Payout"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
                  {[
                    ["BDT 3,000 advance", "12% (default)", "BDT 2,640"],
                    ["BDT 3,000 advance", "10% (negotiated)", "BDT 2,700"],
                    ["BDT 5,000 advance", "12% (default)", "BDT 4,400"],
                  ].map(([booking, rate, payout], i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">
                        {booking}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {rate}
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary-600 dark:text-primary-400">
                        {payout}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Commission is deducted from the advance payment only. The balance
              paid at check-in goes directly to you.
            </p>
          </div>
        </section> */}

        {/* Resources */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Partner Resources
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {RESOURCES.map((r) => (
                <a
                  key={r.title}
                  href={r.href}
                  className="group flex items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                      {r.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {r.description}
                    </p>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Help strip */}
        <section className="bg-white py-10 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700 sm:flex-row sm:text-left">
              <HelpCircle className="h-8 w-8 shrink-0 text-primary-500" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Need help with your account?
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Our partner support team is available daily 9 am – 6 pm BST.
                  Email{" "}
                  <a
                    href="mailto:partners@resortian.com"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-400"
                  >
                    info@resortian.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
