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
  Tag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const TAX_RATE = 0.05;

export function CartContent() {
  const { items, removeItem, totalAmount } = useCart();
  const router = useRouter();

  // const taxes = Math.round(totalAmount * TAX_RATE);
  const grandTotal = totalAmount;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-white hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
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
            <ShoppingCart className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Your cart is empty
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Looks like you haven&apos;t added any rooms yet.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Browse Hotels
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        /* ── Cart layout ── */
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
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
                          <h3 className="mt-0.5 text-base font-semibold text-gray-900 dark:text-white">
                            {item.roomName}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeItem(item.cartId)}
                          aria-label="Remove item"
                          className="shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="h-3.5 w-3.5 text-primary-500" />
                        {item.hotelLocation}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
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
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div className="flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1 dark:bg-primary-950/20">
                        <Tag className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
                        <span className="text-xs text-primary-600 dark:text-primary-400">
                          All fees included
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
                          ৳{item.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          per night
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Right — order summary */}
          <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 lg:sticky lg:top-24">
            <h2 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
              Order Summary
            </h2>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.cartId}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <span className="text-gray-600 dark:text-gray-400 line-clamp-2">
                    {item.roomName}
                    <span className="block text-xs text-gray-400 dark:text-gray-500">
                      {item.hotelName}
                    </span>
                  </span>
                  <span className="shrink-0 font-medium text-gray-900 dark:text-white">
                    ৳{item.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-5 border-t border-gray-100 dark:border-gray-800" />

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>৳{totalAmount.toLocaleString()}</span>
              </div>
              {/* <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>VAT (5%)</span>
                <span>৳{taxes.toLocaleString()}</span>
              </div> */}
              <div className="flex justify-between text-gray-500 dark:text-gray-500">
                <span>Service fee</span>
                <span className="text-primary-600 dark:text-primary-400">
                  Free
                </span>
              </div>
            </div>

            <div className="my-5 border-t border-gray-100 dark:border-gray-800" />

            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900 dark:text-white">
                Total
              </span>
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                ৳{grandTotal.toLocaleString()}
              </span>
            </div>
            <p className="mt-1 text-right text-xs text-gray-400 dark:text-gray-500">
              All fees included
            </p>

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 active:bg-primary-800"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Continue Browsing
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
