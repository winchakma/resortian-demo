import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { CartContent } from "@/components/ui/CartContent";

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <CartContent />
      </main>
      <Footer />
    </>
  );
}
