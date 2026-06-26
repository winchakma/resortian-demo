"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  MapPin,
  Users,
  Maximize2,
  Eye,
  ArrowRight,
  CalendarDays,
  Moon,
  Banknote,
  CreditCard,
  Info,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const ADVANCE_RATE = 0.2; // 20% paid now

export function CartContent() {
  const { items, removeItem, totalAmount } = useCart();
  const router = useRouter();

  const advanceAmount = Math.round(totalAmount * ADVANCE_RATE);
  const balanceAmount = totalAmount - advanceAmount;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-white hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Your Cart
          </h1>
          {items.length > 0 && (
            <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-sm font-semibold text-primary-700 dark:bg-primary-950/40 dark:text-primary-400">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        /* ── Empty state ── */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-24 text-center dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <ShoppingCart className="h-10 w-10 text-black" />
          </div>
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Your cart is empty
          </h2>
          <p className="mt-2 text-sm text-black dark:text-gray-400">
            Looks like you haven&apos;t added any rooms yet.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Browse Hotels & Resorts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <>
          {/* ── Cart layout ── */}
          <div className="grid gap-8 pb-28 lg:grid-cols-[1fr_400px] lg:pb-0">
          {/* Left — cart items */}
          <div className="space-y-4">
            {items.map((item) => (
              <article
                key={item.cartId}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex">
                  {/* Room image */}
                  <div className="relative hidden min-h-[160px] w-44 shrink-0 overflow-hidden sm:block">
                    <Image
                      src={item.roomImage}
                      alt={item.roomName}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="176px"
                    />
                  </div>

                  {/* Item details */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            href={`/hotels/${item.hotelSlug}`}
                            className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400"
                          >
                            {item.hotelName}
                          </Link>
                          <h3 className="mt-0.5 text-base font-semibold text-black dark:text-white">
                            {item.roomName}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeItem(item.cartId)}
                          aria-label="Remove item"
                          className="shrink-0 rounded-lg p-2 text-black transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center gap-1 text-xs text-black dark:text-gray-400">
                        <MapPin className="h-3.5 w-3.5 text-primary-500" />
                        {item.hotelLocation}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-black dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-primary-500" />
                          {item.capacity} Guest{item.capacity !== 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <Maximize2 className="h-3.5 w-3.5 text-primary-500" />
                          {item.size}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5 text-primary-500" />
                          {item.view}
                        </span>
                      </div>

                      {/* Dates */}
                      {item.checkIn && item.checkOut && (
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                          <span className="flex items-center gap-1 rounded-lg bg-primary-50 px-2.5 py-1 font-medium text-primary-700 dark:bg-primary-950/30 dark:text-primary-300">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {item.checkIn} → {item.checkOut}
                          </span>
                          {item.nights && (
                            <span className="flex items-center gap-1 text-black dark:text-gray-400">
                              <Moon className="h-3.5 w-3.5 text-primary-500" />
                              {item.nights} night{item.nights !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Price + advance split */}
                    <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                      {item.totalPrice ? (
                        <>
                          {/* Full price row */}
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs text-black dark:text-gray-500">
                              ৳{item.price.toLocaleString()} × {item.nights}{" "}
                              night{(item.nights ?? 0) !== 1 ? "s" : ""}
                            </span>
                            <span className="text-base font-semibold text-black dark:text-gray-300">
                              ৳{item.totalPrice.toLocaleString()}
                            </span>
                          </div>
                          {/* Advance / balance split */}
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <div className="rounded-lg bg-primary-50 px-3 py-2 dark:bg-primary-950/30">
                              <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                                <CreditCard className="h-3 w-3" />
                                Pay now (20%)
                              </div>
                              <p className="mt-0.5 text-sm font-bold text-primary-700 dark:text-primary-300">
                                ৳
                                {Math.round(
                                  item.totalPrice * ADVANCE_RATE,
                                ).toLocaleString()}
                              </p>
                            </div>
                            <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/60">
                              <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-black dark:text-gray-400">
                                <Banknote className="h-3 w-3" />
                                At Property (80%)
                              </div>
                              <p className="mt-0.5 text-sm font-bold text-black dark:text-gray-300">
                                ৳
                                {(
                                  item.totalPrice -
                                  Math.round(item.totalPrice * ADVANCE_RATE)
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-end justify-between">
                          <span className="text-xs text-black dark:text-gray-500">
                            per night
                          </span>
                          <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                            ৳{item.price.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* How it works info banner */}
            <div className="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="text-xs text-amber-800 dark:text-amber-300">
                <p className="font-semibold">How advance payment works</p>
                <p className="mt-1 leading-relaxed text-amber-700 dark:text-amber-400">
                  You pay <strong>20% now</strong> to confirm your reservation.
                  The remaining <strong>80% is collected at the hotel</strong>{" "}
                  when you check in — no surprise charges.
                </p>
              </div>
            </div>
          </div>

          {/* Right — order summary */}
          <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 lg:sticky lg:top-24">
            <h2 className="mb-5 text-lg font-bold text-black dark:text-white">
              Order Summary
            </h2>

            {/* Item list */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.cartId}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <span className="text-black dark:text-gray-400">
                    <span className="line-clamp-1 font-medium text-black dark:text-gray-200">
                      {item.roomName}
                    </span>
                    <span className="block text-xs text-black dark:text-gray-500">
                      {item.hotelName}
                    </span>
                    {item.checkIn && item.checkOut && (
                      <span className="block text-xs text-primary-600 dark:text-primary-400">
                        {item.checkIn} → {item.checkOut}
                        {item.nights ? ` · ${item.nights}n` : ""}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 font-semibold text-black dark:text-white">
                    ৳{(item.totalPrice ?? item.price).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-4 border-t border-gray-100 dark:border-gray-800" />

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-black dark:text-gray-400">
                <span>Total booking value</span>
                <span className="font-medium text-black dark:text-gray-300">
                  ৳{totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-black dark:text-gray-400">
                <span>Service fee</span>
                <span className="text-primary-600 dark:text-primary-400">
                  Free
                </span>
              </div>
            </div>

            <div className="my-4 border-t border-gray-100 dark:border-gray-800" />

            {/* Payment split */}
            <div className="space-y-3">
              {/* Advance */}
              <div className="flex items-center justify-between rounded-xl bg-primary-50 px-4 py-3 dark:bg-primary-950/30">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-700 dark:text-primary-400">
                    <CreditCard className="h-3.5 w-3.5" />
                    Pay now (20% advance)
                  </div>
                  <p className="mt-0.5 text-[10px] text-primary-600/70 dark:text-primary-500">
                    Charged today to confirm booking
                  </p>
                </div>
                <span className="text-xl font-bold text-primary-700 dark:text-primary-300">
                  ৳{advanceAmount.toLocaleString()}
                </span>
              </div>

              {/* Balance */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/60">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-black dark:text-gray-300">
                    <Banknote className="h-3.5 w-3.5" />
                    Pay at Property (80%)
                  </div>
                  <p className="mt-0.5 text-[10px] text-black dark:text-gray-500">
                    Due at check-in — cash or card
                  </p>
                </div>
                <span className="text-xl font-bold text-black dark:text-gray-300">
                  ৳{balanceAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-5 hidden w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 active:bg-primary-800 lg:flex"
            >
              Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Continue Browsing
            </Link>
          </div>
        </div>

        {/* ── Mobile fixed bottom checkout bar ── */}
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/95 lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-black dark:text-gray-500">
                Pay now (20%)
              </p>
              <p className="text-lg font-bold text-primary-700 dark:text-primary-300">
                ৳{advanceAmount.toLocaleString()}
              </p>
            </div>
            <Link
              href="/checkout"
              className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 active:bg-primary-800"
            >
              Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
