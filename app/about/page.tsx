import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { AboutContent } from "@/components/ui/AboutContent";

export const metadata: Metadata = {
  title: "About Us | Resortian",
  description:
    "Learn about Resortian — Bangladesh's leading hotel & resort booking platform connecting travelers with premium accommodations across the country.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f0fff0] dark:bg-gray-950">
        <AboutContent />
      </main>
      <Footer />
    </>
  );
}
