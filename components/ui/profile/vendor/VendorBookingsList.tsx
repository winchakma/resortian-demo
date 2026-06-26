"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { BankInfo, VendorBooking, VendorBookingStatusFilter } from "@/types";
import { CalendarDays, RefreshCw, X, Search } from "lucide-react";
import { BASE } from "@/utils";
import VendorBookingRow from "./VendorBookingRow";

export default function VendorBookingsList() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<VendorBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] =
    useState<VendorBookingStatusFilter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasBankInfo, setHasBankInfo] = useState(false);

  const loadBookings = useCallback(
    async (p = 1, status: VendorBookingStatusFilter = "all", q = "") => {
      if (!token) return;
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(p), limit: "10" });
        if (status !== "all") params.set("status", status);
        if (q.trim()) {
          params.set("search", q.trim());
          params.set("searchField", "reference");
        }
        const res = await fetch(`${BASE}/bookings/mine?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const json = await res.json();
        setBookings(json.data ?? []);
        setTotal(json.meta?.total ?? 0);
        setTotalPages(json.meta?.totalPages ?? 1);
      } catch {
        toast.error("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/users/me/bank-info`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => {
        const info: BankInfo | null = json ?? null;
        if (info) {
          setHasBankInfo(
            !!(
              info.accountNumber ||
              info.bkashNumber ||
              info.nagadNumber ||
              info.rocketNumber
            ),
          );
        }
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    loadBookings(1, statusFilter, query);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    loadBookings(1, statusFilter, query);
  }

  function goToPage(p: number) {
    setPage(p);
    loadBookings(p, statusFilter, query);
  }

  const statusTabs: { id: VendorBookingStatusFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "CONFIRMED", label: "Confirmed" },
    { id: "PENDING", label: "Pending" },
    { id: "COMPLETED", label: "Completed" },
    { id: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-black dark:text-white">
            Guest Bookings
          </h3>
          <p className="text-xs text-black dark:text-gray-500">
            {loading
              ? "Loading…"
              : `${total} booking${total !== 1 ? "s" : ""} across your hotels`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadBookings(page, statusFilter, query)}
          disabled={loading}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-black transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          title="Refresh"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {/* Search */}
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by booking reference…"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-8 text-sm text-black outline-none transition-colors focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setPage(1);
                  loadBookings(1, statusFilter, "");
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Status tabs */}
        <div className="flex overflow-x-auto border-b border-gray-100 dark:border-gray-800">
          {statusTabs.map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "border-green-600 text-green-700 dark:border-green-400 dark:text-green-400"
                    : "border-transparent text-black hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <CalendarDays className="h-7 w-7 text-black" />
            </div>
            <p className="text-sm font-semibold text-black dark:text-gray-300">
              No bookings found
            </p>
            <p className="mt-1 text-xs text-black dark:text-gray-500">
              {query
                ? "Try a different reference."
                : "No bookings in this category yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {bookings.map((b) => (
              <VendorBookingRow
                key={b.id}
                booking={b}
                hasBankInfo={hasBankInfo}
                onCashoutRequested={() => loadBookings(page, statusFilter, query)}
                onUpdated={() => loadBookings(page, statusFilter, query)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 dark:border-gray-800">
            <p className="text-xs text-black">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1 || loading}
                className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages || loading}
                className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
