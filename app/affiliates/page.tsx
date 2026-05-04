import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import {
  Link2,
  DollarSign,
  BarChart2,
  Users,
  Mail,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Affiliates | Resortian",
  description:
    "Earn commission by referring travellers to Resortian. Join our affiliate programme and monetise your travel audience.",
};

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Apply & Get Approved",
    body: "Submit a short application describing your platform (blog, YouTube channel, social media, travel app). Approval takes 2–3 business days.",
  },
  {
    step: "2",
    title: "Get Your Referral Link",
    body: "Once approved, access your unique tracking link and optional embeddable widgets from your affiliate dashboard.",
  },
  {
    step: "3",
    title: "Share with Your Audience",
    body: "Place your link in blog posts, video descriptions, social bios, or email newsletters. Every click is tracked for 30 days.",
  },
  {
    step: "4",
    title: "Earn on Every Booking",
    body: "When a visitor you referred completes a booking on Resortian, you earn a commission on the advance payment collected.",
  },
];

const TIERS = [
  {
    name: "Starter",
    bookings: "0–10 bookings/month",
    commission: "3%",
    perks: [
      "Unique tracking link",
      "Monthly payout via bKash or bank transfer",
      "Basic analytics dashboard",
    ],
  },
  {
    name: "Growth",
    bookings: "11–50 bookings/month",
    commission: "5%",
    perks: [
      "Everything in Starter",
      "Priority support",
      "Custom banner assets",
      "Quarterly performance review",
    ],
  },
  {
    name: "Pro",
    bookings: "51+ bookings/month",
    commission: "7%",
    perks: [
      "Everything in Growth",
      "Dedicated affiliate manager",
      "Co-marketing opportunities",
      "Early access to new features",
    ],
  },
];

const FAQS = [
  {
    q: "Who can become an affiliate?",
    a: "Anyone with an online platform — travel bloggers, YouTubers, Instagram creators, travel apps, comparison sites, or corporate travel managers. We review each application to ensure a good fit for our audience.",
  },
  {
    q: "How long is the tracking cookie?",
    a: "30 days. If someone clicks your link and books within 30 days, the referral is credited to your account.",
  },
  {
    q: "When and how do I get paid?",
    a: "Payouts are processed on the 15th of each month for commissions earned in the previous month. We pay via bKash, Nagad, or direct bank transfer. Minimum payout threshold is BDT 500.",
  },
  {
    q: "Can I promote specific hotels or destinations?",
    a: "Yes. You can generate deep links to any hotel listing or destination page on Resortian, making it easy to promote exactly what your audience is interested in.",
  },
];

export default function AffiliatesPage() {
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
              Affiliate Programme
            </h1>
            <p className="mt-3 max-w-xl text-primary-100">
              Turn your travel content into income. Earn commission for every
              Resortian booking you refer — no minimum audience required.
            </p>
            <a
              href="mailto:affiliates@resortian.com"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
            >
              <Mail className="h-4 w-4" />
              Apply via Email
            </a>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map((s) => (
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

        {/* Commission tiers */}
        {/* <section className="bg-white py-12 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Commission Tiers
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Commission is calculated on the advance payment collected per
              booking. Tier upgrades happen automatically each month.
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {TIERS.map((tier, i) => (
                <div
                  key={tier.name}
                  className={`rounded-2xl border p-6 ${
                    i === 1
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {tier.name}
                    </h3>
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {tier.commission}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {tier.bookings}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {tier.perks.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Why Resortian */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Why Promote Resortian?
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: (
                    <Link2 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  ),
                  title: "High Conversion",
                  body: "Our optimised booking flow converts browsers into confirmed guests at above-industry-average rates.",
                },
                {
                  icon: (
                    <DollarSign className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  ),
                  title: "Competitive Payouts",
                  body: "Commission on advance payments, paid monthly with no minimum traffic requirement to start.",
                },
                {
                  icon: (
                    <BarChart2 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  ),
                  title: "Real-Time Analytics",
                  body: "Track clicks, conversions, and earnings in your dashboard — updated daily so you always know what's working.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-12 dark:bg-gray-900">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Common Questions
            </h2>
            <div className="mt-6 divide-y divide-gray-100 dark:divide-gray-800">
              {FAQS.map((faq) => (
                <div key={faq.q} className="py-5">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {faq.q}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Apply CTA */}
        <section className="py-12">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40">
                <Users className="h-7 w-7 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
              Ready to Join?
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Email us with a brief description of your platform, your monthly
              audience size, and any questions. We typically respond within 2
              business days.
            </p>
            <a
              href="mailto:affiliates@resortian.com"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              <Mail className="h-4 w-4" />
              affiliates@resortian.com
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
