"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Wallet,
  TrendingUp,
  Banknote,
  PiggyBank,
  Receipt,
  RefreshCw,
  Percent,
  Hotel,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  CalendarDays,
  BarChart3,
  DoorOpen,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BASE, fmtDate, VENDOR_BOOKING_STATUS_CONFIG } from "@/utils";
import type {
  CashoutStatusKey,
  VendorFinanceOverview as TVendorFinanceOverview,
} from "@/types";

function fmtBDT(n: number) {
  return `৳${n.toLocaleString("en-BD")}`;
}

function unitLabel(
  u: { unitName: string | null; floorNumber: number | null } | null | undefined,
) {
  if (!u) return null;
  const parts: string[] = [];
  if (u.unitName) parts.push(u.unitName);
  if (u.floorNumber != null) parts.push(`Floor ${u.floorNumber}`);
  return parts.join(" · ") || null;
}

const CASHOUT_STATUS_CONFIG: Record<CashoutStatusKey, { label: string; cls: string }> = {
  PENDING: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  },
  APPROVED: {
    label: "Approved",
    cls: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  },
  PAID: {
    label: "Paid",
    cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  },
  REJECTED: {
    label: "Rejected",
    cls: "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
  },
};

function HeroStat({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent: "green" | "emerald" | "blue" | "amber" | "violet" | "rose";
}) {
  const map: Record<string, string> = {
    green: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400",
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className={`inline-flex rounded-xl p-2.5 ${map[accent]}`}>{icon}</div>
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

function MiniStat({
  label,
  value,
  unit,
  icon,
  cls,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  cls: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50">
      <div className={`mb-1 flex items-center gap-1 ${cls}`}>
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-base font-bold text-gray-900 dark:text-white">{value}</p>
      {unit && <p className="text-[10px] text-gray-400">{unit}</p>}
    </div>
  );
}

export default function FinanceOverview() {
  const { token } = useAuth();
  const [data, setData] = useState<TVendorFinanceOverview | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/dashboard/mine/finance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      toast.error("Failed to load finance overview.");
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
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
      </div>
    );
  }
  if (!data) return null;

  const { bookings, revenue, thisMonth, prevMonth, cashouts, perHotel, monthlyFinance, recentEarnings } = data;

  const monthMoMPct =
    prevMonth.gross > 0
      ? Math.round(((thisMonth.gross - prevMonth.gross) / prevMonth.gross) * 100)
      : null;

  const maxMonthlyGross = Math.max(1, ...monthlyFinance.map((m) => m.gross));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Finance Overview
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Complete picture of your earnings, commissions & cashouts
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

      {/* Hero finance numbers */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <HeroStat
          icon={<TrendingUp className="h-5 w-5" />}
          label="Gross Booking Value"
          value={fmtBDT(revenue.grossBookingValue)}
          sub={`${bookings.total - bookings.cancelled} active bookings`}
          accent="green"
        />
        <HeroStat
          icon={<PiggyBank className="h-5 w-5" />}
          label="Estimated Net Earning"
          value={fmtBDT(revenue.estimatedNetEarnings)}
          sub={`After ${revenue.defaultCommissionRate}% commission`}
          accent="emerald"
        />
        <HeroStat
          icon={<Wallet className="h-5 w-5" />}
          label="Total Cashed Out"
          value={fmtBDT(cashouts.amountsByStatus.PAID.payout)}
          sub={`${cashouts.countsByStatus.PAID} paid requests`}
          accent="violet"
        />
        <HeroStat
          icon={<Banknote className="h-5 w-5" />}
          label="Pending Payout"
          value={fmtBDT(cashouts.amountsByStatus.PENDING.payout)}
          sub={`${cashouts.countsByStatus.PENDING} pending requests`}
          accent="amber"
        />
      </div>

      {/* Secondary numbers */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <HeroStat
          icon={<CalendarDays className="h-5 w-5" />}
          label="Total Bookings"
          value={bookings.total.toString()}
          sub={`${bookings.confirmed} confirmed · ${bookings.completed} completed`}
          accent="blue"
        />
        <HeroStat
          icon={<Receipt className="h-5 w-5" />}
          label="Advance Collected"
          value={fmtBDT(revenue.advanceCollected)}
          sub={`${fmtBDT(revenue.balanceDueTotal)} balance due`}
          accent="blue"
        />
        <HeroStat
          icon={<Percent className="h-5 w-5" />}
          label="Discount Given"
          value={fmtBDT(revenue.discountGiven)}
          sub={`Net revenue ${fmtBDT(revenue.netBookingRevenue)}`}
          accent="rose"
        />
        <HeroStat
          icon={<Banknote className="h-5 w-5" />}
          label="Estimated Commission"
          value={fmtBDT(revenue.estimatedCommission)}
          sub={`Default ${revenue.defaultCommissionRate}% on advance`}
          accent="amber"
        />
      </div>

      {/* This month vs last month */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                This Month vs Last Month
              </h4>
            </div>
            {monthMoMPct !== null && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  monthMoMPct >= 0
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                }`}
              >
                {monthMoMPct >= 0 ? "+" : ""}
                {monthMoMPct}% MoM
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MiniStat
              label="Bookings (this month)"
              value={thisMonth.bookings}
              icon={<CalendarDays className="h-3.5 w-3.5" />}
              cls="text-blue-600 dark:text-blue-400"
            />
            <MiniStat
              label="Bookings (last month)"
              value={prevMonth.bookings}
              icon={<CalendarDays className="h-3.5 w-3.5" />}
              cls="text-gray-500 dark:text-gray-400"
            />
            <MiniStat
              label="Gross (this month)"
              value={fmtBDT(thisMonth.gross)}
              icon={<TrendingUp className="h-3.5 w-3.5" />}
              cls="text-green-600 dark:text-green-400"
            />
            <MiniStat
              label="Gross (last month)"
              value={fmtBDT(prevMonth.gross)}
              icon={<TrendingUp className="h-3.5 w-3.5" />}
              cls="text-gray-500 dark:text-gray-400"
            />
            <MiniStat
              label="Advance (this month)"
              value={fmtBDT(thisMonth.advance)}
              icon={<Receipt className="h-3.5 w-3.5" />}
              cls="text-emerald-600 dark:text-emerald-400"
            />
            <MiniStat
              label="Discount (this month)"
              value={fmtBDT(thisMonth.discount)}
              icon={<Percent className="h-3.5 w-3.5" />}
              cls="text-rose-600 dark:text-rose-400"
            />
          </div>
        </div>

        {/* Cashout & Revenue (extended version) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <Banknote className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Cashout &amp; Revenue
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MiniStat
              label="Eligible for Cashout"
              value={cashouts.eligibleBookings}
              unit="bookings"
              icon={<ArrowRight className="h-3.5 w-3.5" />}
              cls="text-green-600 dark:text-green-400"
            />
            <MiniStat
              label="Pending Payout"
              value={fmtBDT(cashouts.amountsByStatus.PENDING.payout)}
              icon={<Clock className="h-3.5 w-3.5" />}
              cls="text-amber-600 dark:text-amber-400"
            />
            <MiniStat
              label="Approved Cashouts"
              value={cashouts.countsByStatus.APPROVED}
              unit={fmtBDT(cashouts.amountsByStatus.APPROVED.payout)}
              icon={<CheckCircle2 className="h-3.5 w-3.5" />}
              cls="text-blue-600 dark:text-blue-400"
            />
            <MiniStat
              label="Paid Cashouts"
              value={cashouts.countsByStatus.PAID}
              unit={fmtBDT(cashouts.amountsByStatus.PAID.payout)}
              icon={<CheckCircle2 className="h-3.5 w-3.5" />}
              cls="text-emerald-600 dark:text-emerald-400"
            />
            <MiniStat
              label="Rejected Cashouts"
              value={cashouts.countsByStatus.REJECTED}
              unit={fmtBDT(cashouts.amountsByStatus.REJECTED.payout)}
              icon={<XCircle className="h-3.5 w-3.5" />}
              cls="text-rose-600 dark:text-rose-400"
            />
            <MiniStat
              label="Commission Paid"
              value={fmtBDT(cashouts.amountsByStatus.PAID.commission)}
              icon={<Percent className="h-3.5 w-3.5" />}
              cls="text-amber-600 dark:text-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Monthly bar chart */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            Last 6 Months
          </h4>
        </div>
        <div className="flex h-44 items-end gap-3">
          {monthlyFinance.map((m) => {
            const hPct = Math.round((m.gross / maxMonthlyGross) * 100);
            return (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex w-full flex-col items-stretch justify-end" style={{ height: "100%" }}>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-green-700 to-green-400 transition-all"
                    style={{ height: `${Math.max(hPct, 2)}%` }}
                    title={`${fmtBDT(m.gross)} · ${m.bookings} bookings`}
                  />
                </div>
                <p className="text-[10px] font-semibold text-gray-700 dark:text-gray-300">
                  {fmtBDT(m.gross)}
                </p>
                <p className="text-[10px] text-gray-400">{m.month}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-property breakdown */}
      {perHotel.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
            <Building2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Earnings by Property
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-[11px] uppercase tracking-wide text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                <tr>
                  <th className="px-5 py-3">Property</th>
                  <th className="px-3 py-3 text-right">Bookings</th>
                  <th className="px-3 py-3 text-right">Gross</th>
                  <th className="px-3 py-3 text-right">Discount</th>
                  <th className="px-3 py-3 text-right">Advance</th>
                  <th className="px-3 py-3 text-right">Balance Due</th>
                  <th className="px-5 py-3 text-right">Est. Earning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {perHotel.map((h) => (
                  <tr key={h.hotelId} className="text-gray-700 dark:text-gray-300">
                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">
                      {h.hotelName}
                    </td>
                    <td className="px-3 py-3 text-right">{h.bookings}</td>
                    <td className="px-3 py-3 text-right">{fmtBDT(h.gross)}</td>
                    <td className="px-3 py-3 text-right">{fmtBDT(h.discount)}</td>
                    <td className="px-3 py-3 text-right">{fmtBDT(h.advance)}</td>
                    <td className="px-3 py-3 text-right">{fmtBDT(h.balanceDue)}</td>
                    <td className="px-5 py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      {fmtBDT(h.estimatedEarning)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent earnings (per-booking) */}
      {recentEarnings.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Hotel className="h-4 w-4 text-green-600 dark:text-green-400" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Recent Earnings (per booking)
              </h4>
            </div>
            <p className="text-[11px] text-gray-400">Last 10 non-cancelled</p>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentEarnings.map((b) => {
              const sc = VENDOR_BOOKING_STATUS_CONFIG[b.status];
              const cr = b.cashoutRequest;
              const crCfg = cr ? CASHOUT_STATUS_CONFIG[cr.status] : null;
              return (
                <div
                  key={b.id}
                  className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <div className="flex flex-wrap items-center gap-2">
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
                    <p className="flex flex-wrap items-center gap-x-1.5 truncate text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        {b.room.hotel.name} · {b.room.name}
                      </span>
                      {unitLabel(b.unit) && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          <DoorOpen className="h-3 w-3" />
                          {unitLabel(b.unit)}
                        </span>
                      )}
                      {b.guest.name && <span>· {b.guest.name}</span>}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)} · {b.nights} night
                      {b.nights !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-x-4 gap-y-0 text-right sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">
                        {fmtBDT(b.advancePaid)}
                      </p>
                      <p className="text-[10px] text-gray-400">advance</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                        -{fmtBDT(b.commissionAmount)}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {b.commissionRate}% comm.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {fmtBDT(b.earning)}
                      </p>
                      <p className="text-[10px] text-gray-400">your earning</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
