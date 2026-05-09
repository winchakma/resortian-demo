"use client";

import { useState, useEffect } from "react";
import {
  Ticket,
  TrendingUp,
  Users,
  Wallet,
  Copy,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Calendar,
  BadgePercent,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { AffiliateStats } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent
          ? "border-primary-200 bg-primary-50 dark:border-primary-800/40 dark:bg-primary-950/20"
          : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
      }`}
    >
      <div
        className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${
          accent
            ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
        }`}
      >
        {icon}
      </div>
      <p
        className={`text-2xl font-bold ${
          accent
            ? "text-primary-700 dark:text-primary-300"
            : "text-gray-900 dark:text-white"
        }`}
      >
        {value}
      </p>
      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{label}</p>
      {sub && (
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{sub}</p>
      )}
    </div>
  );
}

export default function AffiliatesSection() {
  const { token } = useAuth();
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${API_BASE}/promo-codes/my-stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setStats(data as AffiliateStats))
      .catch(() => setError("Failed to load affiliate data"))
      .finally(() => setLoading(false));
  }, [token]);

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-gray-500 dark:text-gray-400">
        <AlertCircle className="h-8 w-8" />
        <p>{error}</p>
      </div>
    );
  }

  const promo = stats?.promoCode ?? null;
  const bookings = stats?.bookings ?? [];
  const totalEarnings = stats?.totalEarnings ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Affiliate Dashboard
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track earnings from your referral promo code
        </p>
      </div>

      {/* No promo code yet */}
      {!promo ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white py-16 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
            <Ticket className="h-7 w-7 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900 dark:text-white">
              No promo code assigned yet
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              An admin will assign your personal promo code. Check back soon.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Promo code card */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Your Promo Code
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4">
                {/* Code display */}
                <div className="flex flex-1 items-center justify-between rounded-xl border-2 border-primary-200 bg-primary-50 px-5 py-4 dark:border-primary-800/40 dark:bg-primary-950/20">
                  <span className="font-mono text-2xl font-bold tracking-widest text-primary-700 dark:text-primary-300">
                    {promo.code}
                  </span>
                  <button
                    onClick={() => copyCode(promo.code)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-100 dark:text-primary-400 dark:hover:bg-primary-900/30"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code details */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-800/60">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Discount
                  </p>
                  <p className="mt-0.5 font-semibold text-gray-900 dark:text-white">
                    {promo.discountType === "PERCENTAGE"
                      ? `${promo.discountValue}%`
                      : `৳${promo.discountValue.toLocaleString()}`}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-800/60">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Your Commission
                  </p>
                  <p className="mt-0.5 font-semibold text-primary-600 dark:text-primary-400">
                    {promo.affiliateCommission != null
                      ? `${promo.affiliateCommission}%`
                      : "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-800/60">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Total Uses
                  </p>
                  <p className="mt-0.5 font-semibold text-gray-900 dark:text-white">
                    {promo.usedCount}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-800/60">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Status
                  </p>
                  <p
                    className={`mt-0.5 font-semibold ${promo.isActive ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}
                  >
                    {promo.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

              {promo.minBookingAmount && (
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                  Min. booking value: ৳{promo.minBookingAmount.toLocaleString()}
                  {promo.maxDiscountAmount
                    ? ` · Max discount: ৳${promo.maxDiscountAmount.toLocaleString()}`
                    : ""}
                </p>
              )}

              {(promo.validFrom || promo.validTo) && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <Calendar className="h-3.5 w-3.5" />
                  Valid{" "}
                  {promo.validFrom
                    ? new Date(promo.validFrom).toLocaleDateString()
                    : "now"}{" "}
                  →{" "}
                  {promo.validTo
                    ? new Date(promo.validTo).toLocaleDateString()
                    : "no end date"}
                </div>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              icon={<Users className="h-5 w-5" />}
              label="Bookings via your code"
              value={bookings.length}
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              label="Total booking value"
              value={`৳${bookings.reduce((s, b) => s + b.totalPrice - b.discountAmount, 0).toLocaleString()}`}
            />
            <StatCard
              icon={<Wallet className="h-5 w-5" />}
              label="Total earnings"
              value={`৳${totalEarnings.toLocaleString()}`}
              sub={
                promo.affiliateCommission
                  ? `${promo.affiliateCommission}% of net booking value`
                  : undefined
              }
              accent
            />
          </div>

          {/* Bookings table */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Booking History
              </h3>
              <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                Bookings made using your promo code
              </p>
            </div>

            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400 dark:text-gray-600">
                <BadgePercent className="h-10 w-10" />
                <p className="text-sm">No bookings yet — share your code!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
                      <th className="px-5 py-3">Booking ID</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Net Value</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Your Earning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {bookings.map((b) => (
                      <tr
                        key={b.id}
                        className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30"
                      >
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {b.reference}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">
                          {new Date(b.bookedOn).toLocaleDateString("en-BD", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          <span className="ml-1.5 text-xs text-gray-400 dark:text-gray-600">
                            {new Date(b.bookedOn).toLocaleTimeString("en-BD", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300">
                          ৳{(b.totalPrice - b.discountAmount).toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                              b.status === "CONFIRMED"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                : b.status === "COMPLETED"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                  : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold text-primary-600 dark:text-primary-400">
                          ৳{b.earned.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-200 dark:border-gray-700">
                      <td
                        colSpan={4}
                        className="px-5 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300"
                      >
                        Total Earnings
                      </td>
                      <td className="px-5 py-3 text-right text-base font-bold text-primary-600 dark:text-primary-400">
                        ৳{totalEarnings.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
