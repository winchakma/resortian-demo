import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { AuthForm } from "@/components/ui/AuthForm";

export const metadata: Metadata = {
  title: "Sign In | Resortian",
  description: "Sign in or create a customer account on Resortian.",
};

export default async function CustomerAuthPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <AuthForm
          role="USER"
          defaultTab={tab === "register" ? "register" : "login"}
        />
      </main>
      <Footer />
    </>
  );
}
