import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Resortian",
  description:
    "The terms and conditions that govern your use of the Resortian hotel & resort booking platform.",
};

const LAST_UPDATED = "1 April 2026";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-black dark:text-white">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-black dark:text-gray-400">
        {children}
      </div>
    </section>
  );
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="ml-4 mt-2 space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f0fff0] dark:bg-gray-950">
        {/* Hero */}
        <div className="bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Legal
            </p>
            <h1 className="mt-2 text-3xl font-bold text-black dark:text-white sm:text-4xl">
              Terms of Service
            </h1>
            <p className="mt-2 text-sm text-black dark:text-gray-400">
              Last updated: {LAST_UPDATED}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-black dark:text-gray-400">
              These Terms of Service (&quot;Terms&quot;) govern your access to
              and use of Resortian&apos;s website, mobile applications, and
              booking services (collectively, the &quot;Platform&quot;). Please
              read them carefully. By creating an account or making a booking,
              you agree to be bound by these Terms.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-8 dark:border-gray-700 dark:bg-gray-900 sm:px-10">
            <Section title="1. Eligibility">
              <p>
                You must be at least 18 years old to create an account or make a
                booking on Resortian. By using the Platform, you represent that
                you are of legal age and have the capacity to enter into a
                binding contract. If you are using the Platform on behalf of an
                organisation, you represent that you have authority to bind that
                organisation to these Terms.
              </p>
            </Section>

            <Section title="2. Accounts">
              <p>
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account. You must notify us immediately at{" "}
                <a
                  href="mailto:info@resortian.com"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-400"
                >
                  info@resortian.com
                </a>{" "}
                if you suspect unauthorised access. We reserve the right to
                suspend or terminate accounts that violate these Terms.
              </p>
            </Section>

            <Section title="3. Booking and Payment">
              <Ul
                items={[
                  "All bookings are subject to availability and confirmation by the property",
                  "Prices displayed are in Bangladeshi Taka (BDT) and include applicable taxes",
                  "An advance payment (minimum 20% of total price) is collected at the time of booking via Stripe or UddoktaPay",
                  "The remaining balance is payable directly to the property at check-in unless otherwise stated",
                  "Your booking is confirmed only once you receive a confirmation email with a reference number (RST-XXXXXX)",
                  "Resortian acts as an intermediary; the accommodation contract is between you and the property",
                ]}
              />
            </Section>

            <Section title="4. Cancellations and Refunds">
              <p>
                Our refund policy applies to the 20% advance payment collected
                at the time of booking. Because rooms are held exclusively for
                you, cancellations impact our partner resorts. The refund amount
                depends on when you notify us relative to the standard check-in
                time:
              </p>
              <Ul
                items={[
                  "More than 48 hours before check-in: full refund of the advance payment (a nominal processing fee of 50/= applies)",
                  "Between 24 and 48 hours before check-in: 75% refund of the advance payment",
                  "24 hours or less before check-in: 50% refund of the advance payment",
                  "No-shows: the advance payment is forfeited; the property may charge the full booking value",
                ]}
              />
              <p className="mt-3">
                Refunds are processed to the original payment method (bKash,
                Nagad, Rocket, or Credit/Debit Card) within 5–10 working days.
                Any non-refundable gateway or transaction fees will be deducted
                from the final refund amount. In cases of extreme weather or
                national emergencies, Resortian may override these terms to
                facilitate a full refund or a free date change.
              </p>
              <p className="mt-3">
                For complete details, calculation examples, and cancellation
                instructions, please visit our{" "}
                <a
                  href="/cancellation"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-400"
                >
                  Cancellation &amp; Refund Policy
                </a>{" "}
                page.
              </p>
            </Section>

            <Section title="5. Prohibited Conduct">
              <p>You agree not to:</p>
              <Ul
                items={[
                  "Provide false information during registration or booking",
                  "Use the Platform for fraudulent transactions or money laundering",
                  "Attempt to reverse-engineer, scrape, or disrupt the Platform",
                  "Post false or defamatory reviews",
                  "Circumvent any security measures or access controls",
                  "Use automated bots or scripts to interact with the Platform without our written permission",
                ]}
              />
            </Section>

            <Section title="6. Property Owner Obligations">
              <p>Property owners listing on Resortian agree to:</p>
              <Ul
                items={[
                  "Provide accurate and current property information, room descriptions, and photographs",
                  "Honour all confirmed bookings at the listed price",
                  "Maintain rate parity — prices listed on Resortian must not exceed prices on other channels",
                  "Respond to guest reviews and support queries within 48 hours",
                  "Comply with all applicable Bangladeshi laws, including tourism licensing requirements",
                  "Pay the agreed commission rate on all bookings facilitated through the Platform",
                ]}
              />
            </Section>

            <Section title="7. Reviews">
              <p>
                Reviews submitted on Resortian must be based on genuine
                first-hand experiences. We reserve the right to remove reviews
                that are fraudulent, abusive, or in violation of these Terms.
                Properties may not incentivise guests to write positive reviews
                or pressure them to remove negative ones.
              </p>
            </Section>

            <Section title="8. Intellectual Property">
              <p>
                All content on the Platform — including text, graphics, logos,
                and software — is owned by or licensed to Resortian and
                protected by Bangladeshi and international copyright law. You
                may not reproduce, distribute, or create derivative works
                without our prior written consent.
              </p>
            </Section>

            <Section title="9. Limitation of Liability">
              <p>
                To the fullest extent permitted by law, Resortian shall not be
                liable for any indirect, incidental, special, or consequential
                damages arising from your use of the Platform, including but not
                limited to loss of profit, data, or goodwill. Our total
                liability for any claim arising from or relating to these Terms
                shall not exceed the amount paid by you for the booking in
                question.
              </p>
            </Section>

            <Section title="10. Governing Law">
              <p>
                These Terms are governed by the laws of Bangladesh. Any dispute
                arising from these Terms shall be subject to the exclusive
                jurisdiction of the courts of Dhaka, Bangladesh. If any
                provision of these Terms is found to be unenforceable, the
                remaining provisions will continue in full force and effect.
              </p>
            </Section>

            <Section title="11. Changes to Terms">
              <p>
                We may modify these Terms at any time. We will provide at least
                14 days&apos; notice of material changes via email or a
                prominent platform notice. Your continued use of Resortian after
                the effective date constitutes acceptance of the revised Terms.
              </p>
            </Section>

            <Section title="12. Contact">
              <p>
                Questions about these Terms? Contact us at{" "}
                <a
                  href="mailto:info@resortian.com"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-400"
                >
                  info@resortian.com
                </a>
                .
              </p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
