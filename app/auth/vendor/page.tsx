import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { AuthForm } from "@/components/ui/AuthForm";

export const metadata: Metadata = {
  title: "Property Owner Sign In | Resortian",
  description: "Sign in or register as a property owner on Resortian.",
};

export default function VendorAuthPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f0fff0] dark:bg-gray-950">
        <AuthForm role="HOTEL_OWNER" />
      </main>
      <Footer />
    </>
  );
}
