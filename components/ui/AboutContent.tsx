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
    name: "Rafiq Hossain",
    role: "Chief Executive Officer",
    bio: "Former hospitality consultant with 12 years experience across Southeast Asian markets.",
    initials: "RH",
    color: "from-primary-500 to-primary-700",
  },
  {
    name: "Nusrat Jahan",
    role: "Chief Product Officer",
    bio: "Product leader obsessed with reducing friction in the travel booking experience.",
    initials: "NJ",
    color: "from-violet-500 to-violet-700",
  },
  {
    name: "Tamim Iqbal",
    role: "Head of Partnerships",
    bio: "Built our hotel network from the ground up, working directly with properties across Bangladesh.",
    initials: "TI",
    color: "from-amber-500 to-amber-700",
  },
  {
    name: "Shirin Akter",
    role: "Head of Customer Experience",
    bio: "Dedicated to making sure every traveler leaves with a story worth telling.",
    initials: "SA",
    color: "from-rose-500 to-rose-700",
  },
];

const MILESTONES = [
  {
    year: "2020",
    title: "Founded in Dhaka",
    description:
      "Resortian was born out of frustration with fragmented hotel and resort booking in Bangladesh. Two co-founders, one mission.",
  },
  {
    year: "2021",
    title: "First 50 Properties",
    description:
      "Launched with hotels and resorts in Cox's Bazar, Sylhet, and Bandarban. Word of mouth drove our first 1,000 bookings.",
  },
  {
    year: "2022",
    title: "Mobile App Launch",
    description:
      "Released our iOS and Android apps. Downloads crossed 25,000 in the first quarter.",
  },
  {
    year: "2023",
    title: "Expanded to 10 Regions",
    description:
      "Coverage expanded to include Sundarbans, Saint Martin's Island, Rangamati, and more.",
  },
  {
    year: "2024",
    title: "50,000 Travelers",
    description:
      "Crossed 50,000 satisfied travelers. Introduced advance-pay booking and flexible check-in options.",
  },
  {
    year: "2025",
    title: "300+ Partner Properties",
    description:
      "Our network grew to over 300 verified hotels and resorts, making us Bangladesh's largest hotel & resort booking platform.",
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
              Our Story
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Bringing Bangladesh to the World,
              <br />
              <span className="text-primary-200">One Stay at a Time</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-primary-100">
              Resortian is Bangladesh&apos;s leading hotel &amp; resort booking platform,
              connecting travelers with premium accommodations across Cox&apos;s
              Bazar, Sylhet, Sundarbans, Bandarban, and beyond.
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

      {/* Mission */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                Our Mission
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Making Bangladesh travel effortless
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                We started Resortian because booking a hotel in Bangladesh was
                needlessly hard — scattered listings, unclear pricing, zero
                trust signals. We set out to fix that.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                Today, we partner with over 300 properties to offer verified
                listings, transparent pricing, and a booking experience that
                takes minutes — not days. Whether you&apos;re planning a
                weekend getaway to Cox&apos;s Bazar or a month-long retreat in
                the Sundarbans, Resortian is your starting point.
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

      {/* Values */}
      <section className="bg-gray-100/60 py-20 dark:bg-gray-900/60">
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

      {/* Timeline */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Our Journey
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              From idea to industry leader
            </h2>
          </div>
          <div className="mt-12 mx-auto max-w-3xl">
            <div className="relative">
              <div className="absolute left-16 top-0 h-full w-px bg-gray-200 dark:bg-gray-800 sm:left-20" />
              <div className="space-y-8">
                {MILESTONES.map(({ year, title, description }, index) => (
                  <div key={year} className="relative flex gap-6 sm:gap-8">
                    <div className="relative flex w-10 shrink-0 flex-col items-center sm:w-12">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold sm:h-12 sm:w-12 sm:text-sm ${
                          index === MILESTONES.length - 1
                            ? "border-primary-600 bg-primary-600 text-white"
                            : "border-gray-300 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        }`}
                      >
                        {year.slice(2)}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 flex-1 dark:border-gray-700 dark:bg-gray-900">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                          {year}
                        </span>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                          {title}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
              Meet our team
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              A small, passionate team obsessed with making Bangladesh travel
              better.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map(({ name, role, bio, initials, color }) => (
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
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 px-8 py-16 text-center sm:px-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to explore Bangladesh?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-primary-100">
              Browse 300+ verified hotels & resorts across 10+ destinations. Book in
              minutes with just 20% advance.
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
