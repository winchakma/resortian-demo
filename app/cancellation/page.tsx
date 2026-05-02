import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Cancellation Options | Resortian",
  description:
    "Learn about Resortian's cancellation and refund policies for hotel bookings.",
};

const POLICIES = [
  {
    icon: <CheckCircle className="h-6 w-6 text-green-500" />,
    title: "Free Cancellation",
    badge: "Full Refund",
    badgeColor:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    description:
      "Cancel more than 72 hours before your check-in time and receive a 100% refund of your advance payment — no questions asked.",
    details: [
      "Advance payment refunded in full",
      "Refund processed within 7–14 business days",
      "No cancellation fee",
      "Applies to all standard bookings",
    ],
  },
  {
    icon: <Clock className="h-6 w-6 text-amber-500" />,
    title: "Late Cancellation",
    badge: "No Refund",
    badgeColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    description:
      "Cancellations within 72 hours of check-in: the advance payment (minimum 20% of total booking value) is non-refundable.",
    details: [
      "Advance payment is forfeited",
      "No additional charges beyond advance",
      "Balance due is waived",
      "Property notified immediately",
    ],
  },
  {
    icon: <XCircle className="h-6 w-6 text-red-500" />,
    title: "No-Show",
    badge: "Full Charge",
    badgeColor:
      "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    description:
      "If you do not check in and have not cancelled, the advance payment is forfeited. The hotel reserves the right to charge the full booking amount.",
    details: [
      "Advance payment forfeited",
      "Hotel may charge full amount",
      "Booking marked as no-show",
      "Contact support if circumstances were exceptional",
    ],
  },
];

const STEPS = [
  {
    step: "1",
    title: "Go to My Bookings",
    body: 'Sign in to your account and navigate to "My Bookings" from your profile menu.',
  },
  {
    step: "2",
    title: "Select the Booking",
    body: "Find the reservation you wish to cancel and click on it to open the booking details.",
  },
  {
    step: "3",
    title: "Request Cancellation",
    body: 'Click the "Cancel Booking" button and select an optional cancellation reason.',
  },
  {
    step: "4",
    title: "Confirmation & Refund",
    body: "You will receive a cancellation confirmation by email. If a refund applies, it will be processed automatically to your original payment method.",
  },
];

export default function CancellationPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-100">
              Support
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Cancellation Options
            </h1>
            <p className="mt-3 max-w-xl text-primary-100">
              We understand that plans change. Here is everything you need to
              know about cancelling a Resortian booking.
            </p>
          </div>
        </section>

        {/* Policy cards */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Cancellation Policies
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              The policy that applies depends on when you cancel relative to
              your check-in date.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {POLICIES.map((policy) => (
                <div
                  key={policy.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    {policy.icon}
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${policy.badgeColor}`}
                    >
                      {policy.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                    {policy.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {policy.description}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {policy.details.map((d, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Refund timeline */}
        <section className="bg-white py-12 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Refund Timeline
            </h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {["Payment Method", "Refund Timeline", "Notes"].map(
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
                    ["Stripe (Card)", "5–10 business days", "Subject to card issuer processing time"],
                    ["UddoktaPay", "3–7 business days", "Refunded to original wallet or card"],
                    ["bKash / Nagad", "1–3 business days", "Refunded to the originating mobile wallet"],
                  ].map(([method, timeline, note]) => (
                    <tr key={method}>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {method}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {timeline}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-500">
                        {note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* How to cancel */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              How to Cancel a Booking
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s) => (
                <div
                  key={s.step}
                  className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                    {s.step}
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Exceptional circumstances */}
        <section className="bg-white py-12 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-900/20">
              <div className="flex items-start gap-4">
                <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                    Exceptional Circumstances
                  </h3>
                  <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                    In cases of medical emergencies, natural disasters,
                    government-imposed travel restrictions, or other
                    circumstances beyond your control, we review refund
                    requests on a case-by-case basis. Contact our support team
                    at{" "}
                    <a
                      href="mailto:support@resortian.com"
                      className="font-semibold underline"
                    >
                      support@resortian.com
                    </a>{" "}
                    with relevant documentation and we will do our best to
                    assist you.
                  </p>
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
