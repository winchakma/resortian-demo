"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";
const POLL_MS = 30_000;
const PAGE_LIMIT = 20;

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, string> | null;
  isRead: boolean;
  createdAt: string;
}

export function useNotifications() {
  const { token } = useAuth();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const pageRef = useRef(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPage = useCallback(
    async (pageNum: number, mode: "init" | "poll" | "more") => {
      if (!token) return;
      if (mode === "more") setLoadingMore(true);
      else if (mode === "init") setLoading(true);

      try {
        const res = await fetch(
          `${BASE}/notifications?page=${pageNum}&limit=${PAGE_LIMIT}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!res.ok) return;
        const json = await res.json();
        const incoming: AppNotification[] = json.data ?? [];
        const meta = json.meta ?? {};
        const totalPages: number = meta.totalPages ?? 1;

        setUnreadCount(meta.unreadCount ?? 0);
        setHasMore(pageNum < totalPages);

        setItems((prev) => {
          if (mode === "init") return incoming;

          if (mode === "poll") {
            // Merge: prepend genuinely new items, update read-status of existing ones
            const existingIds = new Set(prev.map((n) => n.id));
            const brandNew = incoming.filter((n) => !existingIds.has(n.id));
            const updatedMap = new Map(incoming.map((n) => [n.id, n]));
            const merged = prev.map((n) => updatedMap.get(n.id) ?? n);
            return brandNew.length ? [...brandNew, ...merged] : merged;
          }

          // mode === "more": dedupe-append
          const existingIds = new Set(prev.map((n) => n.id));
          return [...prev, ...incoming.filter((n) => !existingIds.has(n.id))];
        });

        if (mode !== "more") pageRef.current = 1;
        else pageRef.current = pageNum;
      } catch {
        // notifications are non-critical — silent fail
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [token],
  );

  useEffect(() => {
    if (!token) {
      setItems([]);
      setUnreadCount(0);
      setHasMore(false);
      pageRef.current = 1;
      return;
    }
    void fetchPage(1, "init");
    intervalRef.current = setInterval(() => fetchPage(1, "poll"), POLL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [token, fetchPage]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    void fetchPage(pageRef.current + 1, "more");
  }, [loadingMore, hasMore, fetchPage]);

  const markRead = useCallback(
    async (id: string) => {
      if (!token) return;
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      await fetch(`${BASE}/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    },
    [token],
  );

  const markAllRead = useCallback(async () => {
    if (!token) return;
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    await fetch(`${BASE}/notifications/read-all`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }, [token]);

  return {
    items,
    unreadCount,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    markRead,
    markAllRead,
  };
}
