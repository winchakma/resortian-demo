"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Headphones } from "lucide-react";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f0fff0] dark:bg-gray-950">
        <section className="relative overflow-hidden py-24 lg:py-32">
          {/* Background blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 top-0 h-[480px] w-[480px] rounded-full bg-rose-100/50 blur-3xl dark:bg-rose-950/20" />
            <div className="absolute -right-32 bottom-0 h-[360px] w-[360px] rounded-full bg-primary-100/40 blur-3xl dark:bg-primary-950/20" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              {/* Icon */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-50 ring-8 ring-rose-50/50 dark:bg-rose-950/30 dark:ring-rose-950/20">
                <AlertTriangle className="h-9 w-9 text-rose-500" />
              </div>

              {/* Label */}
              <span className="mt-6 inline-block rounded-full bg-rose-50 px-4 py-1.5 text-sm font-semibold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                Something went wrong
              </span>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                Our servers need
                <br />
                <span className="text-primary-600 dark:text-primary-400">
                  a short break
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-gray-500 dark:text-gray-400">
                Even the best resorts have off days. An unexpected error occurred
                on our end. Try again in a moment — your booking details are
                safe.
              </p>

              {/* Digest for debugging */}
              {error.digest && (
                <p className="mt-4 font-mono text-xs text-gray-400 dark:text-gray-600">
                  Error ID: {error.digest}
                </p>
              )}

              {/* Actions */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/20"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-primary-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-primary-700"
                >
                  <Home className="h-4 w-4" />
                  Back to Home
                </Link>
              </div>

              {/* Support nudge */}
              <div className="mx-auto mt-12 max-w-sm rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/40">
                    <Headphones className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Still having trouble?
                    </p>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                      Our support team is available 7 days a week.
                    </p>
                    <Link
                      href="/contact"
                      className="mt-2 inline-block text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Contact support →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
