"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useSocketOptional } from "@/context/SocketContext";

export function MessagesIcon() {
  const socketCtx = useSocketOptional();
  const total = socketCtx?.totalUnread ?? 0;

  return (
    <Link
      href="/profile?tab=messages"
      aria-label={`Messages (${total} unread)`}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-black/10 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    >
      <MessageCircle className="h-5 w-5" />
      {total > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white">
          {total > 9 ? "9+" : total}
        </span>
      )}
    </Link>
  );
}
