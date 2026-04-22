"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Building2,
  BedDouble,
  CalendarDays,
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowRight,
  Banknote,
  Hotel,
} from "lucide-react";
import { VendorDashboardStats, VendorBookingStatus } from "@/types";
import { BASE, fmtDate, VENDOR_BOOKING_STATUS_CONFIG } from "@/utils";

function fmtBDT(n: number) {
  return `৳${n.toLocaleString("en-BD")}`;
}

const CASHOUT_STATUS_CONFIG: Record<
  "PENDING" | "APPROVED" | "REJECTED" | "PAID",
  { label: string; cls: string }
> = {
  PENDING: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  },
  APPROVED: {
    label: "Approved",
    cls: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  },
  REJECTED: {
    label: "Rejected",
    cls: "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
  },
  PAID: {
    label: "Paid",
    cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  },
};

function StatCard({
  icon,
  label,
  value,
  sub,
  accent = "violet",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: "violet" | "emerald" | "blue" | "amber";
}) {
  const iconBg: Record<string, string> = {
    violet:
      "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400",
    emerald:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
    amber:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-2.5 ${iconBg[accent]}`}>{icon}</div>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {value}
      </p>
      <p className="mt-0.5 text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      {sub && (
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{sub}</p>
      )}
    </div>
  );
}

function BookingBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          {count} ({pct}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function VendorOverview() {
  const { token } = useAuth();
  const [stats, setStats] = useState<VendorDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/dashboard/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setStats(await res.json());
    } catch {
      toast.error("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
      </div>
    );
  }

  if (!stats) return null;

  const { hotels, rooms, bookings, cashouts, revenue, recentBookings } = stats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Dashboard Overview
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Your property performance at a glance
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          title="Refresh"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={<Building2 className="h-5 w-5" />}
          label="Properties"
          value={hotels.total}
          sub={`${hotels.approved} approved · ${hotels.pending} pending`}
          accent="violet"
        />
        <StatCard
          icon={<BedDouble className="h-5 w-5" />}
          label="Rooms"
          value={rooms.total}
          sub={`${rooms.active} active · ${rooms.pending} pending`}
          accent="violet"
        />
        <StatCard
          icon={<CalendarDays className="h-5 w-5" />}
          label="Bookings This Month"
          value={bookings.thisMonth}
          sub={`${bookings.total} total bookings`}
          accent="blue"
        />
        <StatCard
          icon={<Wallet className="h-5 w-5" />}
          label="Total Paid Out"
          value={fmtBDT(revenue.totalPaidOut)}
          sub={`${fmtBDT(revenue.thisMonthRequestedPayout)} requested this month`}
          accent="emerald"
        />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Booking breakdown */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Booking Breakdown
            </h4>
          </div>
          <div className="space-y-3.5">
            <BookingBar
              label="Confirmed"
              count={bookings.confirmed}
              total={bookings.total}
              color="bg-blue-500"
            />
            <BookingBar
              label="Completed"
              count={bookings.completed}
              total={bookings.total}
              color="bg-emerald-500"
            />
            <BookingBar
              label="Pending"
              count={bookings.pending}
              total={bookings.total}
              color="bg-amber-400"
            />
            <BookingBar
              label="Cancelled"
              count={bookings.cancelled}
              total={bookings.total}
              color="bg-red-400"
            />
          </div>
        </div>

        {/* Cashout & Revenue */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <Banknote className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Cashout &amp; Revenue
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Eligible for Cashout",
                value: cashouts.eligibleBookings,
                unit: "bookings",
                icon: <ArrowRight className="h-3.5 w-3.5" />,
                cls: "text-violet-600 dark:text-violet-400",
              },
              {
                label: "Pending Payout",
                value: fmtBDT(revenue.pendingPayoutAmount),
                unit: "",
                icon: <Clock className="h-3.5 w-3.5" />,
                cls: "text-amber-600 dark:text-amber-400",
              },
              {
                label: "Approved Cashouts",
                value: cashouts.approved,
                unit: "requests",
                icon: <CheckCircle2 className="h-3.5 w-3.5" />,
                cls: "text-blue-600 dark:text-blue-400",
              },
              {
                label: "Paid Cashouts",
                value: cashouts.paid,
                unit: "requests",
                icon: <CheckCircle2 className="h-3.5 w-3.5" />,
                cls: "text-emerald-600 dark:text-emerald-400",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50"
              >
                <div className={`mb-1 flex items-center gap-1 ${item.cls}`}>
                  {item.icon}
                  <span className="text-[10px] font-semibold uppercase tracking-wide">
                    {item.label}
                  </span>
                </div>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {item.value}
                </p>
                {item.unit && (
                  <p className="text-[10px] text-gray-400">{item.unit}</p>
                )}
              </div>
            ))}
          </div>

          {cashouts.pending > 0 && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 px-3.5 py-2.5 dark:bg-amber-950/20">
              <Clock className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                <span className="font-semibold">{cashouts.pending}</span>{" "}
                cashout request{cashouts.pending > 1 ? "s" : ""} under review
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent bookings */}
      {recentBookings.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Hotel className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Recent Bookings
              </h4>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentBookings.map((b) => {
              const sc = VENDOR_BOOKING_STATUS_CONFIG[b.status];
              const cr = b.cashoutRequest;
              const crCfg = cr ? CASHOUT_STATUS_CONFIG[cr.status] : null;
              return (
                <div
                  key={b.id}
                  className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                        {b.reference}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${sc.pill}`}
                      >
                        {sc.label}
                      </span>
                      {crCfg && (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${crCfg.cls}`}
                        >
                          Cashout: {crCfg.label}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {b.room.hotel.name} · {b.room.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)} ·{" "}
                      {b.nights} night{b.nights !== 1 ? "s" : ""}
                      {b.user ? ` · ${b.user.name}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-0.5 text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {fmtBDT(b.advancePaid)}
                    </p>
                    <p className="text-[10px] text-gray-400">advance paid</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {recentBookings.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-16 text-center dark:border-gray-700">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <XCircle className="h-7 w-7 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            No recent bookings
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Bookings will appear here once guests start reserving your rooms.
          </p>
        </div>
      )}
    </div>
  );
}
