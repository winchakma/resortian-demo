"use client";

import { Booking, BookingStatus } from "@/types";
import { Search, X, CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";
import BookingCard from "./BookingCard";

type StatusFilter = "all" | BookingStatus;

export default function BookingsSection({ bookings }: { bookings: Booking[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      const matchesQuery =
        !q ||
        b.hotelName.toLowerCase().includes(q) ||
        b.reference.toLowerCase().includes(q) ||
        b.roomName.toLowerCase().includes(q) ||
        b.hotelLocation.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [bookings, query, statusFilter]);

  const statusTabs: { id: StatusFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: bookings.length },
    {
      id: "upcoming",
      label: "Upcoming",
      count: bookings.filter((b) => b.status === "upcoming").length,
    },
    {
      id: "completed",
      label: "Completed",
      count: bookings.filter((b) => b.status === "completed").length,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      count: bookings.filter((b) => b.status === "cancelled").length,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              My Bookings
            </h3>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
              {bookings.length} booking{bookings.length !== 1 ? "s" : ""} in
              total
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by hotel or reference…"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-8 text-sm text-gray-900 outline-none transition-colors focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
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
                    ? "border-primary-600 text-primary-700 dark:border-primary-400 dark:text-primary-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      active
                        ? "bg-primary-100 text-primary-700 dark:bg-primary-950/50 dark:text-primary-400"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <CalendarDays className="h-7 w-7 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              No bookings found
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {query
                ? "Try a different search term."
                : "You have no bookings in this category yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
