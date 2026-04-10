import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { CheckoutContent } from "@/components/ui/CheckoutContent";

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <CheckoutContent />
      </main>
      <Footer />
    </>
  );
}
