"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  Plus,
  Loader2,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  AlertCircle,
  Tag,
  Clock,
  X,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import type { AffiliateBlog } from "@/types";
import {
  blogImageUrl,
  deleteMyBlog,
  listMyBlogs,
} from "@/lib/affiliateBlogs";
import MyBlogForm from "./MyBlogForm";

type Mode =
  | { kind: "list" }
  | { kind: "create" }
  | { kind: "edit"; id: string };

export default function MyBlogsSection() {
  const { token } = useAuth();
  const [mode, setMode] = useState<Mode>({ kind: "list" });
  const [blogs, setBlogs] = useState<AffiliateBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState<AffiliateBlog | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await listMyBlogs(token, { limit: 50 });
      setBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (mode.kind === "list") void load();
  }, [mode, load]);

  const handleDelete = async () => {
    if (!confirming || !token) return;
    try {
      setDeleting(true);
      await deleteMyBlog(token, confirming.id);
      toast.success("Post deleted");
      setConfirming(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  // ── Form view ─────────────────────────────────────────────────
  if (mode.kind === "create") {
    return (
      <MyBlogForm
        onCancel={() => setMode({ kind: "list" })}
        onSaved={() => setMode({ kind: "list" })}
      />
    );
  }

  if (mode.kind === "edit") {
    return (
      <MyBlogForm
        id={mode.id}
        onCancel={() => setMode({ kind: "list" })}
        onSaved={() => setMode({ kind: "list" })}
      />
    );
  }

  // ── List view ─────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            My Blog Posts
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Submit a blog post for review. Our team will publish it once
            approved.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMode({ kind: "create" })}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" /> New Post
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-primary-600" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      ) : blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white py-16 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
            <BookOpen className="h-7 w-7 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900 dark:text-white">
              No posts yet
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Share your travel stories — submit your first post for review.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMode({ kind: "create" })}
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" /> Write your first post
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {blogs.map((b) => (
            <li
              key={b.id}
              className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-colors hover:border-primary-200 dark:border-gray-700 dark:bg-gray-900 sm:flex-row"
            >
              {/* Cover */}
              <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 sm:h-24 sm:w-36">
                {b.coverImage ? (
                  <Image
                    src={blogImageUrl(b.coverImage)}
                    alt={b.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 144px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <BookOpen className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-gray-900 dark:text-white">
                      {b.title}
                    </h3>
                    <p className="mt-0.5 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                      {b.excerpt}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      b.isPublished
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                    }`}
                  >
                    {b.isPublished ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                    {b.isPublished ? "Published" : "Pending review"}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                  {b.category && (
                    <span className="inline-flex items-center gap-1">
                      <Tag className="h-3 w-3" /> {b.category}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {b.readTime} min read
                  </span>
                  <span>
                    Submitted{" "}
                    {new Date(b.createdAt).toLocaleDateString("en-BD", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-end gap-2">
                  {!b.isPublished && (
                    <>
                      <button
                        type="button"
                        onClick={() => setMode({ kind: "edit", id: b.id })}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirming(b)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </>
                  )}
                  {b.isPublished && (
                    <a
                      href={`/blog/${b.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-900/40 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
                    >
                      <Eye className="h-3 w-3" /> View live post
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Confirm delete */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !deleting && setConfirming(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-900">
            <button
              type="button"
              onClick={() => !deleting && setConfirming(null)}
              className="absolute right-3 top-3 rounded p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Delete &ldquo;{confirming.title}&rdquo;?
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              The draft will be removed permanently.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirming(null)}
                disabled={deleting}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
