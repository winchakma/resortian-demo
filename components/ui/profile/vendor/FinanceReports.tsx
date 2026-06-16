"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Calendar,
  Search,
  RefreshCw,
  TrendingUp,
  Receipt,
  PiggyBank,
  Banknote,
  Percent,
  Building2,
  Download,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BASE, fmtDate, VENDOR_BOOKING_STATUS_CONFIG } from "@/utils";
import type {
  CashoutStatusKey,
  VendorFinanceReport,
} from "@/types";

function fmtBDT(n: number) {
  return `৳${n.toLocaleString("en-BD")}`;
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
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

function defaultFromDate() {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d;
}

export default function FinanceReports() {
  const { token } = useAuth();
  const [from, setFrom] = useState(isoDate(defaultFromDate()));
  const [to, setTo] = useState(isoDate(new Date()));
  const [data, setData] = useState<VendorFinanceReport | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(
    async (fromStr: string, toStr: string) => {
      if (!token) return;
      setLoading(true);
      try {
        const params = new URLSearchParams({ from: fromStr, to: toStr });
        const res = await fetch(`${BASE}/dashboard/mine/finance/report?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        setData(await res.json());
      } catch {
        toast.error("Failed to load finance report.");
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    load(from, to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (from && to && new Date(from) > new Date(to)) {
      toast.error("'From' must be before 'To'");
      return;
    }
    load(from, to);
  }

  function applyPreset(days: number) {
    const t = new Date();
    const f = new Date();
    f.setDate(f.getDate() - days);
    const ft = isoDate(f);
    const tt = isoDate(t);
    setFrom(ft);
    setTo(tt);
    load(ft, tt);
  }

  function exportCsv() {
    if (!data) return;
    const headers = [
      "Reference",
      "Status",
      "Hotel",
      "Room",
      "Guest",
      "Check-in",
      "Check-out",
      "Nights",
      "Gross",
      "Discount",
      "Advance",
      "Balance Due",
      "Commission Rate",
      "Commission Amount",
      "Earning",
      "Cashout Status",
      "Booked On",
    ];
    const rows = data.bookings.map((b) => [
      b.reference,
      b.status,
      b.room.hotel.name,
      b.room.name,
      b.guest.name ?? "",
      isoDate(new Date(b.checkIn)),
      isoDate(new Date(b.checkOut)),
      b.nights,
      b.totalPrice,
      b.discountAmount,
      b.advancePaid,
      b.balanceDue,
      b.commissionRate,
      b.commissionAmount,
      b.earning,
      b.cashoutRequest?.status ?? "-",
      isoDate(new Date(b.bookedOn)),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `finance-report_${from}_${to}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:flex-row sm:items-end"
      >
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            From
          </label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-900 outline-none transition-colors focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            To
          </label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-900 outline-none transition-colors focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
          >
            <Search className="h-4 w-4" />
            Run
          </button>
          <button
            type="button"
            onClick={() => load(from, to)}
            disabled={loading}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={!data || data.bookings.length === 0}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
        </div>
      </form>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Last 7 days", days: 7 },
          { label: "Last 30 days", days: 30 },
          { label: "Last 90 days", days: 90 },
          { label: "Last 365 days", days: 365 },
        ].map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(p.days)}
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-green-300 hover:bg-green-50 hover:text-green-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-green-700 dark:hover:bg-green-950/30 dark:hover:text-green-400"
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
        </div>
      )}

      {!loading && data && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <HeroStat
              icon={<TrendingUp className="h-5 w-5" />}
              label="Gross Booking Value"
              value={fmtBDT(data.summary.gross)}
              sub={`${data.summary.totalBookings} bookings`}
              accent="green"
            />
            <HeroStat
              icon={<Receipt className="h-5 w-5" />}
              label="Advance Collected"
              value={fmtBDT(data.summary.advance)}
              sub={`${fmtBDT(data.summary.balanceDue)} balance due`}
              accent="blue"
            />
            <HeroStat
              icon={<Banknote className="h-5 w-5" />}
              label="Est. Commission"
              value={fmtBDT(data.summary.estimatedCommission)}
              sub={`Default ${data.summary.defaultCommissionRate}% on advance`}
              accent="amber"
            />
            <HeroStat
              icon={<PiggyBank className="h-5 w-5" />}
              label="Est. Net Earning"
              value={fmtBDT(data.summary.estimatedNetEarning)}
              sub={`Net rev ${fmtBDT(data.summary.netRevenue)}`}
              accent="emerald"
            />
          </div>

          {/* Status summary + Cashout summary */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Bookings by Status
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-left text-[11px] uppercase tracking-wide text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                    <tr>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-3 py-3 text-right">Count</th>
                      <th className="px-3 py-3 text-right">Gross</th>
                      <th className="px-5 py-3 text-right">Advance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {data.statusSummary.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-5 py-6 text-center text-xs text-gray-400">
                          No bookings in range.
                        </td>
                      </tr>
                    )}
                    {data.statusSummary.map((s) => {
                      const sc = VENDOR_BOOKING_STATUS_CONFIG[s.status];
                      return (
                        <tr key={s.status} className="text-gray-700 dark:text-gray-300">
                          <td className="px-5 py-3">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${sc.pill}`}>
                              {sc.label}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-right">{s.count}</td>
                          <td className="px-3 py-3 text-right">{fmtBDT(s.gross)}</td>
                          <td className="px-5 py-3 text-right">{fmtBDT(s.advance)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Cashouts in Range
                </h4>
                <p className="mt-0.5 text-[11px] text-gray-400">
                  Requested between {fmtDate(data.range.from)} and {fmtDate(data.range.to)}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-left text-[11px] uppercase tracking-wide text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                    <tr>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-3 py-3 text-right">Count</th>
                      <th className="px-3 py-3 text-right">Payout</th>
                      <th className="px-5 py-3 text-right">Commission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {Object.keys(data.cashouts.byStatus).length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-5 py-6 text-center text-xs text-gray-400">
                          No cashout requests in range.
                        </td>
                      </tr>
                    )}
                    {Object.entries(data.cashouts.byStatus).map(([status, v]) => {
                      const cfg = CASHOUT_STATUS_CONFIG[status as CashoutStatusKey];
                      return (
                        <tr key={status} className="text-gray-700 dark:text-gray-300">
                          <td className="px-5 py-3">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg?.cls ?? ""}`}>
                              {cfg?.label ?? status}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-right">{v.count}</td>
                          <td className="px-3 py-3 text-right">{fmtBDT(v.payout)}</td>
                          <td className="px-5 py-3 text-right">{fmtBDT(v.commission)}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-gray-50 font-semibold text-gray-900 dark:bg-gray-800/50 dark:text-white">
                      <td className="px-5 py-3">Total</td>
                      <td className="px-3 py-3 text-right">{data.cashouts.total}</td>
                      <td className="px-3 py-3 text-right">{fmtBDT(data.cashouts.totalPayout)}</td>
                      <td className="px-5 py-3 text-right">{fmtBDT(data.cashouts.totalCommission)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Per-property breakdown */}
          {data.perHotel.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                <Building2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Per Property
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
                    {data.perHotel.map((h) => (
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

          {/* Booking-level breakdown */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-green-600 dark:text-green-400" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Bookings in Range
                </h4>
              </div>
              <p className="text-[11px] text-gray-400">{data.bookings.length} rows</p>
            </div>

            {data.bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <XCircle className="h-7 w-7 text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  No bookings in this range
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Adjust the date range and try again.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-left text-[11px] uppercase tracking-wide text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                    <tr>
                      <th className="px-5 py-3">Ref</th>
                      <th className="px-3 py-3">Property / Room</th>
                      <th className="px-3 py-3">Guest</th>
                      <th className="px-3 py-3">Stay</th>
                      <th className="px-3 py-3 text-right">Gross</th>
                      <th className="px-3 py-3 text-right">Discount</th>
                      <th className="px-3 py-3 text-right">Advance</th>
                      <th className="px-3 py-3 text-right">Commission</th>
                      <th className="px-3 py-3 text-right">Earning</th>
                      <th className="px-5 py-3">Cashout</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {data.bookings.map((b) => {
                      const sc = VENDOR_BOOKING_STATUS_CONFIG[b.status];
                      const cr = b.cashoutRequest;
                      const crCfg = cr ? CASHOUT_STATUS_CONFIG[cr.status] : null;
                      return (
                        <tr key={b.id} className="text-gray-700 dark:text-gray-300">
                          <td className="px-5 py-3">
                            <div className="flex flex-col gap-1">
                              <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
                                {b.reference}
                              </span>
                              <span className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${sc.pill}`}>
                                {sc.label}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <p className="text-xs font-medium text-gray-900 dark:text-white">
                              {b.room.hotel.name}
                            </p>
                            <p className="text-[11px] text-gray-400">{b.room.name}</p>
                          </td>
                          <td className="px-3 py-3">
                            <p className="text-xs text-gray-900 dark:text-white">
                              {b.guest.name ?? "—"}
                            </p>
                            <p className="text-[11px] text-gray-400">{b.guest.phone ?? ""}</p>
                          </td>
                          <td className="px-3 py-3 text-xs">
                            <p>{fmtDate(b.checkIn)}</p>
                            <p className="text-[11px] text-gray-400">
                              → {fmtDate(b.checkOut)} · {b.nights}n
                            </p>
                          </td>
                          <td className="px-3 py-3 text-right">{fmtBDT(b.totalPrice)}</td>
                          <td className="px-3 py-3 text-right text-rose-600 dark:text-rose-400">
                            {b.discountAmount ? `-${fmtBDT(b.discountAmount)}` : "—"}
                          </td>
                          <td className="px-3 py-3 text-right">{fmtBDT(b.advancePaid)}</td>
                          <td className="px-3 py-3 text-right text-rose-600 dark:text-rose-400">
                            -{fmtBDT(b.commissionAmount)}
                            <span className="ml-1 text-[10px] text-gray-400">({b.commissionRate}%)</span>
                          </td>
                          <td className="px-3 py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                            {fmtBDT(b.earning)}
                          </td>
                          <td className="px-5 py-3">
                            {crCfg ? (
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${crCfg.cls}`}>
                                {crCfg.label}
                              </span>
                            ) : (
                              <span className="text-[11px] text-gray-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-800/50">
                    <tr className="text-xs font-semibold text-gray-900 dark:text-white">
                      <td className="px-5 py-3" colSpan={4}>
                        Totals (range)
                      </td>
                      <td className="px-3 py-3 text-right">{fmtBDT(data.summary.gross)}</td>
                      <td className="px-3 py-3 text-right text-rose-600 dark:text-rose-400">
                        -{fmtBDT(data.summary.discount)}
                      </td>
                      <td className="px-3 py-3 text-right">{fmtBDT(data.summary.advance)}</td>
                      <td className="px-3 py-3 text-right text-rose-600 dark:text-rose-400">
                        -{fmtBDT(data.summary.estimatedCommission)}
                      </td>
                      <td className="px-3 py-3 text-right text-emerald-600 dark:text-emerald-400">
                        {fmtBDT(data.summary.estimatedNetEarning)}
                      </td>
                      <td className="px-5 py-3" />
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
