"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { getSupportConversation, listConversations } from "@/utils/chat";
import type { ChatConversation } from "@/types";
import ConversationList from "./ConversationList";
import MessageThread from "./MessageThread";
import { MessageCircle, Loader2 } from "lucide-react";

/**
 * Two-pane chat panel rendered inside ProfileContent.
 * - Left: conversation list (clicking selects)
 * - Right: thread for the selected conversation
 *
 * Stays sync'd with `conversation:updated` socket events so the list reorders
 * and shows new last-message previews without a full refetch.
 */
export default function MessagesPanel() {
  const { token, user } = useAuth();
  const { onConversationUpdated, connected } = useSocket();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [support, setSupport] = useState<ChatConversation | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!token) return;
    try {
      const [convoRes, supportRes] = await Promise.all([
        listConversations(token, 1, 50),
        // Only customers get a pinned support thread. Vendors don't.
        user?.role === "HOTEL_OWNER"
          ? Promise.resolve(null)
          : getSupportConversation(token).catch(() => null),
      ]);
      // Strip the support row out of the regular list — we render it pinned.
      const supportId = supportRes?.id;
      setConversations(convoRes.data.filter((c) => c.id !== supportId));
      setSupport(supportRes);
      setSelectedId((prev) => prev ?? supportId ?? convoRes.data[0]?.id ?? null);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [token, user?.role]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  // Re-fetch the list when ANY conversation gets updated. Cheap because the
  // list is paginated to 50 and indexed; avoids hand-syncing every counter.
  useEffect(() => {
    return onConversationUpdated(() => {
      void refetch();
    });
  }, [onConversationUpdated, refetch]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <Loader2 className="h-5 w-5 animate-spin text-black" />
      </div>
    );
  }

  if (conversations.length === 0 && !support) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-900">
        <MessageCircle className="h-10 w-10 text-gray-300 dark:text-gray-600" />
        <h3 className="text-base font-semibold text-black dark:text-white">
          No conversations yet
        </h3>
        <p className="max-w-sm text-sm text-black dark:text-gray-400">
          Conversations are created automatically when your booking is
          confirmed. Once a guest pays, you can chat here.
        </p>
      </div>
    );
  }

  const selected =
    [support, ...conversations].find((c) => c?.id === selectedId) ?? null;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="grid h-[75vh] grid-cols-1 sm:grid-cols-[18rem_1fr] lg:grid-cols-[22rem_1fr]">
        {/* List — hidden on mobile when a thread is open so the user gets a
            full-screen conversation view (no empty gap above). */}
        <div
          className={`min-h-0 overflow-hidden ${
            selected ? "hidden sm:flex" : "flex"
          } flex-col`}
        >
          <ConversationList
            items={conversations}
            pinned={support}
            selectedId={selectedId}
            onSelect={setSelectedId}
            connected={connected}
          />
        </div>

        {/* Thread — shown on desktop always, only on mobile when selected. */}
        <div
          className={`min-h-0 overflow-hidden sm:border-l sm:border-gray-100 dark:sm:border-gray-800 ${
            selected ? "flex" : "hidden sm:flex"
          } flex-col`}
        >
          {selected ? (
            <MessageThread
              key={selected.id}
              conversation={selected}
              onChanged={refetch}
              onBack={() => setSelectedId(null)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-black">
              Select a conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
