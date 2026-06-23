import type { ChatConversation, ChatMessage } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";

export const API_BASE_URL = BASE;

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string })?.message ?? "Request failed");
  }
  return data as T;
}

export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface MessagesPage {
  data: ChatMessage[];
  meta: { nextCursor: string | null; hasMore: boolean };
}

export function listConversations(
  token: string,
  page = 1,
  limit = 20,
): Promise<Paginated<ChatConversation>> {
  return request<Paginated<ChatConversation>>(
    `/conversations?page=${page}&limit=${limit}`,
    {},
    token,
  );
}

/**
 * Returns the customer's persistent support thread, lazily creating it on
 * first call. Used to pin the Support row in the messages list.
 */
export function getSupportConversation(token: string): Promise<ChatConversation> {
  return request<ChatConversation>(`/support/conversation`, {}, token);
}

export function getUnreadCount(token: string): Promise<{ count: number }> {
  return request<{ count: number }>(
    `/conversations/unread-count`,
    {},
    token,
  );
}

export function getConversation(
  token: string,
  id: string,
): Promise<ChatConversation> {
  return request<ChatConversation>(`/conversations/${id}`, {}, token);
}

export function listMessages(
  token: string,
  conversationId: string,
  cursor?: string,
  limit = 30,
): Promise<MessagesPage> {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  params.set("limit", String(limit));
  return request<MessagesPage>(
    `/conversations/${conversationId}/messages?${params}`,
    {},
    token,
  );
}

export function sendMessageRest(
  token: string,
  conversationId: string,
  body: { body?: string; attachments?: string[]; clientTempId?: string },
): Promise<ChatMessage> {
  return request<ChatMessage>(
    `/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    token,
  );
}

export function markConversationRead(
  token: string,
  conversationId: string,
): Promise<{ conversationId: string; side: "CUSTOMER" | "VENDOR" }> {
  return request(
    `/conversations/${conversationId}/read`,
    { method: "POST" },
    token,
  );
}

export async function uploadChatAttachments(
  token: string,
  files: File[],
): Promise<{ urls: string[] }> {
  const fd = new FormData();
  files.forEach((f) => fd.append("files", f));
  return request<{ urls: string[] }>(
    `/chat/uploads`,
    { method: "POST", body: fd },
    token,
  );
}

/** Prefix a server-relative image path (`/images/...` / `/uploads/...`). */
export function resolveAttachmentUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}
