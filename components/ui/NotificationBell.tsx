"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bell,
  CalendarPlus,
  CheckCircle2,
  LogIn,
  LogOut,
  XCircle,
  Building2,
  BedDouble,
  CheckCircle,
} from "lucide-react";
import { useNotifications, type AppNotification } from "@/hooks/useNotifications";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  BOOKING_CREATED: <CalendarPlus className="h-4 w-4 text-blue-500" />,
  BOOKING_CONFIRMED: <CheckCircle className="h-4 w-4 text-primary-500" />,
  GUEST_CHECKIN: <LogIn className="h-4 w-4 text-emerald-500" />,
  GUEST_CHECKOUT: <LogOut className="h-4 w-4 text-amber-500" />,
  EARLY_CHECKOUT_REQUEST: <LogOut className="h-4 w-4 text-orange-500" />,
  BOOKING_COMPLETED: <CheckCircle2 className="h-4 w-4 text-primary-600" />,
  BOOKING_CANCELLED: <XCircle className="h-4 w-4 text-red-500" />,
  HOTEL_APPROVAL_REQUEST: <Building2 className="h-4 w-4 text-violet-500" />,
  ROOM_APPROVAL_REQUEST: <BedDouble className="h-4 w-4 text-indigo-500" />,
};

function NotificationItem({
  notification,
  onRead,
}: {
  notification: AppNotification;
  onRead: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => !notification.isRead && onRead(notification.id)}
      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60 ${
        !notification.isRead ? "bg-primary-50/40 dark:bg-primary-950/10" : ""
      }`}
    >
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        {TYPE_ICON[notification.type] ?? <Bell className="h-4 w-4 text-black" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-xs font-semibold ${notification.isRead ? "text-black dark:text-gray-400" : "text-black dark:text-white"}`}>
          {notification.title}
        </p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-black dark:text-gray-400">
          {notification.body}
        </p>
        <p className="mt-1 text-[10px] text-black dark:text-gray-500">
          {relativeTime(notification.createdAt)}
        </p>
      </div>
      {!notification.isRead && (
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-500" />
      )}
    </button>
  );
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const {
    items,
    unreadCount,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    markRead,
    markAllRead,
  } = useNotifications();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el || loadingMore || !hasMore) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) {
      loadMore();
    }
  }, [loadingMore, hasMore, loadMore]);

  const badgeCount = Math.min(unreadCount, 99);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-black/10 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <Bell className="h-5 w-5" />
        {badgeCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold text-white">
            {badgeCount > 9 ? "9+" : badgeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-2 top-16 z-50 w-auto overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 dark:border-gray-700 dark:bg-gray-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
            <span className="text-sm font-semibold text-black dark:text-white">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-primary-100 px-1.5 py-0.5 text-[10px] font-bold text-primary-700 dark:bg-primary-950/40 dark:text-primary-400">
                  {unreadCount}
                </span>
              )}
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[11px] font-medium text-primary-600 hover:underline dark:text-primary-400"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-96 overflow-y-auto"
          >
            {loading && items.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-primary-500" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12">
                <Bell className="h-8 w-8 text-gray-200 dark:text-gray-700" />
                <p className="text-xs text-black dark:text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {items.map((n) => (
                    <NotificationItem key={n.id} notification={n} onRead={markRead} />
                  ))}
                </div>

                {/* Scroll sentinel */}
                {loadingMore && (
                  <div className="flex items-center justify-center py-4">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-primary-500" />
                  </div>
                )}
                {!hasMore && items.length > 0 && (
                  <p className="py-3 text-center text-[10px] text-black dark:text-gray-600">
                    All caught up
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
