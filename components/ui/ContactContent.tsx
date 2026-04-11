"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  ChevronDown,
} from "lucide-react";

const schema = yup.object({
  name: yup.string().required("Name is required").min(2, "Name too short"),
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^01[3-9]\d{8}$/, "Enter a valid Bangladeshi phone number")
    .required("Phone is required"),
  subject: yup.string().required("Please select a subject"),
  message: yup
    .string()
    .required("Message is required")
    .min(20, "Message must be at least 20 characters"),
});

type FormValues = yup.InferType<typeof schema>;

const CONTACT_CARDS = [
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+880 1700-000000", "+880 1800-000000"],
    sub: "Mon – Sat, 9 AM – 9 PM",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["support@resortian.com", "bookings@resortian.com"],
    sub: "We reply within 24 hours",
    color:
      "bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    lines: ["House 12, Road 7, Banani", "Dhaka 1213, Bangladesh"],
    sub: "By appointment only",
    color:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: ["Mon – Fri: 9 AM – 8 PM", "Sat – Sun: 10 AM – 6 PM"],
    sub: "Bangladesh Standard Time",
    color:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
  },
];

const SUBJECTS = [
  "Booking Inquiry",
  "Cancellation / Refund",
  "Payment Issue",
  "Hotel Partnership",
  "Technical Support",
  "General Question",
];

const FAQS = [
  {
    q: "How do I cancel or modify a booking?",
    a: "Go to your Profile → Bookings, find the booking, and use the Cancel or Modify option. Cancellations made 48+ hours before check-in are fully refunded. Within 48 hours, the advance payment is non-refundable.",
  },
  {
    q: "What is the 20% advance payment policy?",
    a: "When you book through Resortian, you pay 20% of the total amount online to confirm your reservation. The remaining 80% is paid directly at the hotel on arrival.",
  },
  {
    q: "Are the hotels on Resortian verified?",
    a: "Yes. Every property on our platform goes through a quality verification process before listing. We check for cleanliness standards, service quality, and accurate listing information.",
  },
  {
    q: "Can I pay in installments?",
    a: "Currently we support a single advance payment (20%) at the time of booking. Installment plans are on our roadmap for a future release.",
  },
  {
    q: "How do I list my hotel on Resortian?",
    a: "We'd love to hear from you. Use the contact form above and select 'Hotel Partnership' as the subject. Our partnerships team will reach out within 2 business days.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
      >
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {q}
        </span>
        <ChevronDown
          className={`mt-0.5 h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {a}
        </p>
      )}
    </div>
  );
}

export function ContactContent() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  async function onSubmit(_data: FormValues) {
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Message sent! We'll get back to you within 24 hours.", {
      duration: 5000,
      iconTheme: { primary: "#34a853", secondary: "#fff" },
    });
    reset();
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/3 top-8 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-8 right-1/3 h-80 w-80 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <MessageSquare className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              How can we help?
            </h1>
            <p className="mt-4 text-lg text-primary-100">
              Our team is here 7 days a week. Reach out any time and we&apos;ll
              get back to you promptly.
            </p>
          </div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_CARDS.map(({ icon: Icon, title, lines, sub, color }) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              {lines.map((line) => (
                <p
                  key={line}
                  className="mt-1 text-sm text-gray-700 dark:text-gray-300"
                >
                  {line}
                </p>
              ))}
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                {sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Form + FAQ */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
          {/* Contact form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Send us a message
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Fill in the form and we&apos;ll reach out as soon as possible.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 space-y-5"
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Ahmed Rahman"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary-500/30 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 ${
                      errors.name
                        ? "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/20"
                        : "border-gray-300 bg-white focus:border-primary-500 dark:border-gray-700"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary-500/30 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 ${
                      errors.email
                        ? "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/20"
                        : "border-gray-300 bg-white focus:border-primary-500 dark:border-gray-700"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Phone */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number
                  </label>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary-500/30 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 ${
                      errors.phone
                        ? "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/20"
                        : "border-gray-300 bg-white focus:border-primary-500 dark:border-gray-700"
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subject
                  </label>
                  <select
                    {...register("subject")}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary-500/30 dark:bg-gray-800 dark:text-white ${
                      errors.subject
                        ? "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/20"
                        : "border-gray-300 bg-white focus:border-primary-500 dark:border-gray-700"
                    }`}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a subject
                    </option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Message
                </label>
                <textarea
                  {...register("message")}
                  rows={5}
                  placeholder="Describe your inquiry in detail..."
                  className={`w-full resize-none rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary-500/30 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 ${
                    errors.message
                      ? "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/20"
                      : "border-gray-300 bg-white focus:border-primary-500 dark:border-gray-700"
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Frequently asked questions
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Quick answers to common questions.
            </p>
            <div className="mt-6">
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>

            {/* Map placeholder */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-950/40">
                    <MapPin className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    House 12, Road 7, Banani
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Dhaka 1213, Bangladesh
                  </p>
                </div>
                {/* Grid lines for map feel */}
                <svg
                  className="absolute inset-0 h-full w-full opacity-20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="grid"
                      width="24"
                      height="24"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 24 0 L 0 0 0 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Dhaka Office
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400"
                >
                  Open in Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
