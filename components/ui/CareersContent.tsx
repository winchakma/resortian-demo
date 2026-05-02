"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  MapPin,
  Briefcase,
  Clock,
  ChevronRight,
  Mail,
  Users,
  Code,
  Megaphone,
  HeadphonesIcon,
  TrendingUp,
} from "lucide-react";

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  icon: React.ReactNode;
  summary: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
}

const JOBS: JobOpening[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    experience: "3–5 years",
    icon: <Code className="h-5 w-5" />,
    summary:
      "Build the customer-facing web experience that Bangladesh's travellers use to discover and book their next stay.",
    about:
      "We are looking for a senior frontend engineer to lead the development of our customer-facing web platform built with Next.js 16, React 19, and Tailwind CSS v4. You will work closely with our design and product teams to ship features that directly impact hundreds of thousands of hotel bookings every month.",
    responsibilities: [
      "Lead the architecture and implementation of new customer-facing features on our Next.js platform",
      "Collaborate with designers to translate Figma mockups into pixel-perfect, accessible components",
      "Review pull requests and mentor junior engineers on best practices",
      "Optimise Core Web Vitals and ensure sub-2-second LCP across all pages",
      "Build and maintain a component library with comprehensive Storybook documentation",
      "Participate in on-call rotation for frontend production incidents",
    ],
    requirements: [
      "3+ years of professional React experience, with at least 1 year on Next.js App Router",
      "Deep understanding of TypeScript — generics, utility types, and strict-mode discipline",
      "Experience with Tailwind CSS and design-token-based theming",
      "Strong grasp of web performance optimisation (lazy loading, bundle splitting, image optimisation)",
      "Comfortable working with REST APIs and familiar with authentication flows (JWT, OAuth)",
      "Experience writing unit and integration tests with Jest and React Testing Library",
    ],
    niceToHave: [
      "Experience with React 19 Server Actions and server components",
      "Background in e-commerce or travel tech",
      "Contributions to open-source frontend projects",
      "Knowledge of Bengali (Bangla) — our primary user base is Bangladeshi travellers",
    ],
  },
  {
    id: "2",
    title: "Backend Engineer (NestJS)",
    department: "Engineering",
    location: "Dhaka, Bangladesh (Hybrid)",
    type: "Full-time",
    experience: "2–4 years",
    icon: <Code className="h-5 w-5" />,
    summary:
      "Design and maintain the APIs that power hotel listings, real-time availability, bookings, and payments across Resortian.",
    about:
      "Our backend is a NestJS 11 monolith backed by PostgreSQL via Prisma, with Redis for queue management (BullMQ) and Stripe + UddoktaPay for payments. You will own entire API modules — from data modelling and business logic through to production monitoring.",
    responsibilities: [
      "Design and implement RESTful API endpoints following NestJS module patterns",
      "Write efficient Prisma queries and design PostgreSQL schemas with appropriate indexing",
      "Implement and maintain payment webhook handlers for Stripe and UddoktaPay",
      "Build background job processors with BullMQ for notifications, report generation, and data sync",
      "Write integration tests that hit a real database — no mocks",
      "Participate in architecture discussions and contribute to technical decision-making",
    ],
    requirements: [
      "2+ years of professional experience with Node.js and TypeScript",
      "Solid understanding of PostgreSQL — query optimisation, indexes, transactions",
      "Experience with an ORM (Prisma, TypeORM, Drizzle) in a production environment",
      "Familiarity with JWT authentication, refresh-token flows, and role-based access control",
      "Understanding of queue-based architectures and asynchronous job processing",
      "Comfortable debugging production issues using structured logs and APM tools",
    ],
    niceToHave: [
      "Experience with NestJS specifically — decorators, guards, interceptors, and modules",
      "Exposure to Stripe Connect or other marketplace payment platforms",
      "Background in multi-tenant SaaS or marketplace products",
      "Experience with Docker and basic infrastructure-as-code",
    ],
  },
  {
    id: "3",
    title: "Digital Marketing Specialist",
    department: "Marketing",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    experience: "2–3 years",
    icon: <Megaphone className="h-5 w-5" />,
    summary:
      "Own our paid and organic digital channels to grow Resortian's brand awareness and drive hotel bookings across Bangladesh.",
    about:
      "You will be the primary driver of Resortian's digital marketing strategy, managing everything from Google Ads and Meta campaigns to SEO and influencer partnerships. This is an ownership role — you will manage budgets, set KPIs, and report directly to the Head of Growth.",
    responsibilities: [
      "Plan and execute paid campaigns across Google Search, Display, and Meta (Facebook/Instagram)",
      "Manage and grow our SEO presence — keyword research, on-page optimisation, and link acquisition",
      "Build and maintain email marketing campaigns and automated drip sequences",
      "Partner with travel influencers and content creators to produce authentic destination content",
      "Track and report on campaign performance using Google Analytics 4 and custom dashboards",
      "Run A/B tests on landing pages and ad creatives to continuously improve conversion rates",
    ],
    requirements: [
      "2+ years of hands-on experience running paid campaigns on Google Ads and Meta Ads Manager",
      "Solid understanding of SEO fundamentals — on-page, technical, and off-page",
      "Experience with email marketing platforms (Mailchimp, Klaviyo, or equivalent)",
      "Data-driven mindset — comfortable pulling reports, interpreting funnel metrics, and making recommendations",
      "Strong written communication skills in both English and Bengali",
      "Experience with Google Analytics 4 and Google Search Console",
    ],
    niceToHave: [
      "Experience marketing a travel, hospitality, or e-commerce product",
      "Background in content creation — copywriting, photography, or short-form video",
      "Familiarity with marketing automation tools (HubSpot, Customer.io)",
      "Understanding of the Bangladeshi domestic travel market",
    ],
  },
  {
    id: "4",
    title: "Customer Success Manager",
    department: "Customer Experience",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    experience: "1–3 years",
    icon: <HeadphonesIcon className="h-5 w-5" />,
    summary:
      "Be the voice of Resortian for our hotel partners and guests — resolving issues, building relationships, and turning feedback into product improvements.",
    about:
      "At Resortian we believe that a booking is the beginning of a relationship, not the end of a transaction. Our Customer Success team handles everything from pre-booking queries and payment disputes through to post-stay reviews and partner onboarding. You will be the first point of contact for many of our most critical moments.",
    responsibilities: [
      "Handle inbound support requests from guests and hotel partners via email, phone, and live chat",
      "Onboard new hotel owners — setting up listings, explaining the commission model, and troubleshooting their dashboard",
      "Investigate and resolve booking disputes, payment failures, and cancellation requests",
      "Identify patterns in support tickets and relay them to the product team as actionable feedback",
      "Maintain customer satisfaction scores above agreed SLAs and report weekly on key CX metrics",
      "Build and improve the self-service Help Center with clear, jargon-free articles",
    ],
    requirements: [
      "1+ years of experience in a customer-facing support or account management role",
      "Excellent written and verbal communication in both English and Bengali",
      "Calm, empathetic, and solution-focused under pressure",
      "Familiarity with support ticketing platforms (Freshdesk, Zendesk, or equivalent)",
      "Basic understanding of how online payments and booking systems work",
      "Ability to prioritise multiple open cases and meet response-time SLAs",
    ],
    niceToHave: [
      "Background in hospitality or travel industry customer service",
      "Experience with CRM tools (HubSpot, Salesforce)",
      "Familiarity with writing Help Center or FAQ documentation",
      "Interest in using data to identify recurring support issues and propose product fixes",
    ],
  },
  {
    id: "5",
    title: "Business Development Executive",
    department: "Partnerships",
    location: "Cox's Bazar / Sylhet (Remote-friendly)",
    type: "Full-time",
    experience: "2–4 years",
    icon: <TrendingUp className="h-5 w-5" />,
    summary:
      "Expand Resortian's hotel inventory in key destinations by building relationships with property owners and operators across Bangladesh.",
    about:
      "We are growing our inventory in Cox's Bazar, Sylhet, Bandarban, and Saint Martin and need a relationship-driven business development executive to sign new hotels and resorts onto the platform. You will be the face of Resortian in these markets — meeting property owners, negotiating listing agreements, and ensuring new partners are set up for success.",
    responsibilities: [
      "Identify and target hotels, resorts, and boutique guesthouses in assigned territories that are a strong fit for Resortian",
      "Conduct face-to-face and virtual pitch meetings with hotel owners and GMs to present Resortian's value proposition",
      "Negotiate listing agreements including commission rates, rate parity, and content standards",
      "Coordinate with the Customer Success team to ensure smooth onboarding of newly signed properties",
      "Maintain a CRM pipeline and provide accurate weekly forecasts to the Head of Partnerships",
      "Represent Resortian at hospitality industry events, trade fairs, and tourism board meetings",
    ],
    requirements: [
      "2+ years of B2B sales or business development experience, ideally in travel, hospitality, or SaaS",
      "Proven track record of meeting or exceeding new-business targets",
      "Excellent relationship-building skills — you build trust quickly and maintain it over time",
      "Strong negotiation skills and comfort handling objections in a face-to-face setting",
      "Willingness to travel frequently within Bangladesh, including to remote destinations",
      "Fluency in Bengali (Bangla) is essential; English proficiency required for internal reporting",
    ],
    niceToHave: [
      "Existing network of contacts in the Bangladesh hotel or resort industry",
      "Experience working with OTAs (Booking.com, Agoda, Airbnb) from the hotel side",
      "Understanding of hotel revenue management and rate strategy",
      "Prior experience at a travel startup or marketplace platform",
    ],
  },
  {
    id: "6",
    title: "UI/UX Designer",
    department: "Design",
    location: "Dhaka, Bangladesh (Hybrid)",
    type: "Full-time",
    experience: "2–4 years",
    icon: <Users className="h-5 w-5" />,
    summary:
      "Define the visual language and interaction patterns that make Resortian the most intuitive hotel booking experience in Bangladesh.",
    about:
      "Design at Resortian means solving real problems for real travellers — from a first-time user searching for a Cox's Bazar hotel on a 4G connection to a hotel owner navigating their earnings dashboard. We are looking for a designer who cares deeply about usability, moves fast with Figma, and enjoys working shoulder-to-shoulder with engineers.",
    responsibilities: [
      "Own end-to-end UX for new features — from user research and wireframes through to final Figma specs",
      "Maintain and evolve the Resortian design system across web and mobile breakpoints",
      "Conduct usability tests with real users (guests, hotel owners) and translate findings into design improvements",
      "Collaborate closely with frontend engineers to ensure designs are implemented faithfully",
      "Create motion and interaction specifications for micro-animations and state transitions",
      "Produce high-fidelity prototypes for stakeholder presentations and user testing",
    ],
    requirements: [
      "2+ years of product design experience shipping consumer-facing web or mobile products",
      "Expert-level Figma skills — auto-layout, variables, components, and prototyping",
      "Strong portfolio demonstrating end-to-end UX thinking, not just visual polish",
      "Experience conducting and analysing user research (interviews, usability tests, surveys)",
      "Understanding of accessibility standards (WCAG 2.1 AA) and how to design for them",
      "Ability to communicate design rationale clearly to non-designers",
    ],
    niceToHave: [
      "Experience designing for low-bandwidth or mobile-first contexts in emerging markets",
      "Background in travel, e-commerce, or marketplace product design",
      "Basic HTML/CSS knowledge — enough to understand what is and is not feasible to build",
      "Familiarity with motion design tools (Lottie, Rive, or After Effects)",
    ],
  },
];

