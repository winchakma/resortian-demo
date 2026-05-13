import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";

export const metadata: Metadata = {
  title: "Cookie Policy | Resortian",
  description:
    "How Resortian uses cookies and similar tracking technologies on its platform.",
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
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {children}
      </div>
    </section>
  );
}

const COOKIE_TYPES = [
  {
    name: "Strictly Necessary",
    description:
      "Essential for the platform to function. These cannot be disabled.",
    examples: [
      "Session authentication token (JWT stored in memory)",
      "CSRF protection token",
      "Cookie consent preference",
    ],
    canDisable: false,
  },
  {
    name: "Functional",
    description:
      "Enable enhanced features and personalisation. Disabling these may reduce functionality.",
    examples: [
      "Remembered search preferences (location, guests)",
      "Dark / light mode preference",
      "Language and currency selection",
    ],
    canDisable: true,
  },
  {
    name: "Analytics",
    description:
      "Help us understand how visitors interact with the platform so we can improve it.",
    examples: [
      "Page view and session duration tracking",
      "Feature engagement analytics",
      "Funnel and conversion analysis",
    ],
    canDisable: true,
  },
  {
    name: "Marketing",
    description:
      "Used to deliver relevant advertisements and measure their effectiveness.",
    examples: [
      "Retargeting pixels (Meta, Google)",
      "Conversion tracking for paid campaigns",
      "A/B test assignment",
    ],
    canDisable: true,
  },
];

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero */}
        <div className="bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Legal
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Cookie Policy
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Last updated: {LAST_UPDATED}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              This Cookie Policy explains how Resortian uses cookies and similar
              technologies when you visit our platform. It should be read
              alongside our{" "}
              <a
                href="/privacy"
                className="font-medium text-primary-600 hover:underline dark:text-primary-400"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-8 dark:border-gray-700 dark:bg-gray-900 sm:px-10">
            <Section title="What Are Cookies?">
              <p>
                Cookies are small text files placed on your device by websites
                you visit. They are widely used to make websites work
                efficiently, to remember your preferences, and to provide
                information to website owners. Similar technologies include web
                beacons (tiny transparent images), local storage, and session
                storage — this policy covers all of these.
              </p>
            </Section>

            <Section title="How We Use Cookies">
              <p>
                Resortian uses cookies for four purposes: keeping you logged in,
                remembering your preferences, understanding how the platform is
                used, and personalising the marketing you see. The table below
                breaks these down in detail.
              </p>
            </Section>

            {/* Cookie type cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {COOKIE_TYPES.map((type) => (
                <div
                  key={type.name}
                  className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {type.name}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        type.canDisable
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                          : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                      }`}
                    >
                      {type.canDisable ? "Optional" : "Required"}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    {type.description}
                  </p>
                  <ul className="mt-3 space-y-1">
                    {type.examples.map((ex, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-xs text-gray-600 dark:text-gray-400"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary-400" />
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <Section title="Third-Party Cookies">
              <p>
                Some cookies on our platform are set by third-party services we
                use:
              </p>
              <ul className="ml-4 mt-2 space-y-1.5">
                {[
                  "Stripe — payment processing (strictly necessary during checkout)",
                  "Google Analytics — anonymised usage analytics",
                  "Meta Pixel — conversion tracking for Facebook/Instagram ads",
                  "Google Ads — search and display advertising measurement",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-3">
                These third parties operate under their own privacy policies. We
                encourage you to review them.
              </p>
            </Section>

            <Section title="Managing Your Cookie Preferences">
              <p>You can control cookies in several ways:</p>
              <ul className="ml-4 mt-2 space-y-1.5">
                {[
                  "Browser settings — most browsers allow you to block or delete cookies. Note that blocking all cookies will prevent login and some features from working",
                  "Our cookie banner — when you first visit Resortian, you can accept or decline optional cookies",
                  "Opt-out tools — Google Analytics opt-out: tools.google.com/dlpage/gaoptout | Meta opt-out: your ad preferences in Facebook settings",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Cookie Lifespans">
              <p>
                Session cookies are deleted when you close your browser.
                Persistent cookies remain on your device for a set period — our
                authentication remember-me cookie lasts 7 days, analytics
                cookies typically expire after 13 months, and marketing cookies
                after 90 days.
              </p>
            </Section>

            <Section title="Changes to This Policy">
              <p>
                We may update this Cookie Policy as our use of cookies evolves.
                We will notify you of significant changes via the platform or by
                email. Continued use of Resortian after changes take effect
                constitutes acceptance.
              </p>
            </Section>

            <Section title="Contact">
              <p>
                Questions about our use of cookies? Email{" "}
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
