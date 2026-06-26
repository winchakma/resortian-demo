"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  FileText,
  Image as ImageIcon,
  Megaphone,
  Receipt,
  Scale,
  Sparkles,
  Files,
  ExternalLink,
  RefreshCw,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BASE, fmtDate } from "@/utils";
import type { DocumentCategory, VendorDocument } from "@/types";

const CATEGORY_CONFIG: Record<
  DocumentCategory,
  { label: string; icon: React.ReactNode; pill: string }
> = {
  ANNOUNCEMENT: {
    label: "Announcement",
    icon: <Megaphone className="h-3 w-3" />,
    pill: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  },
  NOTICE: {
    label: "Notice",
    icon: <Sparkles className="h-3 w-3" />,
    pill: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  },
  PAYMENT_PROOF: {
    label: "Payment Proof",
    icon: <Receipt className="h-3 w-3" />,
    pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  },
  RULES: {
    label: "Rules",
    icon: <Scale className="h-3 w-3" />,
    pill: "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400",
  },
  OTHER: {
    label: "Other",
    icon: <Files className="h-3 w-3" />,
    pill: "bg-gray-100 text-black dark:bg-gray-800 dark:text-gray-300",
  },
};

function fileUrl(path: string) {
  return path.startsWith("http") ? path : `${BASE}${path}`;
}

export default function VendorDocumentsSection() {
  const { token } = useAuth();
  const [docs, setDocs] = useState<VendorDocument[] | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/documents/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setDocs(await res.json());
    } catch {
      toast.error("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-black dark:text-white">
            Documents
          </h3>
          <p className="text-xs text-black dark:text-gray-500">
            Notices, announcements & files shared by Resortian admins
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-black transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          title="Refresh"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading && docs === null && (
        <div className="flex items-center justify-center py-24">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
        </div>
      )}

      {docs && docs.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-20 text-center dark:border-gray-700">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <Files className="h-7 w-7 text-black" />
          </div>
          <p className="text-sm font-semibold text-black dark:text-gray-300">
            No documents yet
          </p>
          <p className="mt-1 text-xs text-black">
            When Resortian admins share files with you, they will show up here.
          </p>
        </div>
      )}

      {docs && docs.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {docs.map((doc) => {
            const cfg = CATEGORY_CONFIG[doc.category];
            const isImage = doc.fileType === "IMAGE";
            const isBroadcast = doc.recipientType === "ALL_VENDORS";
            const url = fileUrl(doc.fileUrl);
            return (
              <a
                key={doc.id}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {isImage ? (
                    <Image
                      src={url}
                      alt={doc.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/20">
                      <FileText className="h-12 w-12 text-red-500/80 dark:text-red-400/80" />
                      <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-600 dark:bg-red-950/50 dark:text-red-400">
                        PDF
                      </span>
                    </div>
                  )}
                  <span
                    className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.pill}`}
                  >
                    {cfg.icon}
                    {cfg.label}
                  </span>
                  {isBroadcast && (
                    <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                      <Users className="h-3 w-3" />
                      All
                    </span>
                  )}
                  <span className="absolute right-2 bottom-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                    {isImage ? (
                      <ImageIcon className="h-3.5 w-3.5" />
                    ) : (
                      <ExternalLink className="h-3.5 w-3.5" />
                    )}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1 p-3">
                  <p className="line-clamp-2 text-sm font-semibold text-black dark:text-white">
                    {doc.title}
                  </p>
                  {doc.description && (
                    <p className="line-clamp-2 text-xs text-black dark:text-gray-400">
                      {doc.description}
                    </p>
                  )}
                  <p className="mt-auto pt-1 text-[11px] text-black dark:text-gray-500">
                    {fmtDate(doc.createdAt)}
                    {doc.uploadedBy ? ` · by ${doc.uploadedBy.name}` : ""}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
