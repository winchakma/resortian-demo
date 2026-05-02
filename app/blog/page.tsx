import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { BlogContent } from "@/components/ui/BlogContent";

export const metadata: Metadata = {
  title: "Blog | Resortian",
  description:
    "Travel tips, destination guides, and stories from the most beautiful corners of Bangladesh.",
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <BlogContent />
      </main>
      <Footer />
    </>
  );
}
