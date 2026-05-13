import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { AffiliateAuthForm } from "@/components/ui/AffiliateAuthForm";
import {
  Share2,
  Tag,
  BadgePercent,
  Wallet,
  CheckCircle,
  TrendingUp,
  Users,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Affiliate Programme | Resortian",
  description:
    "Join the Resortian affiliate programme. Get a unique promo code, share it with your audience and earn a commission on every booking made with your code.",
};

const HOW_IT_WORKS = [
  {
    icon: <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />,
    step: "1",
    title: "Create Your Affiliate Account",
    body: "Register below in under a minute. No application review — instant access.",
  },
  {
    icon: <Tag className="h-5 w-5 text-primary-600 dark:text-primary-400" />,
    step: "2",
    title: "Receive Your Promo Code",
    body: "A unique promo code is generated for you automatically and shown in your profile dashboard.",
  },
  {
    icon: <Share2 className="h-5 w-5 text-primary-600 dark:text-primary-400" />,
    step: "3",
    title: "Share Everywhere",
    body: "Post your code on Instagram, Facebook, TikTok, YouTube, WhatsApp groups — anywhere your audience hangs out.",
  },
  {
    icon: <Wallet className="h-5 w-5 text-primary-600 dark:text-primary-400" />,
    step: "4",
    title: "Earn on Every Booking",
    body: "Each time someone uses your promo code to complete a booking, you earn a percentage of the advance payment.",
  },
];

const BENEFITS = [
  {
    icon: (
      <BadgePercent className="h-6 w-6 text-primary-600 dark:text-primary-400" />
    ),
    title: "Competitive Commission",
    body: "Earn a percentage on every advance payment made using your code. The more you promote, the more you earn.",
  },
  {
    icon: (
      <TrendingUp className="h-6 w-6 text-primary-600 dark:text-primary-400" />
    ),
    title: "Real-Time Tracking",
    body: "See how many bookings your code has generated and your pending earnings — all from your profile dashboard.",
  },
  {
    icon: (
      <ShieldCheck className="h-6 w-6 text-primary-600 dark:text-primary-400" />
    ),
    title: "Reliable Payouts",
    body: "Commissions are paid out monthly via bKash, Nagad, or bank transfer once you hit the minimum threshold.",
  },
];

const FAQS = [
  {
    q: "Is there a minimum audience requirement?",
    a: "No. Anyone can join — whether you have 100 followers or 100,000. There's no traffic or follower minimum.",
  },
  {
    q: "How does the promo code work?",
    a: "When a guest enters your unique promo code at checkout, the booking is attributed to you. You earn a commission on the advance payment collected for that booking.",
  },
  {
    q: "When and how do I get paid?",
    a: "Commissions are processed on the 15th of each month for earnings from the previous month. We pay via bKash, Nagad, or direct bank transfer. Minimum payout threshold is BDT 500.",
  },
  {
    q: "Can I share the code for specific hotels or destinations?",
    a: "Yes — your promo code works site-wide. You can pair it with direct links to any hotel or destination page to maximise conversions.",
  },
  {
    q: "I already have a Resortian account. Do I need a new one?",
    a: "Sign in below with your existing credentials. If your account isn't already an affiliate account, contact us at info@resortian.com and we'll upgrade it.",
  },
];

export default function AffiliatesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* ── Hero ── */}
        <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-100">
              Earn with Resortian
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Share. Book. Earn.
            </h1>
            <p className="mt-3 max-w-xl text-base text-primary-100">
              Get your personal promo code, share it with your audience, and
              earn a commission every time someone books a stay using your code
              — no experience required.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-primary-200" />
                Instant sign-up
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-primary-200" />
                Unique promo code
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-primary-200" />
                Monthly payouts
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              From sign-up to your first payout in four simple steps.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map((s) => (
                <div
                  key={s.step}
                  className="relative rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-950/40">
                      {s.icon}
                    </div>
                    <span className="text-3xl font-black text-gray-100 dark:text-gray-800">
                      {s.step}
                    </span>
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

        {/* ── Join form + benefits ── */}
        <section className="bg-white py-14 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
              {/* Left: benefits */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Why Join the Programme?
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Monetise your travel content with zero upfront cost and no
                  minimum audience.
                </p>

                <div className="mt-8 space-y-6">
                  {BENEFITS.map((b) => (
                    <div key={b.title} className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/40">
                        {b.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {b.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {b.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo code preview */}
                <div className="mt-10 rounded-2xl border border-dashed border-primary-300 bg-primary-50 p-5 dark:border-primary-800 dark:bg-primary-950/20">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                    Your promo code will look like this
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="rounded-xl bg-white px-5 py-2.5 font-mono text-xl font-bold tracking-widest text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white">
                      RST-XXXXX
                    </span>
                    <Tag className="h-5 w-5 text-primary-500" />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Generated automatically after you join. Share it anywhere.
                  </p>
                </div>
              </div>

              {/* Right: auth form */}
              <div className="lg:sticky lg:top-8">
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Join as an Affiliate
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Already a member? Sign in to access your dashboard.
                  </p>
                </div>
                <AffiliateAuthForm />
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-14">
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
      </main>
      <Footer />
    </>
  );
}
