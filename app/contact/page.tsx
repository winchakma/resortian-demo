import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { ContactContent } from "@/components/ui/ContactContent";

export const metadata: Metadata = {
  title: "Contact Us | Resortian",
  description:
    "Get in touch with the Resortian team. We're here to help with bookings, inquiries, and support.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f0fff0] dark:bg-gray-950">
        <ContactContent />
      </main>
      <Footer />
    </>
  );
}
