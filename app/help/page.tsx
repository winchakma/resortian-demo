import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { HelpContent } from "@/components/ui/HelpContent";

export const metadata: Metadata = {
  title: "Help Center | Resortian",
  description:
    "Find answers to frequently asked questions about bookings, payments, cancellations, and your Resortian account.",
};

export default function HelpPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <HelpContent />
      </main>
      <Footer />
    </>
  );
}
