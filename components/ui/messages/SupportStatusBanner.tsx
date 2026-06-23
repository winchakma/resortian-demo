"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, UserCheck } from "lucide-react";
import { useSocket } from "@/context/SocketContext";
import type { ChatConversation, SupportStatus } from "@/types";

interface Props {
  conversation: ChatConversation;
}

/**
 * Thin banner shown at the top of the customer's support thread. Reflects
 * `supportStatus` and flips in-place when the gateway emits
 * `support:claimed` / `support:released` / `support:resolved` — no refetch.
 */
export default function SupportStatusBanner({ conversation }: Props) {
  const { onSupportClaimed, onSupportReleased, onSupportResolved } = useSocket();
  const [status, setStatus] = useState<SupportStatus | null>(
    conversation.supportStatus,
  );
  const [agentName, setAgentName] = useState<string | null>(
    conversation.assignedAdmin?.name ?? null,
  );

  useEffect(() => {
    setStatus(conversation.supportStatus);
    setAgentName(conversation.assignedAdmin?.name ?? null);
  }, [conversation.id, conversation.supportStatus, conversation.assignedAdmin?.name]);

  useEffect(() => {
    return onSupportClaimed((e) => {
      if (e.conversationId !== conversation.id) return;
      setStatus("ASSIGNED");
      setAgentName(e.assignedAdmin.name);
    });
  }, [conversation.id, onSupportClaimed]);

  useEffect(() => {
    return onSupportReleased((e) => {
      if (e.conversationId !== conversation.id) return;
      setStatus("OPEN");
      setAgentName(null);
    });
  }, [conversation.id, onSupportReleased]);

  useEffect(() => {
    return onSupportResolved((e) => {
      if (e.conversationId !== conversation.id) return;
      setStatus("RESOLVED");
    });
  }, [conversation.id, onSupportResolved]);

  if (status === "ASSIGNED" && agentName) {
    return (
      <Banner
        tone="success"
        icon={<UserCheck className="h-4 w-4" />}
        text={`Agent ${agentName} is helping you.`}
      />
    );
  }
  if (status === "RESOLVED") {
    return (
      <Banner
        tone="muted"
        icon={<CheckCircle2 className="h-4 w-4" />}
        text="This conversation was resolved. Send a message to reopen."
      />
    );
  }
  return (
    <Banner
      tone="info"
      icon={<Clock className="h-4 w-4 animate-pulse" />}
      text="Waiting for an agent to join…"
    />
  );
}

function Banner({
  tone,
  icon,
  text,
}: {
  tone: "info" | "success" | "muted";
  icon: React.ReactNode;
  text: string;
}) {
  const cls =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300"
      : tone === "muted"
        ? "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400"
        : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300";
  return (
    <div
      className={`flex items-center gap-2 border-b px-4 py-2 text-xs font-medium ${cls}`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}
