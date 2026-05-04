"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock, User, Calendar, Tag, Search, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import type { BlogListItem } from "@/types";

const CATEGORY_COLORS: Record<string, string> = {
  "Destination Guide":
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Insider Tips":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Adventure Travel":
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Eco Travel":
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "Travel Tips":
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const LIMITS = [6, 12, 24] as const;

interface Props {
  posts: BlogListItem[];
  categories: string[];
  initialSearch: string;
  initialCategory: string;
  currentPage: number;
  totalPages: number;
  total: number;
  currentLimit: number;
}

export function BlogContent({
  posts,
  categories,
  initialSearch,
  initialCategory,
  currentPage,
  totalPages,
  total,
  currentLimit,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState(initialCategory || "All");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setQuery(initialSearch); }, [initialSearch]);
  useEffect(() => { setActiveCategory(initialCategory || "All"); }, [initialCategory]);

  function buildParams(search: string, category: string, page: number, limit: number) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category && category !== "All") params.set("category", category);
    if (page > 1) params.set("page", String(page));
    if (limit !== 12) params.set("limit", String(limit));
    return params.toString();
  }

  function push(search: string, category: string, page: number, limit = currentLimit) {
    const qs = buildParams(search, category, page, limit);
    startTransition(() => {
      router.push(`/blog${qs ? `?${qs}` : ""}`, { scroll: false });
    });
  }

  function handleSearchChange(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => push(value, activeCategory, 1), 400);
  }

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    push(query, cat, 1);
  }

  function handlePageChange(page: number) {
    push(query, activeCategory, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleLimitChange(limit: number) {
    push(query, activeCategory, 1, limit);
  }

  function clearAll() {
    setQuery("");
    setActiveCategory("All");
    startTransition(() => { router.push("/blog", { scroll: false }); });
  }

  const hasFilters = query.trim() !== "" || activeCategory !== "All";

  // Build page numbers to show: always first, last, current ±1, with ellipsis
  function pageNumbers(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (currentPage > 3) pages.push("…");
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) {
      pages.push(p);
    }
    if (currentPage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-100">
            Resortian Journal
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Stories &amp; Travel Guides
          </h1>
          <p className="mt-3 max-w-xl text-primary-100">
            Inspiration, tips, and local insight for your next Bangladesh
            adventure.
          </p>

          {/* Search */}
          <div className="mt-6 max-w-md">
            <div className="relative">
              {isPending ? (
                <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-white/60" />
              ) : (
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              )}
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search articles…"
                className="w-full rounded-xl bg-white/20 py-2.5 pl-10 pr-10 text-sm text-white placeholder-white/60 outline-none ring-1 ring-white/30 backdrop-blur-sm transition focus:bg-white/25 focus:ring-white/60"
              />
              {query && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 py-3">
              {["All", ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-primary-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Post grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No articles found{query ? ` for "${query}"` : ""}.
              </p>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="mt-3 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div
              className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200 ${isPending ? "opacity-50" : "opacity-100"}`}
            >
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
                >
                  {/* Thumbnail */}
                  <div className="relative h-52 w-full overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
                      >
                        <Tag className="h-3 w-3" />
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                        <Clock className="h-3 w-3" />
                        {post.readTime} min read
                      </span>
                    </div>

                    <h2 className="text-base font-bold leading-snug text-gray-900 dark:text-white">
                      {post.title}
                    </h2>

                    <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {post.excerpt}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40">
                          <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                            {post.authorName}
                          </p>
                          {post.authorTitle && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {post.authorTitle}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-4 block w-full rounded-xl bg-primary-600 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-700 active:bg-primary-800"
                    >
                      Read More
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Page {currentPage} of {totalPages} &mdash; {total} article{total !== 1 ? "s" : ""}
                </p>
                <select
                  value={currentLimit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  disabled={isPending}
                  className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                >
                  {LIMITS.map((l) => (
                    <option key={l} value={l}>{l} per page</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                {/* Prev */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isPending}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Page numbers */}
                {pageNumbers().map((p, i) =>
                  p === "…" ? (
                    <span key={`ellipsis-${i}`} className="flex h-9 w-9 items-center justify-center text-sm text-gray-400">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      disabled={isPending}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                        p === currentPage
                          ? "bg-primary-600 text-white"
                          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

                {/* Next */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isPending}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