const DEPT_COLORS: Record<string, string> = {
  Engineering:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Marketing:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "Customer Experience":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Partnerships:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Design: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
};

export function CareersContent() {
  const [selected, setSelected] = useState<JobOpening | null>(null);

  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (!selected) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, close]);

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-100">
            Join Our Team
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Build Bangladesh&apos;s Leading Travel Platform
          </h1>
          <p className="mt-3 max-w-xl text-primary-100">
            We are a small, ambitious team working to make travel across
            Bangladesh more accessible, more inspiring, and more rewarding for
            everyone.
          </p>
        </div>
      </section>

      {/* ── Culture strip ───────────────────────────────────────────── */}
      <section className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                title: "Remote-friendly",
                body: "Many roles are hybrid or fully remote. We care about output, not office hours.",
              },
              {
                title: "Fast-moving",
                body: "We ship to production multiple times a week. Your work reaches users immediately.",
              },
              {
                title: "Mission-driven",
                body: "We are making Bangladesh's remarkable destinations accessible to every traveller.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Job listings ────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Open Positions
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {JOBS.length} roles currently open
          </p>

          <div className="mt-6 flex flex-col gap-4">
            {JOBS.map((job) => (
              <div
                key={job.id}
                className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Left */}
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                    {job.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {job.title}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${DEPT_COLORS[job.department] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Briefcase className="h-3 w-3" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        {job.experience}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {job.summary}
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => setSelected(job)}
                  className="flex shrink-0 items-center gap-1.5 self-start rounded-xl border border-primary-600 px-5 py-2.5 text-sm font-semibold text-primary-600 transition-colors hover:bg-primary-50 active:bg-primary-100 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20 sm:self-center"
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* General application nudge */}
          <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Don&apos;t see a role that fits?
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Send a speculative application to{" "}
              <a
                href="mailto:career@resortian.com"
                className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
              >
                career@resortian.com
              </a>{" "}
              and tell us how you can help.
            </p>
          </div>
        </div>
      </section>

      {/* ── Modal ───────────────────────────────────────────────────── */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          className="fixed inset-0 z-[500] flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div className="relative w-full max-w-2xl rounded-2xl bg-white text-gray-900 shadow-2xl dark:bg-gray-900 dark:text-white">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-6 dark:border-gray-800">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  {selected.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selected.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${DEPT_COLORS[selected.department] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {selected.department}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="h-3 w-3" />
                      {selected.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Briefcase className="h-3 w-3" />
                      {selected.type}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      {selected.experience}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={close}
                className="shrink-0 rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="max-h-[60vh] overflow-y-auto p-6 sm:p-8">
              {/* About the role */}
              <h3 className="font-semibold text-gray-900 dark:text-white">
                About the Role
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {selected.about}
              </p>

              {/* Responsibilities */}
              <h3 className="mt-6 font-semibold text-gray-900 dark:text-white">
                What You Will Do
              </h3>
              <ul className="mt-2 space-y-2">
                {selected.responsibilities.map((r, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                    {r}
                  </li>
                ))}
              </ul>

              {/* Requirements */}
              <h3 className="mt-6 font-semibold text-gray-900 dark:text-white">
                What We Are Looking For
              </h3>
              <ul className="mt-2 space-y-2">
                {selected.requirements.map((r, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                    {r}
                  </li>
                ))}
              </ul>

              {/* Nice to have */}
              {selected.niceToHave.length > 0 && (
                <>
                  <h3 className="mt-6 font-semibold text-gray-900 dark:text-white">
                    Nice to Have
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {selected.niceToHave.map((r, i) => (
                      <li
                        key={i}
                        className="flex gap-2.5 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300 dark:bg-gray-600" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Apply footer */}
            <div className="rounded-b-2xl border-t border-gray-100 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-800/60">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40">
                  <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Interested? Send us your CV
                  </p>
                  <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                    Email{" "}
                    <a
                      href={`mailto:career@resortian.com?subject=${encodeURIComponent(`Application: ${selected.title}`)}`}
                      className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
                    >
                      career@resortian.com
                    </a>{" "}
                    with your CV and a short note about why you are a great fit
                    for this role.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
