"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { BASE, inputCls, labelCls } from "@/utils";
import {
  CalendarRange,
  Search,
  RefreshCw,
  Building2,
  BedDouble,
} from "lucide-react";
import type {
  VendorHotel,
  CalendarData,
  CalendarUnit,
  CalendarBooking,
} from "@/types";

// ── Helpers ────────────────────────────────────────────────────────────────

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function addDays(date: string, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function getDateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const cur = new Date(start);
  const last = new Date(end);
  while (cur <= last) {
    dates.push(cur.toISOString().split("T")[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function formatDayHeader(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    num: d.getDate(),
  };
}

function isToday(dateStr: string) {
  return dateStr === todayStr();
}

type CellData =
  | { type: "available"; date: string }
  | {
      type: "booking-start";
      booking: CalendarBooking;
      colspan: number;
      date: string;
    };

function computeRow(unit: CalendarUnit, dates: string[]): CellData[] {
  const cells: CellData[] = [];
  let i = 0;
  while (i < dates.length) {
    const date = dates[i];
    const booking =
      unit.bookings.find((b) => b.checkIn <= date && b.checkOut > date) ??
      null;
    if (booking) {
      let span = 0;
      while (i + span < dates.length) {
        const d = dates[i + span];
        if (booking.checkIn <= d && booking.checkOut > d) span++;
        else break;
      }
      cells.push({ type: "booking-start", booking, colspan: span, date });
      i += span;
    } else {
      cells.push({ type: "available", date });
      i++;
    }
  }
  return cells;
}

// ── Status colours ─────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  CONFIRMED: "bg-emerald-500",
  PENDING: "bg-amber-400",
  COMPLETED: "bg-blue-500",
};

function bookingColor(status: string) {
  return STATUS_COLOR[status] ?? "bg-gray-500";
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function VendorCalendar() {
  const { token } = useAuth();

  const [hotels, setHotels] = useState<VendorHotel[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState(true);

  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [startDate, setStartDate] = useState(todayStr());
  const [endDate, setEndDate] = useState(addDays(todayStr(), 13));

  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Load vendor hotels once ─────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    setHotelsLoading(true);
    fetch(`${BASE}/hotels/mine?limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => {
        setHotels(json.data ?? []);
        if (json.data?.length > 0) setSelectedHotelId(json.data[0].id);
      })
      .catch(() => {})
      .finally(() => setHotelsLoading(false));
  }, [token]);

  // ── Derived state ───────────────────────────────────────────────────────
  const selectedHotel = hotels.find((h) => h.id === selectedHotelId);
  const rooms = selectedHotel?.rooms ?? [];

  // ── Search ──────────────────────────────────────────────────────────────
  async function handleSearch() {
    if (!selectedHotelId) return;
    if (!startDate || !endDate) return;
    setLoading(true);
    setError(null);
    setCalendarData(null);
    try {
      const params = new URLSearchParams({ startDate, endDate });
      if (selectedRoomId) params.set("roomId", selectedRoomId);
      const res = await fetch(
        `${BASE}/hotels/${selectedHotelId}/calendar?${params}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message ?? "Failed to load calendar");
      }
      const data: CalendarData = await res.json();
      setCalendarData(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load calendar");
    } finally {
      setLoading(false);
    }
  }

  // ── Derived calendar data ───────────────────────────────────────────────
  const dates =
    calendarData ? getDateRange(calendarData.startDate, calendarData.endDate) : [];

  // flatten rooms → units into rows
  const rows: { roomName: string; unit: CalendarUnit }[] =
    calendarData?.rooms.flatMap((room) =>
      room.units.map((unit) => ({ roomName: room.name, unit })),
    ) ?? [];

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Search form card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-2">
          <CalendarRange className="h-5 w-5 text-green-600 dark:text-green-400" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Schedule &amp; Calendar
          </h2>
        </div>
        <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
          Select a hotel, optional room filter and date range, then click Search
          to load the occupancy matrix.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Hotel select */}
          <div>
            <label className={labelCls()}>
              <Building2 className="mr-1 inline h-3.5 w-3.5" />
              Property
            </label>
            {hotelsLoading ? (
              <div className="h-11 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
            ) : (
              <select
                className={inputCls()}
                value={selectedHotelId}
                onChange={(e) => {
                  setSelectedHotelId(e.target.value);
                  setSelectedRoomId("");
                  setCalendarData(null);
                }}
              >
                {hotels.length === 0 && (
                  <option value="">No hotels found</option>
                )}
                {hotels.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Room select */}
          <div>
            <label className={labelCls()}>
              <BedDouble className="mr-1 inline h-3.5 w-3.5" />
              Room type (optional)
            </label>
            <select
              className={inputCls()}
              value={selectedRoomId}
              onChange={(e) => {
                setSelectedRoomId(e.target.value);
                setCalendarData(null);
              }}
              disabled={!selectedHotelId || rooms.length === 0}
            >
              <option value="">All rooms</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start date */}
          <div>
            <label className={labelCls()}>From</label>
            <input
              type="date"
              className={inputCls()}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCalendarData(null);
              }}
            />
          </div>

          {/* End date */}
          <div>
            <label className={labelCls()}>To</label>
            <input
              type="date"
              className={inputCls()}
              value={endDate}
              min={startDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCalendarData(null);
              }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded bg-emerald-500" />
              Confirmed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded bg-amber-400" />
              Pending
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded bg-blue-500" />
              Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800" />
              Available
            </span>
          </div>

          <button
            type="button"
            onClick={handleSearch}
            disabled={loading || !selectedHotelId}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Search
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 h-5 w-48 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded bg-gray-100 dark:bg-gray-800"
              />
            ))}
          </div>
        </div>
      )}

      {/* Calendar matrix */}
      {calendarData && !loading && (
        <CalendarMatrix
          hotel={calendarData.hotel}
          dates={dates}
          rows={rows}
        />
      )}

      {/* Empty state after search */}
      {calendarData && !loading && rows.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <BedDouble className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            No active rooms or units found for the selected filters.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Calendar Matrix sub-component ──────────────────────────────────────────

const COL_WIDTH = 72; // px per date column
const ROW_LABEL_WIDTH = 140; // px for the room label column

interface MatrixProps {
  hotel: { id: string; name: string };
  dates: string[];
  rows: { roomName: string; unit: CalendarUnit }[];
}

function CalendarMatrix({ hotel, dates, rows }: MatrixProps) {
  if (rows.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5 dark:border-gray-800">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            {hotel.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {dates.length}-day room occupancy timeline.
          </p>
        </div>
      </div>

      {/* Scrollable table wrapper */}
      <div className="overflow-x-auto">
        <table
          className="border-collapse text-xs"
          style={{ minWidth: ROW_LABEL_WIDTH + dates.length * COL_WIDTH }}
        >
          {/* Header row */}
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th
                className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:bg-gray-800/80 dark:text-gray-400"
                style={{ width: ROW_LABEL_WIDTH, minWidth: ROW_LABEL_WIDTH }}
              >
                ROOM
              </th>
              {dates.map((date) => {
                const { day, num } = formatDayHeader(date);
                const today = isToday(date);
                return (
                  <th
                    key={date}
                    className="border-l border-gray-100 py-2 text-center dark:border-gray-800"
                    style={{ width: COL_WIDTH, minWidth: COL_WIDTH }}
                  >
                    <span
                      className={`block text-[10px] font-semibold ${today ? "text-green-500 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}`}
                    >
                      {day}
                    </span>
                    <span
                      className={`mt-0.5 block text-sm font-bold ${today ? "text-green-600 dark:text-green-400" : "text-gray-700 dark:text-gray-200"}`}
                    >
                      {num}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Body rows */}
          <tbody>
            {rows.map(({ roomName, unit }) => {
              const cells = computeRow(unit, dates);
              return (
                <tr
                  key={unit.id}
                  className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                >
                  {/* Room label cell (sticky) */}
                  <td
                    className="sticky left-0 z-10 bg-white px-4 py-3 dark:bg-gray-900"
                    style={{ width: ROW_LABEL_WIDTH, minWidth: ROW_LABEL_WIDTH }}
                  >
                    <span className="block font-semibold text-gray-800 dark:text-gray-100">
                      {unit.unitName}
                    </span>
                    <span className="block text-[10px] text-gray-400 dark:text-gray-500">
                      {roomName}
                      {unit.floorNumber != null
                        ? ` · Floor ${unit.floorNumber}`
                        : ""}
                    </span>
                  </td>

                  {/* Date cells */}
                  {cells.map((cell) => {
                    if (cell.type === "available") {
                      return (
                        <td
                          key={cell.date}
                          className="border-l border-gray-100 p-0.5 dark:border-gray-800"
                          style={{ width: COL_WIDTH, minWidth: COL_WIDTH }}
                        />
                      );
                    }

                    const colorCls = bookingColor(cell.booking.status);
                    return (
                      <td
                        key={cell.date}
                        colSpan={cell.colspan}
                        className="border-l border-gray-100 p-0.5 dark:border-gray-800"
                        style={{ minWidth: COL_WIDTH }}
                      >
                        <div
                          className={`${colorCls} group relative flex h-9 cursor-default items-center overflow-hidden rounded-md px-2`}
                          title={`${cell.booking.guestName} · ${cell.booking.guestPhone} · ${cell.booking.reference}`}
                        >
                          <span className="truncate text-[11px] font-semibold uppercase tracking-wide text-white">
                            {cell.booking.guestName}
                          </span>
                          {/* Tooltip on hover */}
                          <div className="pointer-events-none absolute bottom-full left-0 z-20 mb-1.5 hidden min-w-[160px] rounded-xl border border-gray-200 bg-white p-2.5 shadow-lg group-hover:block dark:border-gray-700 dark:bg-gray-900">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {cell.booking.guestName}
                            </p>
                            {cell.booking.guestPhone && (
                              <p className="mt-0.5 text-gray-500 dark:text-gray-400">
                                {cell.booking.guestPhone}
                              </p>
                            )}
                            <p className="mt-1 rounded bg-gray-50 px-1.5 py-0.5 font-mono text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                              {cell.booking.reference}
                            </p>
                            <p className="mt-1 text-gray-400 dark:text-gray-500">
                              {cell.booking.checkIn} → {cell.booking.checkOut}
                            </p>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
