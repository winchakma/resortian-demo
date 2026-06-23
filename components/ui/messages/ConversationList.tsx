"use client";

import { useMemo, useState } from "react";
import { LifeBuoy, Search } from "lucide-react";
import type { ChatConversation } from "@/types";
import { initials } from "@/utils";

interface Props {
  items: ChatConversation[];
  /** The customer's persistent support thread — pinned at the top. */
  pinned?: ChatConversation | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
  connected: boolean;
}

function supportStatusLabel(c: ChatConversation): string {
  if (c.supportStatus === "ASSIGNED" && c.assignedAdmin) {
    return `Agent ${c.assignedAdmin.name}`;
  }
  if (c.supportStatus === "RESOLVED") return "Resolved";
  return "Waiting for agent";
}

function formatTime(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const oneDay = 24 * 60 * 60 * 1000;
  if (now.getTime() - d.getTime() < 7 * oneDay) {
    return d.toLocaleDateString([], { weekday: "short" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function ConversationList({
  items,
  pinned,
  selectedId,
  onSelect,
  connected,
}: Props) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((c) => {
      const name = c.counterpart?.name ?? "";
      const hotel = c.hotel?.name ?? "";
      const ref = c.booking?.reference ?? "";
      return (
        name.toLowerCase().includes(q) ||
        hotel.toLowerCase().includes(q) ||
        ref.toLowerCase().includes(q)
      );
    });
  }, [items, query]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-gray-50 dark:bg-gray-950/40">
      <div className="border-b border-gray-100 p-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <h3 className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">
            Messages
          </h3>
          <span
            className={`inline-flex h-2 w-2 rounded-full ${connected ? "bg-emerald-500" : "bg-gray-300"}`}
            title={connected ? "Connected" : "Offline"}
          />
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by hotel, guest, or RST-…"
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-8 pr-3 text-sm outline-none focus:border-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto py-1">
        {pinned && (
          <li>
            <button
              type="button"
              onClick={() => onSelect(pinned.id)}
              className={`flex w-full items-start gap-3 border-b border-gray-100 px-3 py-3 text-left transition-colors dark:border-gray-800 ${
                pinned.id === selectedId
                  ? "bg-primary-50 dark:bg-primary-950/30"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                <LifeBuoy className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    Resortian Support
                  </p>
                  <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                    Support
                  </span>
                </div>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {supportStatusLabel(pinned)}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                  {pinned.lastMessage ?? "Send a message to get started"}
                </p>
              </div>
              {pinned.unread > 0 && (
                <span className="ml-2 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 px-1.5 text-[10px] font-bold text-white">
                  {pinned.unread}
                </span>
              )}
            </button>
          </li>
        )}
        {filtered.length === 0 && !pinned && (
          <li className="px-4 py-6 text-center text-sm text-gray-400">
            No matches
          </li>
        )}
        {filtered.map((c) => {
          const active = c.id === selectedId;
          const name = c.counterpart?.name ?? "Unknown";
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                className={`flex w-full items-start gap-3 px-3 py-3 text-left transition-colors ${
                  active
                    ? "bg-primary-50 dark:bg-primary-950/30"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-400 text-xs font-bold text-white">
                  {initials(name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {name}
                    </p>
                    <span className="shrink-0 text-[10px] text-gray-400">
                      {formatTime(c.lastMessageAt)}
                    </span>
                  </div>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {c.hotel?.name ?? "—"}
                    {c.booking?.reference ? ` · ${c.booking.reference}` : ""}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                    {c.lastMessage ?? "No messages yet"}
                  </p>
                </div>
                {c.unread > 0 && (
                  <span className="ml-2 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 px-1.5 text-[10px] font-bold text-white">
                    {c.unread}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
