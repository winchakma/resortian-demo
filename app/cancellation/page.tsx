import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import {
  AlertCircle,
  CheckCircle,
  Calculator,
  CreditCard,
  BookOpen,
  CloudLightning,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | Resortian",
  description:
    "Learn about Resortian's cancellation and refund policies for hotel and resort bookings in Bangladesh.",
};

const REFUND_TABLE = [
  {
    window: "More than 48 Hours before check-in",
    refund: "Full Refund",
    fee: "50 /=",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    window: "Between 24 and 48 Hours before check-in",
    refund: "75% Refund",
    fee: "25% of the advance payment",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    window: "24 Hours or Less before check-in",
    refund: "50% Refund",
    fee: "50% of the advance payment",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
  },
];

const EXAMPLES = [
  {
    label: "Scenario A",
    timing: "36 hours before check-in",
    detail: "You receive a 75% refund of your 2,000 BDT advance.",
    result: "Refund Amount: 1,500 BDT",
  },
  {
    label: "Scenario B",
    timing: "12 hours before check-in",
    detail: "You receive a 50% refund of your 2,000 BDT advance.",
    result: "Refund Amount: 1,000 BDT",
  },
];

const REFUND_METHOD_DETAILS = [
  {
    title: "Payment Channels",
    description:
      "Refunds will be processed through the original payment method used (e.g., bKash, Nagad, Rocket, or Credit/Debit Cards).",
  },
  {
    title: "Timeframe",
    description:
      "Please allow 5–10 working days for the amount to reflect in your account.",
  },
  {
    title: "Gateway Fees",
    description:
      "Please note that any non-refundable service charges or transaction fees imposed by the payment gateway will be deducted from the final refund amount.",
  },
];

export default function CancellationPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f0fff0] dark:bg-gray-950">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-100">
              Policy
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Cancellation &amp; Refund Policy
            </h1>
            <p className="mt-3 max-w-2xl text-primary-100">
              In our platform, Resortian, we value your plans. However, because
              rooms are held exclusively for you, cancellations impact our
              partner resorts. Our refund policy applies to the 20% advance
              payment made at the time of booking.
            </p>
          </div>
        </section>

        {/* 1. Refund Breakdown */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                1
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Refund Breakdown
              </h2>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              The amount refunded depends on when you notify us of your
              cancellation relative to the standard check-in time.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {[
                      "Cancellation Window",
                      "Refund Amount",
                      "Cancellation Fee",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
                  {REFUND_TABLE.map(({ window: w, refund, fee, color }) => (
                    <tr key={w}>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {w}
                      </td>
                      <td className={`px-6 py-4 font-semibold ${color}`}>
                        {refund}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {fee}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 2. Calculation Examples */}
        <section className="bg-white py-12 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                2
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Calculation Examples
              </h2>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              To keep things transparent, here is how the math works if your
              Total Booking is{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                10,000 BDT
              </span>{" "}
              (Advance Paid:{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                2,000 BDT
              </span>
              ):
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {EXAMPLES.map(({ label, timing, detail, result }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <Calculator className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {label}
                    </h3>
                    <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                      {timing}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    {detail}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-bold text-green-700 dark:text-green-400">
                      {result}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Refund Method & Timeline */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                3
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Refund Method &amp; Timeline
              </h2>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {REFUND_METHOD_DETAILS.map(({ title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/40">
                    <CreditCard className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. How to Cancel */}
        <section className="bg-white py-12 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                4
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                How to Cancel
              </h2>
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-start gap-4">
                <BookOpen className="mt-0.5 h-6 w-6 shrink-0 text-primary-600 dark:text-primary-400" />
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  To initiate a cancellation, please visit the{" "}
                  <span className="font-semibold">&quot;My Bookings&quot;</span>{" "}
                  section on the Resortian website or mobile app. For emergency
                  assistance, you may contact our Dhaka-based support line.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Special Circumstances */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                5
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Special Circumstances
              </h2>
            </div>

            <div className="mt-6 mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-900/20">
              <div className="flex items-start gap-4">
                <CloudLightning className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                    Extreme Weather &amp; National Emergencies
                  </h3>
                  <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                    In cases of extreme weather or national emergencies within
                    Bangladesh, Resortian reserves the right to override these
                    terms to facilitate a full refund or a free date change in
                    coordination with the property management.
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
