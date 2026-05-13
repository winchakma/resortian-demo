"use client";

import { useState } from "react";
import {
  ChevronDown,
  Search,
  CreditCard,
  XCircle,
  User,
  MessageCircle,
} from "lucide-react";

interface FAQ {
  q: string;
  a: string;
}

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  faqs: FAQ[];
}

const CATEGORIES: Category[] = [
  {
    id: "payments",
    label: "Payments",
    icon: <CreditCard className="h-5 w-5" />,
    faqs: [
      {
        q: "What payment methods are accepted?",
        a: "We accept UddoktaPay, which supports bKash, Nagad, Rocket, and local Bangladeshi banks.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. Resortian does not store your payment information. All payments are processed securely through UddoktaPay, which only facilitates the transaction and does not store your payment details. UddoktaPay is regulated by Bangladesh Bank.",
      },
    ],
  },
  {
    id: "cancellation",
    label: "Cancellations & Refunds",
    icon: <XCircle className="h-5 w-5" />,
    faqs: [
      {
        q: "What is the free cancellation window?",
        a: "Cancellations made more than 48 hours before check-in are eligible for a full refund, excluding a 50 BDT service fee. Cancellations made between 24 and 48 hours before check-in will receive a 75% refund. Cancellations made within 24 hours of check-in will receive a 50% refund.",
      },
      {
        q: "I had an emergency — can I get an exception?",
        a: "We review exceptional-circumstances requests (natural disasters or government travel restrictions) on a case-by-case basis.",
      },
      {
        q: "How do I cancel a booking?",
        a: "To cancel a booking, please contact us directly on WhatsApp with your booking details. Our support team will assist you with the cancellation process.",
      },
    ],
  },
  {
    id: "account",
    label: "My Account",
    icon: <User className="h-5 w-5" />,
    faqs: [
      {
        q: "How do I delete my account?",
        a: "Email info@resortian.com from your registered email address with the subject 'Account Deletion Request'. We'll confirm and delete your personal data within 30 days, except where legal retention is required.",
      },
      {
        q: "I booked as a guest — how do I see my booking?",
        a: "Check your confirmation email for a direct booking link.",
      },
    ],
  },
  {
    id: "bookings",
    label: "Bookings",
    icon: <MessageCircle className="h-5 w-5" />,
    faqs: [
      {
        q: "Can I modify my booking after confirmation?",
        a: "Date changes and room upgrades depend on the hotel's availability and policy. Contact our support team through WhatsApp with your booking reference and the changes you need — we'll coordinate with the property on your behalf.",
      },
    ],
  },
];

function AccordionItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0 dark:border-gray-800">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {faq.q}
        </span>
        <ChevronDown
          className={`mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {faq.a}
        </p>
      )}
    </div>
  );
}

export function HelpContent() {
  const [activeCategory, setActiveCategory] = useState("payments");
  const [query, setQuery] = useState("");

  const current = CATEGORIES.find((c) => c.id === activeCategory)!;

  const filteredFaqs = query.trim()
    ? CATEGORIES.flatMap((c) => c.faqs).filter(
        (f) =>
          f.q.toLowerCase().includes(query.toLowerCase()) ||
          f.a.toLowerCase().includes(query.toLowerCase()),
      )
    : current.faqs;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-100">
            Support
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Help Center
          </h1>
          <p className="mt-3 text-primary-100">
            Find answers to the most common questions about booking, payments,
            and more.
          </p>

          {/* Search */}
          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full border-0 bg-white py-3.5 pl-12 pr-5 text-sm text-gray-900 shadow-lg placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
        </div>
      </section>

      {/* Categories + FAQs */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {!query.trim() && (
            <div className="mb-8 flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? "bg-primary-600 text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:text-primary-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-primary-400"
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-900">
            {filteredFaqs.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                No results for &ldquo;{query}&rdquo; — try different keywords.
              </p>
            ) : (
              filteredFaqs.map((faq, i) => <AccordionItem key={i} faq={faq} />)
            )}
          </div>

          {/* Contact strip */}
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white">
              Still have questions?
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Our support team is available daily from 8 am to 10 pm Bangladesh
              Standard Time.
            </p>
            <a
              href="/contact"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
