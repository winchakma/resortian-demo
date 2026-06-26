"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { uploadChatAttachments } from "@/utils/chat";

interface Props {
  conversationId: string;
  onOptimistic: (tempId: string, body: string, attachments: string[]) => void;
  onSent?: () => void;
}

const MAX_FILES = 5;
const MAX_BYTES = 5 * 1024 * 1024;

export default function MessageComposer({
  conversationId,
  onOptimistic,
  onSent,
}: Props) {
  const { token } = useAuth();
  const { sendMessage, startTyping, stopTyping, connected } = useSocket();
  const [body, setBody] = useState("");
  const [pending, setPending] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Typing indicator: ping start on each keypress, debounce stop after 2s idle.
  useEffect(() => () => {
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
  }, []);

  const onBodyChange = (v: string) => {
    setBody(v);
    if (!v) {
      stopTyping(conversationId);
      return;
    }
    startTyping(conversationId);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(
      () => stopTyping(conversationId),
      2000,
    );
  };

  const pickFiles = (files: FileList | null) => {
    if (!files) return;
    const next: File[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) {
        toast.error(`${f.name}: only images allowed`);
        continue;
      }
      if (f.size > MAX_BYTES) {
        toast.error(`${f.name}: max 5 MB`);
        continue;
      }
      next.push(f);
    }
    setPending((p) => [...p, ...next].slice(0, MAX_FILES));
    if (fileRef.current) fileRef.current.value = "";
  };

  const removePending = (idx: number) =>
    setPending((p) => p.filter((_, i) => i !== idx));

  const submit = useCallback(async () => {
    const trimmed = body.trim();
    if (!trimmed && pending.length === 0) return;
    if (!token) return;
    if (!connected) {
      toast.error("Not connected — please try again");
      return;
    }
    const tempId = `temp-${crypto.randomUUID()}`;

    let attachmentUrls: string[] = [];
    if (pending.length > 0) {
      setUploading(true);
      try {
        const res = await uploadChatAttachments(token, pending);
        attachmentUrls = res.urls;
      } catch (err) {
        toast.error((err as Error).message ?? "Upload failed");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    onOptimistic(tempId, trimmed, attachmentUrls);
    sendMessage(conversationId, {
      body: trimmed || undefined,
      attachments: attachmentUrls.length > 0 ? attachmentUrls : undefined,
      clientTempId: tempId,
    });
    setBody("");
    setPending([]);
    stopTyping(conversationId);
    onSent?.();
  }, [
    body,
    pending,
    token,
    connected,
    conversationId,
    onOptimistic,
    sendMessage,
    stopTyping,
    onSent,
  ]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submit();
    }
  };

  return (
    <div className="border-t border-gray-100 p-3 dark:border-gray-800">
      {pending.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {pending.map((f, i) => (
            <div
              key={`${f.name}-${i}`}
              className="relative h-16 w-16 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <Image
                src={URL.createObjectURL(f)}
                alt={f.name}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => removePending(i)}
                className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
                aria-label="Remove"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-xl p-2 text-black hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Attach image"
        >
          <ImagePlus className="h-5 w-5" />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => pickFiles(e.target.files)}
        />
        <textarea
          rows={1}
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Write a message…"
          className="max-h-32 min-h-[40px] flex-1 resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
        <button
          type="button"
          onClick={() => void submit()}
          disabled={uploading || (!body.trim() && pending.length === 0)}
          className="rounded-xl bg-primary-600 p-2 text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
