import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Tag, User } from "lucide-react";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { getBlogBySlug } from "@/utils/api";

interface Props {
  params: Promise<{ slug: string }>;
}

const SITE_NAME = "Resortian";
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const SITE_URL =
  process.env.NODE_ENV === "production" &&
  configuredSiteUrl?.includes("localhost")
    ? "https://resortian.com"
    : configuredSiteUrl || "https://resortian.com";
const DEFAULT_OG_IMAGE = "/images/hotels/hotel1.jpg";

function absoluteUrl(path?: string | null) {
  if (!path) return `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  if (path.startsWith("//")) return `https:${path}`;

  try {
    return new URL(path, SITE_URL).toString();
  } catch {
    return `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  }
}

function cleanText(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function seoDescription(excerpt: string) {
  const description = cleanText(excerpt);
  return description.length > 160
    ? `${description.slice(0, 157).trim()}...`
    : description;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post || !post.isPublished) {
    return {
      title: "Post Not Found | Resortian",
      robots: { index: false, follow: false },
    };
  }

  const title = `${post.title} | Resortian Blog`;
  const description = seoDescription(post.excerpt);
  const canonicalUrl = absoluteUrl(`/blog/${post.slug}`);
  const image = absoluteUrl(post.coverImage);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    applicationName: SITE_NAME,
    authors: [{ name: post.authorName, url: canonicalUrl }],
    creator: post.authorName,
    publisher: SITE_NAME,
    keywords: [
      post.title,
      post.category,
      "Resortian blog",
      "Bangladesh travel",
      ...post.tags,
    ],
    category: post.category,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "article",
      locale: "en_US",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.authorName],
      section: post.category,
      tags: post.tags,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

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

function youtubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let id: string | null = null;
    if (u.hostname === "youtu.be") {
      id = u.pathname.slice(1).split("?")[0];
    } else if (u.hostname.includes("youtube.com")) {
      id = u.searchParams.get("v");
    }
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function renderContent(html: string) {
  // If content contains HTML tags, render as HTML; otherwise treat as plain text
  const isHtml = /<[a-z][\s\S]*>/i.test(html);
  if (isHtml) {
    return (
      <div
        className="prose prose-gray max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-strong:text-gray-900 dark:prose-strong:text-white"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Plain text / markdown-lite fallback
  return (
    <div className="space-y-4">
      {html.split("\n\n").map((para, i) => {
        if (para.startsWith("**") && para.endsWith("**")) {
          return (
            <h3
              key={i}
              className="mt-6 text-lg font-bold text-gray-900 dark:text-white"
            >
              {para.slice(2, -2)}
            </h3>
          );
        }
        if (para.startsWith("*") && !para.startsWith("**")) {
          return (
            <h4
              key={i}
              className="mt-4 text-base font-semibold italic text-gray-800 dark:text-gray-200"
            >
              {para.slice(1, -1)}
            </h4>
          );
        }
        const parts = para.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p
            key={i}
            className="text-gray-700 leading-relaxed dark:text-gray-300"
          >
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong
                  key={j}
                  className="font-semibold text-gray-900 dark:text-white"
                >
                  {part.slice(2, -2)}
                </strong>
              ) : (
                part
              ),
            )}
          </p>
        );
      })}
    </div>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post || !post.isPublished) notFound();

  const canonicalUrl = absoluteUrl(`/blog/${post.slug}`);
  const imageUrl = absoluteUrl(post.coverImage);
  const description = seoDescription(post.excerpt);
  const articleBody = cleanText(post.content);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${canonicalUrl}#article`,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
      headline: post.title,
      description,
      image: [imageUrl],
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: {
        "@type": "Person",
        name: post.authorName,
        jobTitle: post.authorTitle ?? undefined,
        image: post.authorAvatar ? absoluteUrl(post.authorAvatar) : undefined,
      },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/favicons/android-chrome-512x512.png"),
        },
      },
      keywords: post.tags.join(", "),
      articleSection: post.category,
      articleBody,
      wordCount: articleBody ? articleBody.split(/\s+/).length : undefined,
      timeRequired: `PT${post.readTime}M`,
      isAccessibleForFree: true,
      url: canonicalUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: absoluteUrl("/blog"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: canonicalUrl,
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Cover image */}
        <div className="relative h-72 w-full overflow-hidden sm:h-96 lg:h-[480px]">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary-700 to-primary-500" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Back link */}
          <div className="absolute left-4 top-4 sm:left-6 lg:left-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/60"
            >
              <ArrowLeft className="h-4 w-4" />
              All Articles
            </Link>
          </div>

          {/* Category badge */}
          <div className="absolute bottom-6 left-4 sm:left-6 lg:left-8">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-700"}`}
            >
              <Tag className="h-3 w-3" />
              {post.category}
            </span>
          </div>
        </div>

        {/* Article */}
        <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Title */}
          <h1 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-gray-200 pb-6 dark:border-gray-800">
            {/* Author */}
            <div className="flex items-center gap-3">
              {post.authorAvatar ? (
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={post.authorAvatar}
                    alt={post.authorName}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40">
                  <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {post.authorName}
                </p>
                {post.authorTitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {post.authorTitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readTime} min read
              </span>
            </div>
          </div>

          {/* Excerpt */}
          <p className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            {post.excerpt}
          </p>

          {/* Content */}
          <div className="mt-8">{renderContent(post.content)}</div>

          {/* YouTube embed */}
          {post.youtubeUrl && youtubeEmbedUrl(post.youtubeUrl) && (
            <div className="mt-10">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-red-600 text-[10px] font-bold text-white">
                  ▶
                </span>
                Watch Video
              </div>
              <div className="mt-3 aspect-video w-full overflow-hidden rounded-xl">
                <iframe
                  src={post.youtubeUrl.replace("watch?v=", "embed/")}
                  title={post.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-gray-200 pt-6 dark:border-gray-800">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-primary-100 hover:text-primary-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-primary-900/40 dark:hover:text-primary-300"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Back link */}
          <div className="mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
