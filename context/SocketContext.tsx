"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { getUnreadCount, API_BASE_URL } from "@/utils/chat";
import type { ChatMessage } from "@/types";

interface ConversationUpdate {
  conversationId: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unread?: number;
  side?: "CUSTOMER" | "VENDOR";
}

interface TypingEvent {
  conversationId: string;
  userId: string;
  typing: boolean;
}

export interface SupportClaimedEvent {
  conversationId: string;
  assignedAdmin: { id: string; name: string; avatar?: string | null };
}

export interface SupportSimpleEvent {
  conversationId: string;
}

interface SocketContextValue {
  socket: Socket | null;
  connected: boolean;
  /** Total unread across all the viewer's conversations. */
  totalUnread: number;
  refreshUnread: () => Promise<void>;
  joinConversation: (id: string) => void;
  leaveConversation: (id: string) => void;
  sendMessage: (
    conversationId: string,
    body: { body?: string; attachments?: string[]; clientTempId?: string },
  ) => void;
  markRead: (conversationId: string) => void;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  // Support — admin-side helpers; the customer side reads state via getById
  claimSupport: (conversationId: string) => void;
  releaseSupport: (conversationId: string) => void;
  resolveSupport: (conversationId: string) => void;
  /** Subscribe to message:new events for one conversation. Returns unsubscribe. */
  onMessage: (
    conversationId: string,
    cb: (msg: ChatMessage) => void,
  ) => () => void;
  /** Subscribe to conversation:updated for any conversation. */
  onConversationUpdated: (cb: (u: ConversationUpdate) => void) => () => void;
  onTyping: (cb: (t: TypingEvent) => void) => () => void;
  onMessageAck: (
    cb: (a: { clientTempId: string | null; messageId: string; conversationId: string; createdAt: string }) => void,
  ) => () => void;
  onSupportClaimed: (cb: (e: SupportClaimedEvent) => void) => () => void;
  onSupportReleased: (cb: (e: SupportSimpleEvent) => void) => () => void;
  onSupportResolved: (cb: (e: SupportSimpleEvent) => void) => () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);

  const refreshUnread = useCallback(async () => {
    if (!token) return setTotalUnread(0);
    try {
      const { count } = await getUnreadCount(token);
      setTotalUnread(count);
    } catch {
      // ignore
    }
  }, [token]);

  // (Re)connect on token change. Tear down cleanly when token clears.
  // The setState calls here are unavoidable: we need to expose the socket
  // handle and connection flag to consumers. State is the only React-visible
  // mirror of the external Socket.io subscription, which is exactly the
  // "synchronize with external system" pattern described in the React docs.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!token || !user) {
      setSocket(null);
      setConnected(false);
      setTotalUnread(0);
      return;
    }

    const s = io(`${API_BASE_URL}/chat`, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelayMax: 10_000,
      withCredentials: true,
    });

    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));
    s.on("connect_error", () => setConnected(false));

    setSocket(s);
    void refreshUnread();

    return () => {
      s.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [token, user, refreshUnread]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Keep totalUnread in sync from inbox-level events.
  useEffect(() => {
    if (!socket) return;
    const onUpdated = () => void refreshUnread();
    socket.on("conversation:updated", onUpdated);
    socket.on("message:new", onUpdated);
    return () => {
      socket.off("conversation:updated", onUpdated);
      socket.off("message:new", onUpdated);
    };
  }, [socket, refreshUnread]);

  const joinConversation = useCallback(
    (id: string) => socket?.emit("conversation:join", { conversationId: id }),
    [socket],
  );
  const leaveConversation = useCallback(
    (id: string) => socket?.emit("conversation:leave", { conversationId: id }),
    [socket],
  );
  const sendMessage = useCallback(
    (
      conversationId: string,
      body: { body?: string; attachments?: string[]; clientTempId?: string },
    ) => socket?.emit("message:send", { conversationId, ...body }),
    [socket],
  );
  const markRead = useCallback(
    (conversationId: string) =>
      socket?.emit("message:read", { conversationId }),
    [socket],
  );
  const startTyping = useCallback(
    (conversationId: string) =>
      socket?.emit("typing:start", { conversationId }),
    [socket],
  );
  const stopTyping = useCallback(
    (conversationId: string) =>
      socket?.emit("typing:stop", { conversationId }),
    [socket],
  );

  const claimSupport = useCallback(
    (conversationId: string) =>
      socket?.emit("support:claim", { conversationId }),
    [socket],
  );
  const releaseSupport = useCallback(
    (conversationId: string) =>
      socket?.emit("support:release", { conversationId }),
    [socket],
  );
  const resolveSupport = useCallback(
    (conversationId: string) =>
      socket?.emit("support:resolve", { conversationId }),
    [socket],
  );

  const onMessage = useCallback(
    (conversationId: string, cb: (msg: ChatMessage) => void) => {
      if (!socket) return () => {};
      const handler = (msg: ChatMessage) => {
        if (msg.conversationId === conversationId) cb(msg);
      };
      socket.on("message:new", handler);
      return () => socket.off("message:new", handler);
    },
    [socket],
  );

  const onConversationUpdated = useCallback(
    (cb: (u: ConversationUpdate) => void) => {
      if (!socket) return () => {};
      socket.on("conversation:updated", cb);
      return () => socket.off("conversation:updated", cb);
    },
    [socket],
  );

  const onTyping = useCallback(
    (cb: (t: TypingEvent) => void) => {
      if (!socket) return () => {};
      socket.on("typing", cb);
      return () => socket.off("typing", cb);
    },
    [socket],
  );

  const onMessageAck = useCallback(
    (
      cb: (a: {
        clientTempId: string | null;
        messageId: string;
        conversationId: string;
        createdAt: string;
      }) => void,
    ) => {
      if (!socket) return () => {};
      socket.on("message:ack", cb);
      return () => socket.off("message:ack", cb);
    },
    [socket],
  );

  const onSupportClaimed = useCallback(
    (cb: (e: SupportClaimedEvent) => void) => {
      if (!socket) return () => {};
      socket.on("support:claimed", cb);
      return () => socket.off("support:claimed", cb);
    },
    [socket],
  );
  const onSupportReleased = useCallback(
    (cb: (e: SupportSimpleEvent) => void) => {
      if (!socket) return () => {};
      socket.on("support:released", cb);
      return () => socket.off("support:released", cb);
    },
    [socket],
  );
  const onSupportResolved = useCallback(
    (cb: (e: SupportSimpleEvent) => void) => {
      if (!socket) return () => {};
      socket.on("support:resolved", cb);
      return () => socket.off("support:resolved", cb);
    },
    [socket],
  );

  const value = useMemo<SocketContextValue>(
    () => ({
      socket,
      connected,
      totalUnread,
      refreshUnread,
      joinConversation,
      leaveConversation,
      sendMessage,
      markRead,
      startTyping,
      stopTyping,
      claimSupport,
      releaseSupport,
      resolveSupport,
      onMessage,
      onConversationUpdated,
      onTyping,
      onMessageAck,
      onSupportClaimed,
      onSupportReleased,
      onSupportResolved,
    }),
    [
      socket,
      connected,
      totalUnread,
      refreshUnread,
      joinConversation,
      leaveConversation,
      sendMessage,
      markRead,
      startTyping,
      stopTyping,
      claimSupport,
      releaseSupport,
      resolveSupport,
      onMessage,
      onConversationUpdated,
      onTyping,
      onMessageAck,
      onSupportClaimed,
      onSupportReleased,
      onSupportResolved,
    ],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used inside SocketProvider");
  return ctx;
}

// Optional accessor that returns null instead of throwing — useful for the
// Header icon that may render before the provider mounts in some flows.
export function useSocketOptional() {
  return useContext(SocketContext);
}
