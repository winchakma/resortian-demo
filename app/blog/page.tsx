import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { BlogContent } from "@/components/ui/BlogContent";
import { getBlogs } from "@/utils/api";

export const metadata: Metadata = {
  title: "Blog | Resortian",
  description:
    "Travel tips, destination guides, and stories from the most beautiful corners of Bangladesh.",
  openGraph: {
    title: "Blog | Resortian",
    description:
      "Travel tips, destination guides, and stories from the most beautiful corners of Bangladesh.",
    type: "website",
  },
};

const VALID_LIMITS = [6, 12, 24] as const;
type Limit = (typeof VALID_LIMITS)[number];

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const { search, category, page, limit } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const parsedLimit = parseInt(limit ?? "6", 10);
  const currentLimit: Limit = (VALID_LIMITS as readonly number[]).includes(
    parsedLimit,
  )
    ? (parsedLimit as Limit)
    : 6;

  let posts: Awaited<ReturnType<typeof getBlogs>>["data"] = [];
  let totalPages = 1;
  let total = 0;
  try {
    const result = await getBlogs({
      limit: currentLimit,
      page: currentPage,
      search: search || undefined,
      category: category || undefined,
    });
    posts = result.data;
    totalPages = result.meta.totalPages;
    total = result.meta.total;
  } catch {
    posts = [];
  }

  // Fetch all posts once (no filters) just to derive the category list
  let categories: string[] = [];
  try {
    const all = await getBlogs({ limit: 100 });
    categories = [...new Set(all.data.map((p) => p.category))].filter(Boolean);
  } catch {
    categories = [];
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f0fff0] dark:bg-gray-950">
        <BlogContent
          posts={posts}
          categories={categories}
          initialSearch={search ?? ""}
          initialCategory={category ?? ""}
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          currentLimit={currentLimit}
        />
      </main>
      <Footer />
    </>
  );
}
