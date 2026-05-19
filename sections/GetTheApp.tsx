import { Smartphone, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const FEATURES = [
  "Exclusive app-only deals and discounts",
  "Instant booking confirmations",
  "24/7 customer support at your fingertips",
  "Save your favorites and travel preferences",
];

export function GetTheApp() {
  return (
    <section className="bg-[#f0fff0] py-16 dark:bg-gray-950 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-500 dark:from-primary-700 dark:to-primary-600">
          <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Get the Resortian App
              </h2>
              <p className="mt-3 text-primary-50">
                Download our app for the best booking experience. Manage your
                trips on the go with our feature-rich mobile application.
              </p>
              <ul className="mt-6 space-y-3">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary-200" />
                    <span className="text-sm text-white">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-primary-700 hover:bg-gray-100 dark:bg-white dark:text-primary-700 dark:hover:bg-gray-100"
                >
                  App Store
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 dark:border-white/30 dark:text-white dark:hover:bg-white/10"
                >
                  Google Play
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative flex h-64 w-48 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm sm:h-80 sm:w-56">
                <Smartphone className="h-24 w-24 text-white/60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
