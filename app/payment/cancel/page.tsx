import Link from "next/link";
import { Ban, ShoppingBag } from "lucide-react";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const reference = ref ?? null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="flex min-h-[70vh] items-center justify-center py-16">
          <div className="mx-auto w-full max-w-md px-4 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/40">
                <Ban className="h-12 w-12 text-amber-500 dark:text-amber-400" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Payment Cancelled
            </h1>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              You cancelled the payment. Your booking has not been confirmed.
              You can go back and try again whenever you&apos;re ready.
            </p>

            {reference && (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Booking Reference
                </p>
                <p className="mt-0.5 font-mono text-lg font-semibold text-gray-900 dark:text-white">
                  {reference}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/cart"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 font-semibold text-white transition-colors hover:bg-primary-700"
              >
                <ShoppingBag className="h-4 w-4" />
                Return to Cart
              </Link>
              <Link
                href="/"
                className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white py-3.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
