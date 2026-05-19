import { Suspense } from "react";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { CheckoutContent } from "@/components/ui/CheckoutContent";

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f0fff0] dark:bg-gray-950">
        <Suspense>
          <CheckoutContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
