import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { CareersContent } from "@/components/ui/CareersContent";

export const metadata: Metadata = {
  title: "Careers | Resortian",
  description:
    "Join the Resortian team and help us build Bangladesh's leading hotel booking platform.",
};

export default function CareersPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <CareersContent />
      </main>
      <Footer />
    </>
  );
}
