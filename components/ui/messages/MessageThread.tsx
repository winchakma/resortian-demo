"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { ArrowLeft, ChevronUp, LifeBuoy, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { listMessages, resolveAttachmentUrl } from "@/utils/chat";
import type { ChatConversation, ChatMessage } from "@/types";
import { initials } from "@/utils";
import MessageComposer from "./MessageComposer";
import SupportStatusBanner from "./SupportStatusBanner";

interface Props {
  conversation: ChatConversation;
  onChanged: () => void;
  onBack?: () => void;
}

/**
 * Single-conversation thread.
 * - Joins the conversation room on mount (server marks all read, decrements badge)
 * - Lazy-loads older pages via cursor when the user scrolls to the top
 * - Renders optimistic outgoing messages immediately, reconciles on ack
 */
export default function MessageThread({
  conversation,
  onChanged,
  onBack,
}: Props) {
  const { token, user } = useAuth();
  const {
    connected,
    joinConversation,
    leaveConversation,
    onMessage,
    onMessageAck,
    onTyping,
  } = useSocket();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [peerTyping, setPeerTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Initial load
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoadingInitial(true);
    listMessages(token, conversation.id, undefined, 30)
      .then((page) => {
        if (cancelled) return;
        setMessages(page.data);
        setCursor(page.meta.nextCursor);
        setHasMore(page.meta.hasMore);
        // Scroll to bottom on first paint
        requestAnimationFrame(() => {
          const el = scrollRef.current;
          if (el) el.scrollTop = el.scrollHeight;
        });
      })
      .finally(() => !cancelled && setLoadingInitial(false));
    return () => {
      cancelled = true;
    };
  }, [token, conversation.id]);

  // Join/leave the conversation room. Server auto-marks-read on join.
  //
  // Gated on `connected` so we re-emit `conversation:join` after a reconnect:
  // Socket.io rooms live on the *server-side* socket, which is recreated on
  // every reconnect. Without this re-join the server keeps broadcasting
  // `message:new` to the conversation room but the customer's fresh
  // server-side socket isn't in it any more — i.e. messages stop appearing
  // in real time even though the client socket itself shows "connected".
  useEffect(() => {
    if (!connected) return;
    joinConversation(conversation.id);
    return () => leaveConversation(conversation.id);
  }, [conversation.id, connected, joinConversation, leaveConversation]);

  // Backfill on (re)connect — covers the window during a brief disconnect
  // where the server broadcast `message:new` to a room we weren't in. Pulls
  // the latest page and merges, preserving any pending optimistic temps so
  // the user's own in-flight message isn't wiped.
  useEffect(() => {
    if (!token || !connected) return;
    let cancelled = false;
    listMessages(token, conversation.id, undefined, 30)
      .then((page) => {
        if (cancelled) return;
        setMessages((prev) => {
          const optimistic = prev.filter((m) => m.id.startsWith("temp-"));
          const fetchedIds = new Set(page.data.map((m) => m.id));
          // Drop any optimistic temp whose real counterpart is already in the
          // fetched page (server saw it before the disconnect).
          const stillPending = optimistic.filter(
            (m) =>
              !page.data.some(
                (s) => s.body === m.body && s.senderId === m.senderId,
              ),
          );
          return [
            ...page.data.filter((m) => !fetchedIds.has(`temp-${m.id}`)),
            ...stillPending,
          ];
        });
        setCursor(page.meta.nextCursor);
        setHasMore(page.meta.hasMore);
      })
      .catch(() => {
        // ignore — next reconnect will retry
      });
    return () => {
      cancelled = true;
    };
  }, [token, connected, conversation.id]);

  // Listen for new messages
  useEffect(() => {
    return onMessage(conversation.id, (msg) => {
      setMessages((prev) => {
        // Reconcile: if optimistic temp exists, replace it
        const tempIdx = prev.findIndex(
          (m) => m.id.startsWith("temp-") && m.body === msg.body && m.senderId === msg.senderId,
        );
        if (tempIdx >= 0) {
          const next = [...prev];
          next[tempIdx] = msg;
          return next;
        }
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      // Scroll to bottom if we were already near it
      requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (!el) return;
        const nearBottom =
          el.scrollHeight - el.scrollTop - el.clientHeight < 150;
        if (nearBottom) el.scrollTop = el.scrollHeight;
      });
    });
  }, [conversation.id, onMessage]);

  // Listen for acks — replace optimistic id with server id
  useEffect(() => {
    return onMessageAck(({ clientTempId, messageId, conversationId }) => {
      if (conversationId !== conversation.id || !clientTempId) return;
      setMessages((prev) =>
        prev.map((m) => (m.id === clientTempId ? { ...m, id: messageId } : m)),
      );
    });
  }, [conversation.id, onMessageAck]);

  // Typing indicator
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return onTyping((t) => {
      if (t.conversationId !== conversation.id) return;
      if (t.userId === user?.id) return;
      setPeerTyping(t.typing);
      if (timeout) clearTimeout(timeout);
      if (t.typing) timeout = setTimeout(() => setPeerTyping(false), 3000);
    });
  }, [conversation.id, onTyping, user?.id]);

  const loadOlder = useCallback(async () => {
    if (!token || !cursor || loadingMore) return;
    setLoadingMore(true);
    const el = scrollRef.current;
    const prevHeight = el?.scrollHeight ?? 0;
    try {
      const page = await listMessages(token, conversation.id, cursor, 30);
      setMessages((prev) => [...page.data, ...prev]);
      setCursor(page.meta.nextCursor);
      setHasMore(page.meta.hasMore);
      requestAnimationFrame(() => {
        const el2 = scrollRef.current;
        if (el2) el2.scrollTop = el2.scrollHeight - prevHeight;
      });
    } finally {
      setLoadingMore(false);
    }
  }, [token, cursor, loadingMore, conversation.id]);

  const addOptimistic = useCallback(
    (tempId: string, body: string, attachments: string[]) => {
      if (!user) return;
      const msg: ChatMessage = {
        id: tempId,
        conversationId: conversation.id,
        senderId: user.id,
        senderRole: conversation.viewerSide,
        type: attachments.length > 0 && !body ? "IMAGE" : "TEXT",
        body: body || null,
        attachments,
        readAt: null,
        createdAt: new Date().toISOString(),
        sender: { id: user.id, name: user.name, avatar: user.avatar ?? null },
      };
      setMessages((prev) => [...prev, msg]);
      requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      });
    },
    [conversation.id, conversation.viewerSide, user],
  );

  const isSupport = conversation.kind === "SUPPORT";
  const counterpartName = isSupport
    ? "Resortian Support"
    : (conversation.counterpart?.name ?? "Conversation");
  const subtitle = isSupport
    ? conversation.assignedAdmin
      ? `Agent ${conversation.assignedAdmin.name}`
      : "Customer support"
    : `${conversation.hotel?.name ?? ""}${conversation.booking?.reference ? ` · ${conversation.booking.reference}` : ""}`;
  const groups = useMemo(() => groupByDay(messages), [messages]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full ${
            isSupport
              ? "bg-gradient-to-br from-amber-500 to-orange-500"
              : "bg-gradient-to-br from-primary-600 to-primary-400"
          } text-xs font-bold text-white`}
        >
          {isSupport ? (
            <LifeBuoy className="h-5 w-5" />
          ) : (
            initials(counterpartName)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
            {counterpartName}
          </p>
          <p className="truncate text-[11px] text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        </div>
      </div>

      {isSupport && <SupportStatusBanner conversation={conversation} />}

      {/* Messages */}
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4"
      >
        {hasMore && (
          <button
            type="button"
            onClick={loadOlder}
            disabled={loadingMore}
            className="mx-auto flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {loadingMore ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <ChevronUp className="h-3 w-3" />
            )}
            Load older
          </button>
        )}

        {loadingInitial && (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        )}

        {groups.map((group) => (
          <div key={group.day} className="space-y-2">
            <div className="my-2 flex justify-center">
              <span className="rounded-full bg-gray-100 px-3 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                {group.label}
              </span>
            </div>
            {group.messages.map((m) => (
              <MessageBubble
                key={m.id}
                msg={m}
                viewerId={user?.id ?? ""}
              />
            ))}
          </div>
        ))}

        {peerTyping && (
          <div className="flex items-center gap-1.5 px-1 text-xs text-gray-400">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400" />
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400 [animation-delay:120ms]" />
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400 [animation-delay:240ms]" />
            <span className="ml-1">typing…</span>
          </div>
        )}
      </div>

      <MessageComposer
        conversationId={conversation.id}
        onOptimistic={addOptimistic}
        onSent={onChanged}
      />
    </div>
  );
}

function MessageBubble({
  msg,
  viewerId,
}: {
  msg: ChatMessage;
  viewerId: string;
}) {
  if (msg.type === "SYSTEM" || msg.senderRole === "SYSTEM") {
    return (
      <div className="flex justify-center">
        <span className="max-w-md rounded-xl bg-gray-100 px-3 py-1.5 text-center text-[11px] text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          {msg.body}
        </span>
      </div>
    );
  }
  const mine = msg.senderId === viewerId;
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
          mine
            ? "bg-primary-600 text-white"
            : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
        }`}
      >
        {msg.attachments.length > 0 && (
          <div className="mb-1 grid grid-cols-2 gap-1">
            {msg.attachments.map((u) => (
              <div
                key={u}
                className="relative aspect-square overflow-hidden rounded-lg bg-black/10"
              >
                <Image
                  src={resolveAttachmentUrl(u)}
                  alt="attachment"
                  fill
                  sizes="200px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}
        {msg.body && <p className="whitespace-pre-wrap break-words">{msg.body}</p>}
        <p
          className={`mt-1 text-right text-[10px] ${
            mine ? "text-white/70" : "text-gray-500"
          }`}
        >
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

function groupByDay(msgs: ChatMessage[]) {
  const out: { day: string; label: string; messages: ChatMessage[] }[] = [];
  for (const m of msgs) {
    const d = new Date(m.createdAt);
    const day = d.toDateString();
    let group = out.find((g) => g.day === day);
    if (!group) {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86_400_000).toDateString();
      const label =
        day === today
          ? "Today"
          : day === yesterday
            ? "Yesterday"
            : d.toLocaleDateString([], {
                month: "short",
                day: "numeric",
                year:
                  d.getFullYear() !== new Date().getFullYear()
                    ? "numeric"
                    : undefined,
              });
      group = { day, label, messages: [] };
      out.push(group);
    }
    group.messages.push(m);
  }
  return out;
}
