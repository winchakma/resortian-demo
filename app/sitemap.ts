import type { MetadataRoute } from "next";

/**
 * Dynamic sitemap. Served by Next.js at /sitemap.xml.
 *
 * Sources:
 *   - A curated list of static public pages.
 *   - All hotels from `/hotels` (paginated until exhausted).
 *   - All published blog posts from `/blogs` (paginated until exhausted).
 *
 * Regenerated every hour via `revalidate`, so newly published posts and
 * hotels show up without a fresh deploy.
 */

export const revalidate = 3600; // 1 hour

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://resortian.com"
).replace(/\/$/, "");

const API_BASE =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:3005";

// Public, indexable static routes. Excludes private/transactional pages
// (/profile, /cart, /checkout, /payment/*, /auth/callback).
const STATIC_PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/hotels", priority: 0.9, changeFrequency: "daily" },
  { path: "/destinations", priority: 0.9, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/help", priority: 0.5, changeFrequency: "monthly" },
  { path: "/careers", priority: 0.5, changeFrequency: "monthly" },
  { path: "/advertise", priority: 0.5, changeFrequency: "monthly" },
  { path: "/affiliates", priority: 0.5, changeFrequency: "monthly" },
  { path: "/list-property", priority: 0.5, changeFrequency: "monthly" },
  { path: "/partner-hub", priority: 0.5, changeFrequency: "monthly" },
  { path: "/cancellation", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
  { path: "/auth/customer", priority: 0.3, changeFrequency: "yearly" },
  { path: "/auth/vendor", priority: 0.3, changeFrequency: "yearly" },
];

interface SluggedItem {
  slug: string;
  updatedAt?: string;
  publishedAt?: string;
}

/**
 * Walk a paginated `{ data, meta }` endpoint until exhausted. Uses a hard
 * cap of 50 pages × 100 items so a misbehaving API can't lock the build.
 */
async function fetchAllPaginated<T>(path: string): Promise<T[]> {
  const limit = 100;
  const maxPages = 50;
  const all: T[] = [];

  for (let page = 1; page <= maxPages; page++) {
    const sep = path.includes("?") ? "&" : "?";
    const url = `${API_BASE}${path}${sep}page=${page}&limit=${limit}`;

    let json: unknown;
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) break;
      json = await res.json();
    } catch {
      break;
    }

    const items: T[] = Array.isArray(json)
      ? (json as T[])
      : ((json as { data?: T[] })?.data ?? []);

    all.push(...items);

    if (items.length < limit) break;
  }

  return all;
}

function dateOrNow(...candidates: (string | undefined | null)[]): Date {
  for (const c of candidates) {
    if (!c) continue;
    const d = new Date(c);
    if (!isNaN(d.getTime())) return d;
  }
  return new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Fetch dynamic data in parallel. Failures degrade gracefully — we'd
  // rather emit a partial sitemap than fail the request entirely.
  const [hotels, blogs] = await Promise.all([
    fetchAllPaginated<SluggedItem>("/hotels").catch(() => []),
    fetchAllPaginated<SluggedItem>("/blogs").catch(() => []),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const hotelEntries: MetadataRoute.Sitemap = hotels
    .filter((h) => h?.slug)
    .map((h) => ({
      url: `${SITE_URL}/hotels/${h.slug}`,
      lastModified: dateOrNow(h.updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const blogEntries: MetadataRoute.Sitemap = blogs
    .filter((b) => b?.slug)
    .map((b) => ({
      url: `${SITE_URL}/blog/${b.slug}`,
      lastModified: dateOrNow(b.updatedAt, b.publishedAt),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticEntries, ...hotelEntries, ...blogEntries];
}
