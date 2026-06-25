import { Shield, Clock, Wallet, HeadphonesIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const FEATURES = [
  {
    icon: Shield,
    title: "Verified Properties",
    description:
      "Every property is personally verified to ensure quality and comfort for our guests.",
  },
  {
    icon: Wallet,
    title: "Best Price Guarantee",
    description:
      "Find a lower price elsewhere? We will match it and give you an extra 10% off.",
  },
  {
    icon: Clock,
    title: "Instant Confirmation",
    description:
      "Get instant booking confirmation with flexible cancellation policies.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description:
      "Our dedicated support team is available round the clock to assist you.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-white py-16 dark:bg-gray-950 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Why Choose Resortian"
          subtitle="We are committed to making your travel experience seamless and memorable"
          align="center"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-gray-200 bg-gray-50 p-6 text-center transition-all hover:border-primary-200 hover:bg-primary-50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-800 dark:hover:bg-primary-950/30"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white dark:bg-primary-900/50 dark:text-primary-400 dark:group-hover:bg-primary-600 dark:group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-base font-extrabold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
