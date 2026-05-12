import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Users,
  Star,
  Award,
  Shield,
  Headphones,
  TrendingUp,
  Heart,
  CheckCircle,
} from "lucide-react";

const STATS = [
  { label: "Happy Travelers", value: "50,000+", icon: Users },
  { label: "Partner Properties", value: "300+", icon: MapPin },
  { label: "Destinations", value: "10+", icon: TrendingUp },
  { label: "5-Star Reviews", value: "12,000+", icon: Star },
];

const VALUES = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description:
      "No hidden fees, no surprises. Every price you see is the price you pay. We believe honest pricing builds lasting relationships with our travelers.",
  },
  {
    icon: Heart,
    title: "Traveler-First",
    description:
      "Every decision we make starts with the traveler. From seamless booking flows to flexible cancellation policies, your comfort drives our product.",
  },
  {
    icon: Award,
    title: "Curated Quality",
    description:
      "We personally vet every property on our platform. Only hotels and resorts that meet our standards for cleanliness, service, and hospitality make the cut.",
  },
  {
    icon: Headphones,
    title: "Always Here",
    description:
      "Our support team is available 7 days a week to help with bookings, changes, or anything that comes up during your trip across Bangladesh.",
  },
];

const TEAM = [
  {
    name: "Fahim Linkon",
    role: "Chief Executive Officer",
    initials: "FL",
    color: "from-primary-500 to-primary-700",
  },
  {
    name: "Saqlain Mustaq Durjoy",
    role: "Chief Technical Officer",
    initials: "SD",
    color: "from-violet-500 to-violet-700",
  },
  {
    name: "Nusrat Jahan",
    role: "Head of Partnerships and Communication",
    initials: "NJ",
    color: "from-amber-500 to-amber-700",
  },
  {
    name: "Abdullah Alvi",
    role: "Head of Customer Experience",
    initials: "AA",
    color: "from-rose-500 to-rose-700",
  },
];

const SOLUTION_POINTS = [
  {
    title: "Several Verified Properties",
    description: "From green resorts to luxury hotels.",
  },
  {
    title: "Transparent Pricing",
    description:
      "What you see is exactly what you pay—no surprises at checkout.",
  },
  {
    title: "Instant Confirmation",
    description: "A booking process designed to take minutes, not days.",
  },
];

export function AboutContent() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-10 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-1/4 h-96 w-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              About Us
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Bringing Bangladesh to the World,
              <br />
              <span className="text-primary-200">One Stay at a Time</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-primary-100">
              Resortian is Bangladesh&apos;s fastest-growing hotel &amp; resort
              booking platform, connecting travelers with premium accommodations
              across Cox&apos;s Bazar, Sylhet, Sundarbans, Bandarban, and
              beyond.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/hotels"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition-all hover:bg-primary-50 hover:shadow-lg"
              >
                Explore Hotels & Resorts
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-y divide-gray-200 dark:divide-gray-800 lg:grid-cols-4 lg:divide-y-0">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center px-8 py-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/40">
                  <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
                  {value}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                The Problem
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Travel Planning Shouldn&apos;t Be a Chore
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                We founded Resortian because we realized that booking a resort or
                hotel in Bangladesh was unnecessarily complicated. For too long,
                travelers had to navigate scattered listings, hidden fees, and a
                complete lack of reliable information. We knew there was a better
                way to explore our beautiful country.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  "Verified Properties",
                  "Transparent Pricing",
                  "Flexible Bookings",
                  "Local Expertise",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:bg-primary-950/40 dark:text-primary-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
                  alt="Beautiful hotel in Bangladesh"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/30 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  #1
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Hotel & resort booking
                  <br />
                  platform in Bangladesh
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="bg-gray-100/60 py-20 dark:bg-gray-900/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              The Solution
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Bangladesh&apos;s Fastest-Growing Booking Platform
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              We didn&apos;t just want to create another website; we wanted to
              build a bridge of trust. Today, Resortian is the leading travel
              partner for thousands of explorers, offering:
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {SOLUTION_POINTS.map(({ title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/40">
                  <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              What We Stand For
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Our core values
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/40">
                  <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-100/60 py-20 dark:bg-gray-900/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              The People
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Meet Our Team
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map(({ name, role, initials, color }) => (
              <div
                key={name}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
              >
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-xl font-bold text-white`}
                >
                  {initials}
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                  {name}
                </h3>
                <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Journey Starts Here - CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 px-8 py-16 text-center sm:px-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Your Journey Starts Here
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
              If you&apos;re chasing the sunset on the shores of Cox&apos;s
              Bazar, seeking the quiet mystery of the Sundarbans, or finding a
              peaceful escape in Sylhet, Resortian is your ultimate starting
              point. We handle the logistics so you can focus on the memories.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/hotels"
                className="rounded-xl bg-white px-8 py-3 text-sm font-semibold text-primary-700 transition-all hover:bg-primary-50 hover:shadow-lg"
              >
                Browse Hotels & Resorts
              </Link>
              <Link
                href="/destinations"
                className="rounded-xl border border-white/30 bg-white/10 px-8 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                View Destinations
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
