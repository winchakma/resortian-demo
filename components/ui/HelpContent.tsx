"use client";

import { useState } from "react";
import { ChevronDown, Search, BookOpen, CreditCard, XCircle, User, Hotel, Star } from "lucide-react";

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
    id: "booking",
    label: "Booking",
    icon: <BookOpen className="h-5 w-5" />,
    faqs: [
      {
        q: "How do I make a booking on Resortian?",
        a: "Search for your destination and dates, browse available hotels, choose a room, and click 'Book Now'. You'll pay a minimum 20% advance online; the remaining balance is settled directly at the hotel on arrival.",
      },
      {
        q: "Do I need an account to make a booking?",
        a: "No — Resortian supports guest bookings. Simply provide your name and phone number at checkout. However, creating a free account lets you manage all your bookings in one place, receive personalised offers, and access your booking history.",
      },
      {
        q: "How long does booking confirmation take?",
        a: "Confirmation is instant for most properties. Once your advance payment is processed, you'll receive a confirmation email with your booking reference (RST-XXXXXX) within a few minutes.",
      },
      {
        q: "Can I modify my booking after confirmation?",
        a: "Date changes and room upgrades depend on the hotel's availability and policy. Contact our support team at support@resortian.com with your booking reference and the changes you need — we'll coordinate with the property on your behalf.",
      },
      {
        q: "What is the advance payment and why is it required?",
        a: "The advance payment (minimum 20% of the total booking value) secures your reservation and guarantees the hotel will hold the room for you. The remainder is payable at check-in. The advance rate may be higher for premium properties or peak dates.",
      },
      {
        q: "Can I book for someone else?",
        a: "Yes. During checkout you can enter the guest's name and contact details. The primary booker's payment method is charged, and the hotel will check in the named guest.",
      },
    ],
  },
  {
    id: "payments",
    label: "Payments",
    icon: <CreditCard className="h-5 w-5" />,
    faqs: [
      {
        q: "What payment methods are accepted?",
        a: "We accept all major credit and debit cards via Stripe (Visa, Mastercard, Amex) and UddoktaPay, which supports bKash, Nagad, Rocket, and local Bangladeshi cards. Payment method availability may vary by property.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. Resortian never stores your card number. All card transactions are processed by Stripe, which is PCI DSS Level 1 certified — the highest level of payment security. UddoktaPay is regulated by Bangladesh Bank.",
      },
      {
        q: "Why was my payment declined?",
        a: "Common reasons include: insufficient funds, card blocked for online transactions, or your bank flagging an unfamiliar payment. Try a different card or payment method, or contact your bank. If the issue persists, reach out to our support team.",
      },
      {
        q: "Will I receive an invoice?",
        a: "A booking confirmation email is sent immediately after payment. If you need a formal VAT invoice, contact support@resortian.com with your booking reference and company details.",
      },
      {
        q: "Can I pay the full amount online instead of paying balance at the hotel?",
        a: "Currently, Resortian collects the advance online and the balance is paid at the hotel. Full prepayment options may be available for select properties — this will be indicated on the booking page.",
      },
    ],
  },
  {
    id: "cancellation",
    label: "Cancellations & Refunds",
    icon: <XCircle className="h-5 w-5" />,
    faqs: [
      {
        q: "How do I cancel a booking?",
        a: "Sign in to your account, go to 'My Bookings', open the reservation, and click 'Cancel Booking'. Guest bookers can access their booking via the link in the confirmation email.",
      },
      {
        q: "When will I receive my refund?",
        a: "Refunds are processed within 7–14 business days for card payments and 1–7 days for mobile wallets. The exact timeline depends on your bank or payment provider.",
      },
      {
        q: "What is the free cancellation window?",
        a: "Cancellations made more than 72 hours before check-in are fully refunded. Cancellations within 72 hours forfeit the advance payment. See our full Cancellation Options page for details.",
      },
      {
        q: "Can I get a refund if the hotel cancels my booking?",
        a: "Yes — if a hotel cancels a confirmed booking, you will receive a full refund of your advance payment, typically within 3–5 business days. We will also help you find an alternative property.",
      },
      {
        q: "I had an emergency — can I get an exception?",
        a: "We review exceptional-circumstances requests (medical emergencies, natural disasters, government travel restrictions) on a case-by-case basis. Email support@resortian.com with your booking reference and supporting documentation.",
      },
    ],
  },
  {
    id: "account",
    label: "My Account",
    icon: <User className="h-5 w-5" />,
    faqs: [
      {
        q: "How do I reset my password?",
        a: "On the login page, click 'Forgot password?' and enter your registered phone number or email. You'll receive a reset link. If you signed up with Google, you cannot set a password — use 'Sign in with Google' instead.",
      },
      {
        q: "Can I link a Google account to my existing phone account?",
        a: "Yes — if your Google email matches the email on file in your Resortian account, signing in with Google will automatically link both accounts.",
      },
      {
        q: "How do I update my profile information?",
        a: "Go to Profile → Account Settings. You can update your name, email, address, and profile photo. Phone number changes require re-verification.",
      },
      {
        q: "How do I delete my account?",
        a: "Email privacy@resortian.com from your registered email address with the subject 'Account Deletion Request'. We'll confirm and delete your personal data within 30 days, except where legal retention is required.",
      },
      {
        q: "I booked as a guest — how do I see my booking?",
        a: "Check your confirmation email for a direct booking link. If you later create an account with the same phone number used for the guest booking, you can claim it under Profile → My Bookings → Claim Booking.",
      },
    ],
  },
  {
    id: "hotels",
    label: "Hotels & Rooms",
    icon: <Hotel className="h-5 w-5" />,
    faqs: [
      {
        q: "Are the hotel photos accurate?",
        a: "All photos on Resortian are submitted by hotel owners and subject to our content review. We require accurate representation of the property. If you find a significant discrepancy, please report it via the hotel page or contact support.",
      },
      {
        q: "What does the room capacity mean?",
        a: "Room capacity is the maximum number of guests the room can comfortably accommodate according to the hotel. Exceeding capacity may incur an extra-person charge payable at the hotel.",
      },
      {
        q: "Can I request an early check-in or late check-out?",
        a: "These requests are handled directly by the hotel. You can mention your preference in the booking notes, but early check-in and late check-out are subject to availability and may incur additional charges.",
      },
      {
        q: "The room I booked is unavailable on arrival — what do I do?",
        a: "This is a rare situation but if it occurs, the hotel is responsible for providing an equivalent or superior room. If they cannot, contact our support team immediately at support@resortian.com and we'll assist with relocation and a full refund if necessary.",
      },
    ],
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: <Star className="h-5 w-5" />,
    faqs: [
      {
        q: "Can anyone leave a review?",
        a: "Reviews can be submitted by registered users. While a booking reference is optional, we encourage linking reviews to verified stays for greater credibility.",
      },
      {
        q: "Can hotels delete negative reviews?",
        a: "No. Hotels cannot delete or edit guest reviews. Only Resortian can remove a review, and only if it violates our content policy (e.g., contains false information, hate speech, or is demonstrably fraudulent).",
      },
      {
        q: "How is a hotel's rating calculated?",
        a: "A hotel's displayed rating is the simple average of all visible reviews, recalculated in real time whenever a review is added or removed.",
      },
      {
        q: "I left an inaccurate review — can I edit or delete it?",
        a: "Contact support@resortian.com with your review details and the correction you'd like to make. We'll review your request and action it within 48 hours.",
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
  const [activeCategory, setActiveCategory] = useState("booking");
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
            Find answers to the most common questions about booking,
            payments, and more.
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
