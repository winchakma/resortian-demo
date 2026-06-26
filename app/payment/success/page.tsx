import Link from "next/link";
import { CheckCircle2, CreditCard, Banknote, Info } from "lucide-react";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; advance?: string; balance?: string }>;
}) {
  const { ref, advance, balance } = await searchParams;

  const references = ref ? ref.split(",") : [];
  const primaryRef = references[0] ?? "—";
  const advanceAmount = advance ? parseInt(advance, 10) : 0;
  const balanceAmount = balance ? parseInt(balance, 10) : 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f0fff0] dark:bg-gray-950">
        <div className="flex min-h-[70vh] items-center justify-center py-16">
          <div className="mx-auto w-full max-w-md px-4">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-950/40">
                <CheckCircle2 className="h-12 w-12 text-primary-600 dark:text-primary-400" />
              </div>
            </div>

            <h1 className="text-center text-3xl font-bold text-black dark:text-white">
              Booking Confirmed!
            </h1>
            <p className="mt-3 text-center text-black dark:text-gray-400">
              Payment successful. Your reservation is secured and a confirmation
              will be sent to your contact details.
            </p>

            {/* Booking reference */}
            {primaryRef !== "—" && (
              <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50 p-5 dark:border-primary-900/30 dark:bg-primary-950/20">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                  Booking Reference
                </p>
                <p className="mt-1 font-mono text-2xl font-bold text-black dark:text-white">
                  {primaryRef}
                </p>
                {references.length > 1 && (
                  <p className="mt-1 font-mono text-sm text-black dark:text-gray-400">
                    {references.slice(1).join(" · ")}
                  </p>
                )}
                <p className="mt-2 text-xs text-black dark:text-gray-400">
                  Keep this reference for your records.
                </p>
              </div>
            )}

            {/* Payment summary */}
            {(advanceAmount > 0 || balanceAmount > 0) && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                <div className="border-b border-gray-100 px-5 py-3 dark:border-gray-800">
                  <p className="text-sm font-semibold text-black dark:text-white">
                    Payment Summary
                  </p>
                </div>
                <div className="flex items-center justify-between bg-primary-50 px-5 py-4 dark:bg-primary-950/30">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50">
                      <CreditCard className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                        Advance Paid
                      </p>
                      <p className="text-xs text-primary-600/70 dark:text-primary-500">
                        20% — charged today
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-primary-700 dark:text-primary-300">
                    ৳{advanceAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <Banknote className="h-4 w-4 text-black dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-black dark:text-gray-300">
                        Due at Property
                      </p>
                      <p className="text-xs text-black dark:text-gray-500">
                        80% — pay at check-in
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-black dark:text-gray-300">
                    ৳{balanceAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Note */}
            {primaryRef !== "—" && (
              <div className="mt-4 flex gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-300">
                  Please present your booking reference{" "}
                  <strong className="font-semibold">{primaryRef}</strong> at the
                  front desk. The remaining{" "}
                  <strong className="font-semibold">
                    ৳{balanceAmount.toLocaleString()}
                  </strong>{" "}
                  will be collected when you check in.
                </p>
              </div>
            )}

            <Link
              href="/"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
