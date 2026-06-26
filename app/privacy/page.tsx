import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Resortian",
  description:
    "How Resortian collects, uses, and protects your personal information.",
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

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-black dark:text-gray-400">
              Last updated: {LAST_UPDATED}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-black dark:text-gray-400">
              Resortian (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
              operates the Resortian hotel & resort booking platform. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our website and services.
              Please read it carefully. By using Resortian, you consent to the
              practices described here.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-8 dark:border-gray-700 dark:bg-gray-900 sm:px-10">
            <Section title="1. Information We Collect">
              <p>
                We collect information you provide directly to us, including:
              </p>
              <Ul
                items={[
                  "Account registration data: name, phone number, email address, and password hash",
                  "Booking data: check-in and check-out dates, number of guests, room selections, and payment method",
                  "Payment information: we do not store card numbers; payments are processed by Stripe and UddoktaPay under their own PCI-DSS compliance",
                  "Communications: messages you send to our support team or through the contact form",
                  "Profile updates: avatar, address, and bank account details (property owners only)",
                ]}
              />
              <p className="mt-3">
                We also automatically collect certain technical information when
                you use our platform: IP address, browser type, operating
                system, referring URLs, pages visited, and timestamps. This data
                is collected via server logs and standard web analytics tools.
              </p>
            </Section>

            <Section title="2. How We Use Your Information">
              <p>We use the information we collect to:</p>
              <Ul
                items={[
                  "Create and manage your account and authenticate your identity",
                  "Process hotel & resort reservations, handle payments, and send booking confirmations",
                  "Send transactional emails and SMS messages related to your bookings",
                  "Provide customer support and respond to inquiries",
                  "Send promotional communications (you may opt out at any time)",
                  "Detect, investigate, and prevent fraud and abuse",
                  "Improve our platform, personalise content, and conduct analytics",
                  "Comply with legal obligations in Bangladesh",
                ]}
              />
            </Section>

            <Section title="3. Sharing Your Information">
              <p>
                We do not sell your personal data. We share your information
                only in the following circumstances:
              </p>
              <Ul
                items={[
                  "With hotels or resorts you book: your name, phone number, and booking details are shared with the property to fulfil your reservation",
                  "With payment processors (Stripe, UddoktaPay) to process transactions",
                  "With cloud infrastructure providers (hosting, email, object storage) under strict data processing agreements",
                  "With law enforcement or regulators when required by Bangladeshi law",
                  "In connection with a merger, acquisition, or sale of assets, with appropriate notice to you",
                ]}
              />
            </Section>

            <Section title="4. Data Retention">
              <p>
                We retain your account information for as long as your account
                is active. Booking records are retained for seven years for
                accounting and legal compliance purposes. You may request
                deletion of your account at any time; we will anonymise or
                delete your personal data within 30 days, except where retention
                is required by law.
              </p>
            </Section>

            <Section title="5. Security">
              <p>
                We implement industry-standard security measures including
                TLS-encrypted data transmission, bcrypt password hashing, and
                role-based access controls. No method of transmission over the
                internet is 100% secure; we cannot guarantee absolute security
                but we are committed to protecting your data and will notify you
                promptly in the event of a breach that affects your personal
                information.
              </p>
            </Section>

            <Section title="6. Your Rights">
              <p>Subject to applicable law, you have the right to:</p>
              <Ul
                items={[
                  "Access the personal data we hold about you",
                  "Correct inaccurate or incomplete data",
                  "Request deletion of your personal data",
                  "Object to processing of your data for direct marketing",
                  "Withdraw consent at any time where processing is based on consent",
                ]}
              />
              <p className="mt-3">
                To exercise any of these rights, contact us at{" "}
                <a
                  href="mailto:info@resortian.com"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-400"
                >
                  info@resortian.com
                </a>
                .
              </p>
            </Section>

            <Section title="7. Cookies">
              <p>
                We use cookies and similar tracking technologies to maintain
                your session, remember your preferences, and analyse platform
                usage. See our{" "}
                <a
                  href="/cookies"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-400"
                >
                  Cookie Policy
                </a>{" "}
                for full details.
              </p>
            </Section>

            <Section title="8. Third-Party Links">
              <p>
                Our platform may contain links to third-party websites (hotel
                and resort websites, payment gateways, social media). We are not
                responsible for the privacy practices of those sites and
                encourage you to read their privacy policies before providing
                any personal information.
              </p>
            </Section>

            <Section title="9. Children's Privacy">
              <p>
                Resortian is not directed at children under the age of 13. We do
                not knowingly collect personal information from children. If you
                believe a child has provided us with personal data, please
                contact us and we will delete it promptly.
              </p>
            </Section>

            <Section title="10. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of material changes by email or by posting a
                prominent notice on the platform at least 14 days before the
                change takes effect. Your continued use of Resortian after the
                effective date constitutes acceptance of the updated policy.
              </p>
            </Section>

            <Section title="11. Contact Us">
              <p>
                If you have questions or concerns about this Privacy Policy,
                please contact our Data Protection team at{" "}
                <a
                  href="mailto:info@resortian.com"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-400"
                >
                  info@resortian.com
                </a>{" "}
                or write to us at: Resortian Ltd, Level 5, 42 Gulshan Avenue,
                Dhaka 1212, Bangladesh.
              </p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
